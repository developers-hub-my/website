// Prebuild step: bake GatherHub event payloads for every class in
// src/data/classes.json that carries a gatherhub_event_uuid.
//
// FAILURE MODE (contract rule — do not soften): any fetch, validation, or
// missing-env failure for a UUID-bearing class fails the ENTIRE build, naming
// the class slug, the UUID, and the reason. Netlify keeps the last successful
// deploy live, so a failed build means yesterday's correct page stays up; a
// silent waitlist fallback would show an open class as closed on a live page.
//
// Classes without a UUID are fine — they render in evergreen/waitlist mode.
import crypto from 'node:crypto';
import fs from 'node:fs';
import { EventPayloadSchema } from './gatherhub-contract.mjs';

const CLASSES_FILE = 'src/data/classes.json';
const OUTPUT_FILE = 'src/data/gatherhub.generated.json';

function fail(message) {
  console.error(`\n✖ GatherHub prefetch failed: ${message}\n`);
  process.exit(1);
}

try {
  process.loadEnvFile();
} catch {
  // No .env file — fine; CI provides env vars directly.
}

const classes = JSON.parse(fs.readFileSync(CLASSES_FILE, 'utf8'));
const liveClasses = classes.filter((cls) => cls.gatherhub_event_uuid);

if (liveClasses.length === 0) {
  fs.writeFileSync(OUTPUT_FILE, '{}\n');
  console.log('GatherHub prefetch: no classes carry a gatherhub_event_uuid — evergreen mode.');
  process.exit(0);
}

const required = [
  'GATHERHUB_BASE_URL',
  'GATHERHUB_CLIENT_KEY',
  'GATHERHUB_CLIENT_SECRET',
  'GATHERHUB_CLIENT_DOMAIN',
];
const missing = required.filter((name) => !process.env[name]);

if (missing.length > 0) {
  fail(
    `classes [${liveClasses.map((c) => c.slug).join(', ')}] need live GatherHub data, `
      + `but env vars are missing: ${missing.join(', ')}`
  );
}

const baseUrl = process.env.GATHERHUB_BASE_URL.replace(/\/$/, '');
const key = process.env.GATHERHUB_CLIENT_KEY;
const secret = process.env.GATHERHUB_CLIENT_SECRET;
const domain = process.env.GATHERHUB_CLIENT_DOMAIN;

async function fetchEvent(cls) {
  const path = `/api/public/events/${cls.gatherhub_event_uuid}`;
  const timestamp = String(Math.floor(Date.now() / 1000));
  const signature = crypto
    .createHmac('sha256', secret)
    .update([key, domain, timestamp, path].join('|'))
    .digest('hex');

  let response;
  try {
    response = await fetch(`${baseUrl}${path}`, {
      headers: {
        'X-GatherHub-Key': key,
        'X-GatherHub-Domain': domain,
        'X-GatherHub-Timestamp': timestamp,
        'X-GatherHub-Signature': signature,
      },
    });
  } catch (error) {
    fail(`class "${cls.slug}" (uuid ${cls.gatherhub_event_uuid}): network error — ${error.message}`);
  }

  if (!response.ok) {
    fail(`class "${cls.slug}" (uuid ${cls.gatherhub_event_uuid}): HTTP ${response.status} from GatherHub`);
  }

  const parsed = EventPayloadSchema.safeParse(await response.json());

  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((issue) => `  - ${issue.path.join('.') || '(root)'}: ${issue.message}`)
      .join('\n');
    fail(
      `class "${cls.slug}" (uuid ${cls.gatherhub_event_uuid}): response violates the contract\n${issues}`
    );
  }

  return parsed.data;
}

const payloads = {};
for (const cls of liveClasses) {
  payloads[cls.gatherhub_event_uuid] = await fetchEvent(cls);
  console.log(`GatherHub prefetch: ${cls.slug} → ${payloads[cls.gatherhub_event_uuid].status}`);
}

fs.writeFileSync(OUTPUT_FILE, `${JSON.stringify(payloads, null, 2)}\n`);
console.log(`GatherHub prefetch: wrote ${OUTPUT_FILE} (${liveClasses.length} class(es)).`);
