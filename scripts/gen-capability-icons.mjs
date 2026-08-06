#!/usr/bin/env node
/**
 * Generate src/components/CapabilityIcon.tsx — the four marks on the homepage
 * "What we do" cards.
 *
 *   node scripts/gen-capability-icons.mjs
 *   npm run gen:icons
 *
 * This script is the source of truth. The path data it emits (elliptic-curve
 * sampling, lattice geometry, sinusoid coverage) is computed, not drawn, so
 * edit the geometry HERE and re-run — never hand-edit the `d` attributes in the
 * generated component, which this script overwrites.
 *
 * Each mark is drawn from the mathematics its service actually works in, at
 * viewBox 0 0 120 120 for a 120px box. Gradient ids are prefixed per icon so
 * the four inline SVGs never collide in one document.
 */

import fs from 'fs';
import path from 'path';

const OUT = path.join('src', 'components', 'CapabilityIcon.tsx');

/* -------------------------------- palette -------------------------------- */
const BLUE = '#1E97C8';
const MID = '#38B1DF';
const NAVY = '#09053A';
const GOLD = '#FFC02E';
const CARD = '#fff';
const GRAD = 'url(#gDeepH)';

/* -------------------------------- helpers -------------------------------- */
const n = (v) => {
  const r = Math.round(v * 10) / 10;
  return Object.is(r, -0) ? '0' : String(r);
};
const pt = (p) => `${n(p[0])} ${n(p[1])}`;
const poly = (pts, close = false) =>
  `M${pt(pts[0])}` + pts.slice(1).map((p) => `L${pt(p)}`).join('') + (close ? 'Z' : '');
const TAU = Math.PI * 2;
const samp = (f, t0, t1, steps) => {
  const o = [];
  for (let i = 0; i <= steps; i++) o.push(f(t0 + ((t1 - t0) * i) / steps));
  return o;
};
const stroke = (d, color = GRAD, w = 6.5) =>
  `<path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round"/>`;
const gold = (p, r = 6.5) =>
  `<circle cx="${n(p[0])}" cy="${n(p[1])}" r="${r}" fill="url(#gGold)" stroke="${NAVY}" stroke-width="1.5" stroke-opacity=".55"/>`;
function arrow(a, b, color = GRAD, w = 6, headLen = 13, headW = 7.5) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const u = [(b[0] - a[0]) / L, (b[1] - a[1]) / L];
  const p = [-u[1], u[0]];
  const back = [b[0] - u[0] * headLen, b[1] - u[1] * headLen];
  return (
    stroke(`M${pt(a)}L${pt(back)}`, color, w) +
    `<path d="${poly([b, [back[0] + p[0] * headW, back[1] + p[1] * headW], [back[0] - p[0] * headW, back[1] - p[1] * headW]], true)}" fill="${color}"/>`
  );
}

/* ------------------------------- the marks ------------------------------- */

// Security Audits — a field of points with the one anomaly ringed.
// The field is a tiled pattern rather than 81 circles: same picture, a
// twentieth of the markup.
const auditsMark = (() => {
  const field =
    `<defs><pattern id="dField" width="11" height="11" patternUnits="userSpaceOnUse">` +
    `<circle cx="3" cy="3" r="3" fill="${BLUE}" fill-opacity=".4"/></pattern></defs>` +
    `<rect x="13" y="13" width="94" height="94" fill="url(#dField)"/>`;
  const curve = poly(
    samp((t) => [12 + 96 * t, 62 + 32 * Math.sin(TAU * 0.72 * t + 0.7) * (0.45 + 0.55 * t)], 0, 1, 60)
  );
  return (
    field +
    stroke(curve, GRAD, 7) +
    `<circle cx="82" cy="38" r="13" fill="${CARD}" fill-opacity=".85"/>` +
    `<circle cx="82" cy="38" r="13" fill="none" stroke="${GOLD}" stroke-width="4"/>` +
    `<circle cx="82" cy="38" r="5.5" fill="url(#gGold)" stroke="${NAVY}" stroke-width="1.3" stroke-opacity=".5"/>` +
    `<g stroke="${GOLD}" stroke-width="3" stroke-linecap="round">` +
    `<path d="M82 17L82 24"/><path d="M82 52L82 59"/><path d="M61 38L68 38"/><path d="M96 38L103 38"/></g>`
  );
})();

