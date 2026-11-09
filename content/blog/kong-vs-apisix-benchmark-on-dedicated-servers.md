---
title: "Kong OSS vs Apache APISIX: Benchmark on Dedicated Servers"
description: "We load-tested Kong OSS 3.9.4 and Apache APISIX 3.19.0 with the same plugin chains on dedicated 4 vCPU servers. Here is what we found, and what the numbers cannot tell you."
date: 2026-11-09
updated: 2026-11-09
author: Nasrul Hazim
authorTitle: Managing Director
tags:
  - Engineering
  - Performance
  - k6
  - API Gateway
cover: /images/blog/kong-vs-apisix-benchmark-on-dedicated-servers/cover.webp
coverAlt: "Cover banner for Kong OSS vs Apache APISIX, showing p99 latency of 37.5 ms on Kong and 12.1 ms on APISIX at 3,000 requests per second"
canonical: ''
draft: false
---

## TL;DR

We ran Kong OSS 3.9.4 and Apache APISIX 3.19.0 with the same plugin chains on a dedicated 4 vCPU server, at 1,500, 3,000 and 6,000 requests per second. At default settings, APISIX was faster or tied in every latency comparison, and it used less CPU and memory.

| Measure, full plugin chain | Kong OSS 3.9.4 | APISIX 3.19.0 |
|---|---|---|
| p99 at 1,500 RPS | 2.63 ms | 2.22 ms |
| p99 at 3,000 RPS | 37.5 ms | 12.1 ms |
| Failed requests at 6,000 RPS | 19 to 20% | 0% |
| CPU per request | 1.03 ms | 0.34 ms |
| Gateway memory | 491 MB | 182 MB |

**What mattered most:**

- **At 1,500 RPS the choice barely shows.** The largest p99 gap on any chain was about 1 ms.
- **The gap opens as load rises.** At 3,000 RPS, Kong used 3.07 of 4 cores on the full chain and APISIX used 0.98.
- **New routes went live far faster on APISIX:** 12 ms against 3.9 seconds, which fits Kong's default 5-second polling.
- **Neither gateway failed a request** when its config store was stopped for 20 seconds.
- **We did not run a long soak or a route-scale test,** so this is not a capacity claim.
- **Performance is only part of the decision.** Patch history matters at least as much, and neither project has a simple story there.

> Short on time? The summary above is the whole story. Want the method, the limits and the patch history? Read on.

We ran this test because we could not find one to rely on. The best-known comparison of the two gateways was published by API7, the company behind APISIX, in 2022, and it covers the 3.0 versions. We wanted current versions, real plugin chains and tail latency. The method and the limits are below so that you can judge the numbers for yourself.

## The setup

![Architecture of the benchmark rig. Host 1 runs k6 and sends 1,500 to 6,000 requests per second over HTTP to Host 2, which runs Kong 3.9.4 or APISIX 3.19.0, one at a time. Host 2 proxies requests to the upstream nginx on Host 3. Kong reads its config from Postgres and APISIX from etcd, both on Host 3, and the full chain sends TCP logs to a log sink on Host 3. Redis on Host 3 is used for functional checks only. A dashed control path goes from k6 directly to the upstream with no gateway. Each host has 4 dedicated vCPU and 8 GB of RAM](/images/blog/kong-vs-apisix-benchmark-on-dedicated-servers/rig.webp)

| Item | Value |
|---|---|
| Servers | Three DigitalOcean CPU-optimised droplets, 4 dedicated vCPU and 8 GB each, on one private network |
| Host 1 | k6 load generator |
| Host 2 | The gateways, one at a time |
| Host 3 | Upstream nginx, Postgres, etcd, Redis and a log sink |
| Kong | 3.9.4, Postgres mode, 4 workers |
| APISIX | 3.19.0, etcd, 4 workers |
| Tuning | None. Both ran at default settings in Docker |

We tested four plugin chains, from a bare proxy up to the kind of authenticated, logged route a production API usually has.

| Chain | Plugins |
|---|---|
| Proxy only | None |
| Secured route | JWT, IP restriction, path rewrite |
| Managed API | Key auth, ACL, local rate limit |
| Full chain | Secured route plus TCP logging |

Before measuring anything, we ran 19 functional checks on each gateway to prove that the plugins really worked: requests were rejected, limited and rewritten as expected. Both gateways passed all 19. A benchmark of a plugin that silently does nothing tells you nothing.

## How we measured

We used k6's `constant-arrival-rate` executor. A closed-loop test sends the next request only after the last one returns, so it slows down when the server slows down, which hides the very latency you are trying to find. An open model keeps sending requests on schedule.

![Illustration comparing two load test models during the same server slowdown. In a closed loop, requests sent drop with the server and latency looks mild. In an open model, requests sent stay unchanged and latency rises to show the real queue. This is an illustration, not measured data](/images/blog/kong-vs-apisix-benchmark-on-dedicated-servers/load-model.webp)

