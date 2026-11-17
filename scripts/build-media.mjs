#!/usr/bin/env node
/**
 * Media pipeline: sorgente video  ->  asset ottimizzati per lo scrub.
 *
 *   npm run media                       (usa assets-src/burger-source.mp4)
 *   npm run media -- path/al/video.mp4  (sorgente diversa)
 *
 * Output:
 *   public/videos/burger-scroll.{webm,mp4}       (desktop, 1080x1920)
 *   public/videos/burger-scroll-720.{webm,mp4}   (mobile / connessioni lente)
 *   public/images/*.webp                         (poster + fotogrammi usati come foto DEMO)
 *
 * Le immagini "demo" sono ritagli di fotogrammi del video: vanno sostituite
 * con fotografie reali (vedi src/config/assets.ts).
 * Keyframe fitti (-g 6) = seek rapido durante lo scrub.
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

// ---------- VIDEO ----------
for (const [suffix, width] of [['', 1080], ['-720', 720]]) {
  const scale = ['-vf', `scale=${width}:-2:flags=lanczos`];
  const out = `public/videos/burger-scroll${suffix}`;
  ff('-i', src, '-an', ...scale, '-c:v', 'libx264', '-profile:v', 'high', '-preset', 'slow',
    '-crf', width === 1080 ? '22' : '23', '-g', '6', '-keyint_min', '6', '-sc_threshold', '0',
    '-pix_fmt', 'yuv420p', '-movflags', '+faststart', `${out}.mp4`);
  ff('-i', src, '-an', ...scale, '-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', width === 1080 ? '33' : '34',
    '-g', '6', '-row-mt', '1', '-deadline', 'good', '-cpu-used', '1', '-pix_fmt', 'yuv420p', `${out}.webm`);
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
console.log('Media pronti.');
