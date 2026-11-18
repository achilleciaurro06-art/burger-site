#!/usr/bin/env node
/**
 * Media pipeline: sorgente video  ->  asset ottimizzati per lo scrub.
 *
 *   npm run media                       (usa assets-src/burger-source.mp4)
 *   npm run media -- path/al/video.mp4  (sorgente diversa)
 *
 * Output:
 *   public/videos/burger-scroll.{webm,mp4}       (desktop, 1080x1920, 0–1.95 s)
 *   public/videos/burger-scroll-720.{webm,mp4}   (mobile / connessioni lente, 720x1280)
 *   public/images/*.webp                         (poster + fotogrammi DEMO + foto reali da assets-src/photos)
 *
 * Le immagini "demo" sono ritagli di fotogrammi del video: vanno sostituite
 * con fotografie reali (vedi src/config/assets.ts).
 * Keyframe fitti (-g 15 a 60 fps = ogni 0.25 s) = seek rapido durante lo scrub.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const src = resolve(process.argv[2] ?? 'assets-src/burger-source.mp4');
if (!existsSync(src)) {
  console.error(`Sorgente non trovata: ${src}`);
  process.exit(1);
}
mkdirSync('public/videos', { recursive: true });
mkdirSync('public/images', { recursive: true });

const ff = (...args) => execFileSync('ffmpeg', ['-v', 'error', '-y', ...args], { stdio: 'inherit' });

// Il video usa solo la parte "pulita" (hamburger che si apre, ingredienti sospesi): la salsa compare dopo 2.0 s.
// La ricomposizione si ottiene scorrendo la stessa apertura al contrario (vedi src/config/timeline.ts).
const VIDEO_END = 1.95;

// ---------- VIDEO ----------
// Interpolazione 24 -> 60 fps (movimento compensato): durante lo scrub ogni "scatto" è un fotogramma,
// con più fotogrammi lo scorrimento risulta molto più fluido. Passaggio intermedio quasi lossless in cache.
const FPS = 60;
mkdirSync('assets-src/.cache', { recursive: true });
const interpolated = `assets-src/.cache/burger-${FPS}fps.mp4`;
ff('-t', String(VIDEO_END), '-i', src, '-an', '-vf', `minterpolate=fps=${FPS}:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1`,
  '-c:v', 'libx264', '-crf', '10', '-preset', 'veryfast', '-pix_fmt', 'yuv420p', interpolated);

for (const [suffix, width] of [['', 1080], ['-720', 720]]) {
  const scale = ['-vf', `scale=${width}:-2:flags=lanczos`];
  const out = `public/videos/burger-scroll${suffix}`;
  ff('-i', interpolated, '-an', ...scale, '-c:v', 'libx264', '-profile:v', 'high', '-preset', 'slow',
    '-crf', width === 1080 ? '22' : '23', '-g', '15', '-keyint_min', '15', '-sc_threshold', '0',
    '-pix_fmt', 'yuv420p', '-movflags', '+faststart', `${out}.mp4`);
  ff('-i', interpolated, '-an', ...scale, '-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', width === 1080 ? '33' : '34',
    '-g', '15', '-row-mt', '1', '-deadline', 'good', '-cpu-used', '1', '-pix_fmt', 'yuv420p', `${out}.webm`);
}

// ---------- IMMAGINI ----------
// [nome, tempo (s), w, h, x, y, larghezza finale]  (coordinate sul frame 1080x1920)
const frame = (name, t, crop, outW) => {
  const vf = [crop ? `crop=${crop.join(':')}` : null, outW ? `scale='min(${outW},iw)':-2:flags=lanczos` : null]
    .filter(Boolean).join(',');
  ff('-ss', String(t), '-i', src, '-frames:v', '1', ...(vf ? ['-vf', vf] : []),
    '-c:v', 'libwebp', '-quality', '84', `public/images/${name}.webp`);
};

const SHOTS = JSON.parse(await import('node:fs').then((m) => m.readFileSync('scripts/shots.json', 'utf8')));
for (const s of SHOTS) {
  frame(s.name, s.t, s.crop, s.w);
  if (s.sm) frame(`${s.name}-sm`, s.t, s.crop, s.sm);
}
// ---------- FOTO REALI (assets-src/photos/*.jpg -> public/images/photo-*.webp) ----------
const PHOTOS = { double: [900, 560], original: [1600, 800], crunch: [1600, 800], philosophy: [1600, 800], cta: [1800, 900] };
for (const [name, [w, sm]] of Object.entries(PHOTOS)) {
  const input = `assets-src/photos/${name}.jpg`;
  if (!existsSync(input)) continue;
  for (const [suffix, width] of [['', w], ['-sm', sm]]) {
    ff('-i', input, '-vf', `scale='min(${width},iw)':-2:flags=lanczos`, '-c:v', 'libwebp', '-quality', '82', `public/images/photo-${name}${suffix}.webp`);
  }
}
console.log('Media pronti.');
