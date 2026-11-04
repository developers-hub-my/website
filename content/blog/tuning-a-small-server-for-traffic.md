---
title: "Tuning a Small Server for More Traffic"
description: "On one small server, a few setting changes took our app from 15 to over 1,100 requests a second. Here is what made the difference, and what did not."
date: 2026-11-04
updated: 2026-11-04
author: Nasrul Hazim
authorTitle: Managing Director
tags:
  - Performance
  - Laravel
  - PHP
  - k6
cover: /images/blog/tuning-a-small-server-for-traffic/cover.webp
coverAlt: "Cover banner for Tuning a Small Server for More Traffic"
canonical: ''
draft: false
---

## TL;DR

On one 2 vCPU, 2 GB server, we took a Laravel app from about 15 to 1,167 requests a second. Almost all of it was server settings, changed one at a time and measured with k6 from a separate machine.

| Step | Requests/sec |
|---|---|
| Start | ~15 |
| PHP worker pool sized from memory, Laravel caches, OPcache | 130 |
| Removed the health-check page from the test mix | 698 |
| Turned off `open_basedir` | 1,167 |

**What mattered most:**

- **Too few PHP workers cap your speed**, even with the CPU idle. Size the pool from available memory.
- **More workers do not help once the CPU is full.**
- **Build Laravel's caches on every release.**
- **Some PHP settings are accepted and ignored.** OPcache memory set in the pool file never applied. Set it on the main PHP process and check it there.
- **`open_basedir` turns off a PHP cache** and cost us about a third of our CPU. Only remove it where one app owns the server, because it is a security boundary.
- **nginx's default connection limit is low** and can only be raised in the main config file.
- **Test method matters:** leave health checks out, ignore the first minute, and size your server from logged-in actions, not guest page views.

> Short on time? The summary above is the whole story. Want the details, the examples and the fixes? Read on.

We took a small Laravel app from about 15 requests per second to 1,167 on a 2 vCPU server. Most of the gain came from server configuration. Very little came from rewriting application code.

Two lessons stood out. The first is that PHP will accept a setting, report it back to you as applied, and then not use it. The second is that one security default, `open_basedir`, cost us roughly a third of our CPU on every request.

This post walks through what we measured, what we changed, and what each change was worth.

## The setup

These are our numbers for one app on one VM. Read them as a case study. Your app, your hardware and your traffic mix will give different results.

| Item | Value |
|---|---|
| Server | One VM, 2 vCPU, 2 GB RAM |
| Stack | nginx, PHP-FPM, Laravel, database on the same VM |
| App | A small storefront we will call "shop" |
| Traffic | GET requests only, guest users |
| Load generator | k6 on a separate 2 vCPU VM |
| Target | The origin IP directly, with no CDN in front |

The method was simple. We ran k6 from its own machine so the load generator never competed with the app for CPU. We hit the origin IP so no cache or CDN could hide a slow response. And we changed one thing between runs, so every difference in the results table has one cause.

Here is a minimal version of the k6 script we used. It ramps to a target number of virtual users (VUs), picks a random path on each iteration, and fails the run if more than 1% of requests fail or if p95 latency goes above two seconds.

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://203.0.113.10';
const HOST = __ENV.HOST || 'shop.example.com';

const paths = ['/', '/products', '/products/42', '/about'];

