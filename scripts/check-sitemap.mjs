#!/usr/bin/env node
/**
 * Verify that every URL in the generated sitemap corresponds to a real page
 * in the static export.
 *
 * Run AFTER `npm run build`:
 *   node scripts/check-sitemap.mjs
 *
 * With `trailingSlash: true`, a URL like https://qed-it.com/services/audits/
 * must map to out/services/audits/index.html.
 *
 * Exits 1 if any sitemap URL has no corresponding file, so it can gate CI.
 */

import fs from 'fs';
import path from 'path';

const OUT_DIR = 'out';
const SITEMAP = path.join(OUT_DIR, 'sitemap.xml');

if (!fs.existsSync(SITEMAP)) {
  console.error(`✗ ${SITEMAP} not found. Run \`npm run build\` first.`);
  process.exit(1);
}

const xml = fs.readFileSync(SITEMAP, 'utf8');

// Pull every <loc>...</loc> out of the sitemap.
const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());

if (locs.length === 0) {
  console.error('✗ No <loc> entries found in the sitemap.');
  process.exit(1);
}

/** Map a sitemap URL to the file the static export should have produced. */
function candidatePaths(loc) {
  const { pathname } = new URL(loc);
  // Strip leading/trailing slashes -> "services/audits" (or "" for the homepage)
  const rel = pathname.replace(/^\/+|\/+$/g, '');
  const base = rel ? path.join(OUT_DIR, rel) : OUT_DIR;
  return [
    path.join(base, 'index.html'), // foldered route (trailingSlash: true)
    `${base}.html`,                // flat route (trailingSlash: false)
  ];
}

const missing = [];
const ok = [];

for (const loc of locs) {
  const candidates = candidatePaths(loc);
  const found = candidates.find((p) => fs.existsSync(p));
  if (found) {
    ok.push({ loc, file: found });
  } else {
    missing.push({ loc, tried: candidates });
  }
}

// --- Report -----------------------------------------------------------------

console.log(`Checked ${locs.length} sitemap URLs against ./${OUT_DIR}\n`);

if (missing.length > 0) {
  console.error(`✗ ${missing.length} URL(s) in the sitemap have no built page:\n`);
  for (const { loc, tried } of missing) {
    console.error(`  ${loc}`);
    for (const t of tried) console.error(`      tried: ${t}`);
  }
  console.error('');
}

// Also flag the reverse: pages that exist but are NOT in the sitemap.
// Informational only — some pages are deliberately excluded (noindex, legal, ...).
const sitemapPaths = new Set(
  locs.map((loc) => new URL(loc).pathname.replace(/^\/+|\/+$/g, ''))
);

function walk(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === '_next') continue;
      walk(full, acc);
    } else if (entry.name === 'index.html') {
      const rel = path.relative(OUT_DIR, path.dirname(full));
      acc.push(rel === '.' ? '' : rel.split(path.sep).join('/'));
    }
  }
  return acc;
}

const builtPages = walk(OUT_DIR);
const notInSitemap = builtPages.filter((p) => !sitemapPaths.has(p));

if (notInSitemap.length > 0) {
  console.log(`ℹ ${notInSitemap.length} built page(s) not in the sitemap (may be intentional):`);
  for (const p of notInSitemap.sort()) console.log(`  /${p}/`);
  console.log('');
}

if (missing.length > 0) {
  console.error(`✗ FAILED — ${missing.length} broken sitemap URL(s).`);
  process.exit(1);
}

console.log(`✓ All ${ok.length} sitemap URLs resolve to a built page.`);