// Protocol Design — a three-round interactive transcript.
// Two lifelines headed by cap bars (the sequence-diagram convention) rather
// than filled circles, which read as bulbs. Messages run lifeline to lifeline:
// commit out, challenge back in gold, response out.
const protocolMark = (() => {
  const lx = 22, rx = 98, capW = 11;
  // The cap sits directly on the head of its lifeline so each party reads as
  // one mark, not a bar floating above a line.
  const top = 26, lifeBot = 106;
  const rows = [44, 67, 90];
  const cap = (x, color) => stroke(`M${n(x - capW)} ${top}L${n(x + capW)} ${top}`, color, 7);
  const lifeline = (x) =>
    `<path d="M${n(x)} ${top}L${n(x)} ${lifeBot}" fill="none" stroke="${NAVY}" stroke-width="4.2" stroke-linecap="round" stroke-opacity=".9"/>`;
  return (
    lifeline(lx) + lifeline(rx) +
    cap(lx, GRAD) + cap(rx, MID) +
    // tails inset so they sit flush against their lifeline instead of bulging
    // past it; heads land on the receiving lifeline
    arrow([lx + 2, rows[0]], [rx, rows[0]], BLUE, 6) +
    arrow([rx - 2, rows[1]], [lx, rows[1]], GOLD, 6.5) +
    arrow([lx + 2, rows[2]], [rx, rows[2]], GRAD, 6) +
    gold([60, rows[1]], 7.5)
  );
})();

// Formal Verification — every point in the domain discharged, under a bracket
// spanning the whole interval.
const verificationMark = (() => {
  const g = (t) => 52 - 26 * Math.sin(TAU * 0.85 * t - 0.35);
  const pts = samp((t) => [12 + 96 * t, g(t)], 0, 1, 80);
  const ts = samp((t) => t, 0, 1, 8);
  const ticks = ts
    .map((t) => {
      const x = 12 + 96 * t;
      return `<path d="M${n(x)} ${n(g(t) + 5)}L${n(x)} 86" stroke="${NAVY}" stroke-width="1.8" stroke-dasharray="3.5 3.5" stroke-opacity=".45"/>`;
    })
    .join('');
  return (
    stroke(poly(pts), GRAD, 7) +
    ticks +
    ts.map((t) => gold([12 + 96 * t, g(t)], 5)).join('') +
    stroke('M12 86L12 96L108 96L108 86', GOLD, 4.5)
  );
})();

// Research & Standardization — a lattice with its basis vectors and the short
// vector found.
const researchMark = (() => {
  const O = [30, 86], b1 = [30, -10], b2 = [11, -27];
  const dots = [];
  for (let i = -1; i <= 4; i++)
    for (let j = -1; j <= 4; j++) {
      const x = O[0] + i * b1[0] + j * b2[0], y = O[1] + i * b1[1] + j * b2[1];
      if (x < 8 || x > 112 || y < 8 || y > 112) continue;
      dots.push(`<circle cx="${n(x)}" cy="${n(y)}" r="3.4" fill="${BLUE}" fill-opacity=".65"/>`);
    }
  const cell = poly(
    [O, [O[0] + b1[0], O[1] + b1[1]], [O[0] + b1[0] + b2[0], O[1] + b1[1] + b2[1]], [O[0] + b2[0], O[1] + b2[1]]],
    true
  );
  const vec = (v, color, w = 5.5) => arrow(O, [O[0] + v[0], O[1] + v[1]], color, w, 11, 6);
  const short = [b1[0] - b2[0], b1[1] - b2[1]];
  return (
    `<path d="${cell}" fill="url(#gTint)" stroke="${BLUE}" stroke-width="2" stroke-opacity=".6"/>` +
    dots.join('') +
    vec(b1, GRAD) + vec(b2, BLUE) + vec(short, GOLD, 6) +
    gold([O[0] + short[0], O[1] + short[1]], 6.5) +
    `<circle cx="${n(O[0])}" cy="${n(O[1])}" r="5" fill="${NAVY}"/>`
  );
})();

/* ------------------------------ TSX emission ------------------------------ */
// SVG presentation attributes are kebab-case; JSX wants camelCase.
const ATTR = {
  'stroke-width': 'strokeWidth',
  'stroke-linecap': 'strokeLinecap',
  'stroke-linejoin': 'strokeLinejoin',
  'stroke-opacity': 'strokeOpacity',
  'stroke-dasharray': 'strokeDasharray',
  'fill-opacity': 'fillOpacity',
  'stop-color': 'stopColor',
  'stop-opacity': 'stopOpacity',
  'clip-path': 'clipPath',
};
const toJsx = (s) => Object.entries(ATTR).reduce((a, [k, v]) => a.split(`${k}=`).join(`${v}=`), s);

