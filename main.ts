// Black Friday deal finder, hand-in program (Node 22, standard library only).
//
// The site lives in app/ beside this file: plain static files a browser opens at
// app/index.html (ES modules, one stylesheet, no build step, no network requests),
// its 35 deals in app/data.js with each deal's store, sale price, usual price,
// store link, check time, source and honest verdict. The screenshots of the site
// running live in screenshots/. This program copies both folders into the output
// directory and writes /output/dossier.json with buildDossier from the kit's
// vendor/makefun-frontend.ts, which must stay exactly as the kit shipped it.
//
// Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Fail fast, with a readable reason, when the hand-in would be refused: the
// screenshots must exist, number 3 or 4, and stay under the scorer's 256 KiB cap.
const shotsDir = join(here, 'screenshots');
const shots = existsSync(shotsDir) ? readdirSync(shotsDir).filter((f) => /\.(png|jpe?g)$/i.test(f)).sort() : [];
if (shots.length < 3 || shots.length > 4) throw new Error(`expected 3 or 4 screenshots, found ${shots.length}`);
for (const f of shots) {
  const bytes = statSync(join(shotsDir, f)).size;
  if (bytes > 262144) throw new Error(`screenshot ${f} is ${bytes} bytes, over the 256 KiB cap`);
}
if (!existsSync(join(here, 'app', 'index.html'))) throw new Error('app/index.html is missing');

mkdirSync(out, { recursive: true });
// A reused output directory must not keep files from an earlier run: clear the
// entries inside out/app and out/screenshots, never the output directory itself.
for (const sub of ['app', 'screenshots']) {
  const dir = join(out, sub);
  if (existsSync(dir)) for (const entry of readdirSync(dir)) rmSync(join(dir, entry), { recursive: true, force: true });
}
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });

// The scorer's own caps (reference/gate.json): only text_max_bytes shapes the
// bytes; the other limits refuse an entry the scorer would refuse (more than 4
// screenshots or one over 256 KiB; more than 993 files and directories in app/
// or 16 MiB of app files, beside /output's own 1000-entry cap).
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, { text_max_bytes: 163840, screenshots: { max: 4, max_bytes: 262144 }, app_max_files: 993, app_max_bytes: 16777216 }),
);