The other rules were simple:

- **Three runs of every combination,** with the gateway order alternated between runs.
- **A 10-second warm-up** discarded before each 45-second measurement.
- **A control with no gateway at all.** We measured the upstream directly at each rate and subtracted that from each gateway's p99, which gives the latency the gateway added.
- **A run counted for latency only if under 1% of its arrivals were dropped.** 78 of 81 runs qualified.
- **A gateway led a comparison only if every run beat every run of the other by more than 10%.** Anything less was a tie.

The whole matrix took about 80 minutes.

## Results

![Bar chart of p99 latency on the full plugin chain. At 1,500 requests per second Kong is 2.63 ms and APISIX 2.22 ms. At 3,000, Kong is 37.5 ms and APISIX 12.1 ms. At 6,000, APISIX is 61.2 ms and Kong has no counted result because 19 to 20 percent of its requests failed](/images/blog/kong-vs-apisix-benchmark-on-dedicated-servers/results.webp)

Across the 12 combinations of rate and chain, APISIX led 9, three were ties, and Kong led none.

![Bar charts of median p99 latency in milliseconds for four plugin chains at three rates. At 1,500 RPS, Kong and APISIX are: Proxy only 1.17 and 1.16, Secured route 1.58 and 1.37, Managed API 2.18 and 1.20, Full chain 2.63 and 2.22. At 3,000 RPS: Proxy only 1.21 and 1.06, Secured route 2.53 and 1.45, Managed API 4.97 and 1.18, Full chain 37.5 and 12.1. At 6,000 RPS: Proxy only 8.37 and 8.51, Secured route 173 and 10.8, Managed API 152 and 8.94, Full chain Kong failed 19 to 20 percent of requests and APISIX 61.2](/images/blog/kong-vs-apisix-benchmark-on-dedicated-servers/p99-by-chain.webp)

The direct control's p99 was 0.59 ms at 1,500 RPS, 0.58 ms at 3,000 RPS and 8.73 ms at 6,000 RPS. That jump at 6,000 RPS means small differences at that rate are noise, which is why the Proxy only chain counts as a tie there. Read 6,000 RPS for failures and large gaps only.

CPU told the same story, and it is the number we trust most because it barely moved between runs at the same rate.

![Bar chart of median CPU milliseconds per request, Kong then APISIX. Proxy only 0.23 and 0.17. Secured route 0.39 and 0.30. Managed API 0.80 and 0.22. Full chain 1.03 and 0.34](/images/blog/kong-vs-apisix-benchmark-on-dedicated-servers/cpu-per-request.webp)

Route propagation and memory were further apart than we expected.

![Two bar charts. A new route went live in a median of 3.9 seconds on Kong and 12 milliseconds on APISIX. Median gateway memory was 491 MB on Kong and 182 MB on APISIX](/images/blog/kong-vs-apisix-benchmark-on-dedicated-servers/operations.webp)

With the config store stopped for 20 seconds, neither gateway failed a request on existing routes.

## Before you quote these numbers

- **Logging differs on the full chain.** At default settings, Kong's `tcp-log` sends per request and APISIX's `tcp-logger` sends in batches. The two chains without logging point the same way, but the size of the full-chain gap is partly a logging difference.
- **We did not tune either gateway.** Shorter polling would change Kong's route-propagation result, and other settings could change more.
- **We did not profile the cause** of any gap. We can tell you what happened, not why.
- **Each measurement is 45 seconds.** We did not run a 60-minute soak, so memory growth and sustained capacity are unknown.
- **We did not test thousands of routes,** and we did not load-test the API-key-only, JWT-only or Redis rate-limit chains.
- **The upstream and the config stores shared one host.** The gateways had a host to themselves.

These are our numbers, on our rig, with our chains. Your plugins and traffic will give different results.

## Performance is not the whole decision

For a gateway that sits in front of everything, the patching story counts at least as much as p99.

Kong's OSS 3.9 line is still receiving releases, but irregularly. The gaps between 3.9.0 and 3.9.4 were 173, 365, 13 and 117 days, according to its [GitHub releases](https://github.com/Kong/kong/releases).

APISIX moves much faster. Apache's [security advisory page](https://security.apache.org/projects/apisix/) listed 26 CVEs numbered 2026 when we checked in November 2026, and this year's fixes arrived in new minor releases about every two months. Staying patched therefore means upgrading across feature releases, on every node you run.

Do not compare those two facts as a score. A high CVE count partly reflects active reporting, and a low one on a slow-moving branch is not proof of safety. They do describe two different kinds of operational work.

## If you are comparing gateways yourself

Run the chains you actually use, keep a no-gateway control, and check that your plugins work before you time them.