const GRADS = {
  gDeepH: (id) =>
    `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="14" y1="20" x2="106" y2="100">` +
    `<stop offset="0" stop-color="${MID}"/><stop offset="1" stop-color="${NAVY}"/></linearGradient>`,
  gGold: (id) =>
    `<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">` +
    `<stop offset="0" stop-color="#FFD469"/><stop offset="1" stop-color="${GOLD}"/></linearGradient>`,
  gTint: (id) =>
    `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">` +
    `<stop offset="0" stop-color="#EAF9FF"/><stop offset="1" stop-color="#EAF9FF" stop-opacity=".15"/></linearGradient>`,
};

const ICONS = [
  ['point-field', 'audits', 'A field of points with the one anomaly ringed and crosshaired.', auditsMark],
  ['round-transcript', 'protocol', 'A three-round interactive transcript: commit, challenge, response.', protocolMark],
  ['domain-coverage', 'verification', 'Every point in the domain discharged, bracketed across the whole interval.', verificationMark],
  ['lattice-basis', 'research', 'A lattice with its basis vectors and the short vector found.', researchMark],
];

const bodies = ICONS.map(([name, prefixBase, note, rawMarkup]) => {
  const prefix = `${prefixBase}-`;
  let markup = rawMarkup;
  const defs = [];
  for (const g of Object.keys(GRADS)) {
    if (markup.includes(`url(#${g})`)) {
      defs.push(GRADS[g](prefix + g));
      markup = markup.split(`url(#${g})`).join(`url(#${prefix}${g})`);
    }
  }
  // fold locally-declared defs (patterns, clip paths) in, prefixing their ids
  const local = [...markup.matchAll(/<defs>([\s\S]*?)<\/defs>/g)].map((m) => m[1]);
  markup = markup.replace(/<defs>[\s\S]*?<\/defs>/g, '');
  local.forEach((blockRaw) => {
    let block = blockRaw;
    [...blockRaw.matchAll(/id="([^"]+)"/g)].forEach(([, id]) => {
      block = block.split(`id="${id}"`).join(`id="${prefix}${id}"`);
      markup = markup.split(`url(#${id})`).join(`url(#${prefix}${id})`);
    });
    defs.push(block);
  });
  return { name, note, defs, markup };
});

const source =
  `/**\n` +
  ` * GENERATED by scripts/gen-capability-icons.mjs — do not hand-edit.\n` +
  ` * Change the geometry in that script and re-run \`npm run gen:icons\`.\n` +
  ` *\n` +
  ` * Marks for the homepage capability cards, each drawn from the mathematics\n` +
  ` * the service actually works in. Designed for a 120px box; gradient ids are\n` +
  ` * per-icon prefixed so the four inline SVGs never collide on one page.\n` +
  ` *\n` +
  bodies.map((b) => ` * ${b.name}: ${b.note}`).join('\n') +
  `\n */\n\n` +
  `export type CapabilityIconName =\n` +
  bodies.map((b) => `  | '${b.name}'`).join('\n') +
  `;\n\nconst MARKS: Record<CapabilityIconName, React.ReactNode> = {\n` +
  bodies
    .map(
      (b) =>
        `  '${b.name}': (\n    <>\n` +
        (b.defs.length ? `      <defs>${toJsx(b.defs.join(''))}</defs>\n` : '') +
        `      ${toJsx(b.markup)}\n    </>\n  ),`
    )
    .join('\n') +
  `\n};\n\nexport default function CapabilityIcon({\n  name,\n  className,\n}: {\n  name: CapabilityIconName;\n  className?: string;\n}) {\n  return (\n    <svg\n      viewBox="0 0 120 120"\n      className={className}\n      aria-hidden="true"\n      focusable="false"\n    >\n      {MARKS[name]}\n    </svg>\n  );\n}\n`;

fs.writeFileSync(OUT, source);
console.log(`wrote ${OUT} (${(source.length / 1024).toFixed(1)}k)`);
for (const b of bodies) console.log(`  ${b.name}: ${(b.markup.length / 1024).toFixed(1)}k`);