export const options = {
  stages: [
    { duration: '1m', target: 100 },
    { duration: '3m', target: 500 },
    { duration: '2m', target: 500 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<2000'],
  },
};

export default function () {
  const path = paths[Math.floor(Math.random() * paths.length)];
  const res = http.get(`${BASE_URL}${path}`, { headers: { Host: HOST } });

  check(res, { 'status is 200': (r) => r.status === 200 });
  sleep(1);
}
```

```bash
k6 run -e BASE_URL=http://203.0.113.10 -e HOST=shop.example.com shop.js
```

Setting the `Host` header lets you hit the origin IP while nginx still routes the request to the right server block.

## Results

![Bar chart on one scale of requests per second across four runs on a 2 vCPU server: about 15 at baseline, 130 after FPM pool sizing, Laravel caches and OPcache, 698 after removing the health endpoint from the test mix (a test fix, the app did not change), and 1,167 with open_basedir off](/images/blog/tuning-a-small-server-for-traffic/results.webp)

| Run | VUs | req/s | p95 | Failed |
|---|---|---|---|---|
| Baseline | 200 | ~15 | 13 s | 10% |
| FPM sizing + Laravel caches + OPcache | 500 | 130 | 5.3 s | 0% (CPU at 100%) |
| Health endpoint removed from the path mix | 500 | 698 | 1.18 s | 0% of 131,968 |
| `open_basedir` off | 500 | 1,166.7 (last window 1,545) | 341.7 ms | 0.00% of 211,432 |

The third row is a correction to our test method. The app did not change between rows two and three. We cover why further down.

## Change 1: Size PHP-FPM from RAM

### What we saw

A 10-VU smoke test returned 13.3 requests per second. CPU was mostly idle. Requests were slow, and adding more VUs made them slower without raising throughput.

### Why

With a fixed `pm.max_children`, the pool has a hard ceiling:

```plain
max throughput = workers ÷ average request time
               = 6 ÷ 0.45 s
               = 13.3 req/s
```

That matched the smoke test exactly. Once all six workers are busy, every new request waits in the socket backlog. The CPU sits idle because nothing is running. The requests are queued.

### The config

We now size the pool from available memory instead of picking a number:

```plain
reserve     = max(768 MB, RAM ÷ 4)
workers     = (RAM − reserve) ÷ worker size
worker size ≈ 80 MB
cap         = 8 workers per vCPU
```

On 2 GB that gives (2048 − 768) ÷ 80 = 16 workers, which is also the cap for 2 vCPU.

```ini
; /etc/php/8.4/fpm/pool.d/shop.conf
pm = dynamic
pm.max_children = 16
pm.start_servers = 4
pm.min_spare_servers = 2
pm.max_spare_servers = 6
pm.max_requests = 1000
```

We use `pm = dynamic` because we run blue/green pools during a deploy. Two `static` pools of 16 would each hold all their memory at once. Two dynamic pools only grow when traffic reaches them, so the old pool shrinks as the new one takes over.

### Measured effect

Combined with the next two changes, this took us from about 15 req/s to 130 req/s at 500 VUs with zero failures. At that point CPU was at 100%.

## Change 2: More workers do not help once you are CPU-bound

### What we saw

With CPU pegged, we tried 24 workers to see if more parallelism would help. Throughput dropped to 120 req/s, against 130 with the derived pool of 16.

### Why

Once the CPU is saturated, extra workers only add context switching and memory pressure. Each request still needs the same CPU time, and there is no more CPU to give.

### What to do

Before you raise `pm.max_children`, look at CPU across the whole run. If it is near 100%, the fix is less work per request. If it is low while latency climbs, the pool is too small.

## Change 3: Run Laravel's caches on every release

### What we saw

`config:cache`, `route:cache` and `event:cache` had never run on the server. Every request was parsing config files, building the route table and discovering event listeners.

### Why

Nothing in the release process ran them. The ordering also matters: `config:cache` freezes whatever `.env` holds at that moment. Cached config built from an `.env` that is written again afterwards is worse than no cache.

### The config

Run them per release, after the last write to `.env`, and fail the deploy if any of them fails:

```bash
#!/usr/bin/env bash
set -euo pipefail

cd "$RELEASE_DIR"

# .env is final at this point
php artisan config:cache
php artisan route:cache
php artisan event:cache
php artisan view:cache
```

With `set -e`, a broken route file or a closure in a route stops the deploy instead of shipping an uncached app.

## Change 4: OPcache settings in the pool file are ignored

This one cost us the most time.

### What we saw

We set `opcache.memory_consumption` and `opcache.max_accelerated_files` in the FPM pool file. FPM started without complaint. `php -i | grep opcache` showed the new values. Under load, OPcache was still running at 128 MB and 10,000 files, and it kept evicting scripts.

### Why

OPcache allocates its shared memory when the PHP module starts, inside the FPM master. The pool files are read after that. A `php_admin_value[opcache.memory_consumption]` line in a pool is accepted and never takes effect.

`php -i` runs the CLI binary with the CLI ini files. It tells you nothing about what the FPM master is using.

### The config

We pass the values as `-d` flags on the FPM master through a systemd drop-in:

```ini
# /etc/systemd/system/php8.4-fpm.service.d/override.conf
[Service]
ExecStart=
ExecStart=/usr/sbin/php-fpm8.4 --nodaemonize --fpm-config /etc/php/8.4/fpm/php-fpm.conf \
  -d opcache.memory_consumption=128 \
  -d opcache.max_accelerated_files=32531 \
  -d realpath_cache_size=4096K \
  -d realpath_cache_ttl=600
```

```bash
systemctl daemon-reload
systemctl restart php8.4-fpm
```

The values we use:

| Setting | Value |
|---|---|
| `opcache.memory_consumption` | RAM ÷ 16, clamped to 128–256 MB |
| `opcache.max_accelerated_files` | 32531 |
| `realpath_cache_size` | 4096K |
| `realpath_cache_ttl` | 600 |

On a 2 GB VM the memory formula lands on 128 MB, the same as the default. The gain on this box came from the file limit and the realpath cache. On larger servers the memory value matters too.

These flags only apply when the master restarts. A `systemctl reload` sends USR2, which reloads workers under the same master, and the old OPcache allocation stays in place.

### How to verify

Ask FPM itself. A throwaway script, run through the FPM socket, avoids exposing anything on the web:

```php
<?php
// /tmp/opcache-check.php
$s = opcache_get_status(false);
$c = opcache_get_configuration()['directives'];

echo json_encode([
    'memory_mb'  => $c['opcache.memory_consumption'] / 1024 / 1024,
    'max_files'  => $c['opcache.max_accelerated_files'],
    'used_mb'    => round($s['memory_usage']['used_memory'] / 1024 / 1024, 1),
    'cached'     => $s['opcache_statistics']['num_cached_scripts'],
    'hit_rate'   => round($s['opcache_statistics']['opcache_hit_rate'], 2),
    'realpath'   => ini_get('realpath_cache_size'),
], JSON_PRETTY_PRINT), PHP_EOL;
```

```bash
SCRIPT_FILENAME=/tmp/opcache-check.php REQUEST_METHOD=GET \
  cgi-fcgi -bind -connect /run/php/php8.4-fpm.sock
rm /tmp/opcache-check.php
```

`cgi-fcgi` comes from the `libfcgi-bin` package on Debian and Ubuntu. If the numbers match what you set, the master has them.

## Change 5: Two OPcache settings to handle with care

`opcache.validate_timestamps=0` stops PHP from checking file modification times on every include. It is a real saving, and it is safe only if every release starts a fresh FPM master. With blue/green pools that each get their own master, that holds. If you deploy by swapping a symlink under a long-running master, the old bytecode stays in memory and your deploy appears to do nothing.

`opcache.enable_file_override` makes `file_exists()` and `is_file()` answer from the OPcache. We turned it on and it broke compiled Blade views. Our views live in shared storage across releases. After `view:clear`, the cache still claimed the old compiled files existed, and Laravel failed with `filemtime(): stat failed`. We left it off.

## Change 6: open_basedir disables the realpath cache

### What we saw

After the method fix below, we were at 698 req/s with CPU at 100%. The pool was sized, the caches were built, and OPcache was confirmed through FPM. Each request still cost more CPU than it should.

### Why

When `open_basedir` is set, PHP stops using its realpath cache, so every include resolves its path from the filesystem again. A Laravel request includes hundreds of files. On our app this added roughly 35–40% CPU per request.

### The config

```ini
; /etc/php/8.4/fpm/pool.d/shop.conf
; open_basedir removed: one app owns this server
; php_admin_value[open_basedir] = /var/www/shop:/tmp
```

> Removing `open_basedir` removes a security boundary. It limits which paths a compromised PHP process can read. We only do this where one app owns the whole server and nothing else of value lives on it. On a shared host with several apps or several customers, keep it and accept the CPU cost.

### Measured effect

| | Before | After |
|---|---|---|
| req/s | 698 | 1,166.7 (last window 1,545) |
| p95 | 1.18 s | 341.7 ms |
| Failed | 0% | 0.00% of 211,432 |

The "last window" figure is the final reporting interval, once the ramp had finished and the caches were warm.

## Change 7: nginx defaults are too small for real concurrency

### What we saw

During one higher run with 1,000 concurrent users, 98% of requests were reset. The nginx error log said `768 worker_connections are not enough`.

### Why

Debian ships `worker_connections 768`. EL9 ships 1024. Each proxied request to FPM uses at least two connections, one to the client and one upstream, so the real ceiling is lower than the number suggests.

The directive lives in the `events` block in the main config. You cannot set it from a file in `conf.d` or from a server block. A site-level config can never fix it.

### The config

```nginx
# /etc/nginx/nginx.conf
worker_processes auto;
worker_rlimit_nofile 65535;

events {
    worker_connections 4096;
    multi_accept on;
}
```

Since this edits a file every site depends on, we back it up, test it, and roll back on failure:

```bash
cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.bak
# apply the edit here
if nginx -t; then
  systemctl reload nginx
else
  cp /etc/nginx/nginx.conf.bak /etc/nginx/nginx.conf
  echo "nginx -t failed, restored previous config" >&2
  exit 1
fi
```

Keep site tuning such as gzip and buffer sizes inside each `server` block. If you put `gzip on;` at `http` level in a `conf.d` file and the main config already sets it, nginx reports a duplicate directive. `nginx -t` then fails, and every site on the server is blocked from reloading.

```nginx
server {
    server_name shop.example.com;

    gzip on;
    gzip_types text/css application/javascript application/json image/svg+xml;
    fastcgi_buffers 16 16k;
    fastcgi_buffer_size 32k;

    # ...
}
```

## Mistakes in our test method

Two of our biggest "improvements" were corrections to how we measured.

**The health endpoint skewed the mix.** Our first path list included `/up`, Laravel's health route. It looks cheap, and it is a full framework boot that cost about 49 ms of CPU per call. With four real pages and one health check, a fifth of the load was a route no user ever visits. Removing it took us from 130 to 698 req/s with no app change. Test the pages people use, in roughly the proportions they use them.

**We read the first minute.** Early in a run, CPU showed 26%. Later in the same run it was at 100%. The first minute covers the ramp and cold caches. Read whole-run metrics, or the steady part of the run, before you decide where the bottleneck is.

**Guest GETs do not size the server.** An authenticated POST on this app costs about 300 ms of CPU. That works out to around 6 req/s on 2 vCPU. Guest page views are the easy part. Plan capacity from your write traffic: sign-ups, checkouts, form submissions.

**Run the load generator elsewhere and hit the origin.** k6 running on the app server steals the CPU you are trying to measure. A CDN in front hides the origin. We ran k6 from its own 2 vCPU VM against the origin IP, and that is the only reason the numbers mean anything.

## App-side wins

The server work moved the ceiling. These changes reduced work per request:

- Cut queries per page from 27 to 19.
- Served the sign-in page at `/` to skip a redirect on the most common entry point.
- Removed about 500 ms of bcrypt work from guest sign-up.
- Added a guest page cache that answers before the framework boots.
- Served Livewire's JS assets as a static file through nginx instead of a PHP route.
- Turned on persistent database connections.
- Added ETag and `304 Not Modified` responses for files read from storage.

## Checklist

| Check | How |
|---|---|
| Load generator is on a separate machine | k6 on its own VM |
| You are hitting the origin | Origin IP plus `Host` header, no CDN |
| One change per run | Record each run in a table |
| Path mix matches real traffic | No health checks in the mix |
| You read whole-run CPU | Ignore the first minute |
| FPM pool sized from RAM | `(RAM − reserve) ÷ ~80 MB`, cap 8 per vCPU |
| Pool size matches the CPU picture | Idle CPU and high latency means too few workers |
| Laravel caches built per release | After the last `.env` write, deploy fails on error |
| OPcache values set on the FPM master | `-d` flags in `ExecStart`, full restart |
| OPcache verified through FPM | `opcache_get_status()` via the socket, never `php -i` |
| `validate_timestamps=0` only with a fresh master per release | |
| `enable_file_override` left off | Breaks compiled views in shared storage |
| `open_basedir` decision made deliberately | Off only where one app owns the server |
| nginx `worker_connections` raised in `nginx.conf` | 4096, `multi_accept on`, `worker_rlimit_nofile 65535` |
| nginx changes tested with rollback | Backup, `nginx -t`, restore on failure |
| Site tuning stays in `server` blocks | Avoid duplicate `http`-level directives |
| Capacity planned from write traffic | Measure authenticated POST cost |

None of these changes are exotic. Most are defaults that were wrong for our workload, or settings we believed were applied and were not. Measure from outside, change one thing, and verify the setting from the process that serves traffic.
