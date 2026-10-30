import { WORLD_VERSION } from '../data/explore-version';

// The 3D scene is a static page (public/explore/world.html, written by scripts/sync-3d.mjs).
// ?v= is its content hash, so a re-synced scene is never served from a stale cache.
export const WORLD_URL = '/explore/world.html';
export const WORLD_HREF = `${WORLD_URL}?v=${WORLD_VERSION}`;
