/**
 * ASSET: video principale e fotografie.
 * Per sostituire il video: rigenerare i file con `npm run media -- percorso/video.mp4`
 * (o copiare a mano i file in public/videos/) e aggiornare durata/dimensioni qui sotto.
 * Le immagini marcate `demo: true` sono fotogrammi ritagliati dal video: sostituirle con foto reali
 * mantenendo (o aggiornando) width/height per evitare layout shift.
 */
import type { ImageAsset, VideoSource } from '../types';

const base = (import.meta.env.BASE_URL ?? '/').replace(/\/$/, '');
export const url = (p: string) => `${base}/${p.replace(/^\//, '')}`;

export const video = {
  duration: 7.9167,
  /** Dimensioni del frame (9:16). Usate per l'aspect-ratio: nessun layout shift. */
  width: 1080,
  height: 1920,
  /** Ordine di preferenza. Su Safari viene preferito l'MP4 (decodifica hardware, seek più rapido). */
  desktop: [
    { src: url('videos/burger-scroll.webm'), type: 'video/webm; codecs="vp9"', approxBytes: 3_580_000 },
    { src: url('videos/burger-scroll.mp4'), type: 'video/mp4', approxBytes: 4_180_000 },
  ] as VideoSource[],
  /** Smartphone / viewport strette: 720×1280, più leggero. */
  narrow: [
    { src: url('videos/burger-scroll-720.webm'), type: 'video/webm; codecs="vp9"', approxBytes: 2_190_000 },
    { src: url('videos/burger-scroll-720.mp4'), type: 'video/mp4', approxBytes: 2_170_000 },
  ] as VideoSource[],
  poster: {
    src: url('images/poster-start.webp'),
    width: 1080,
    height: 1920,
    alt: '',
  } as ImageAsset,
};

const demo = (
  name: string,
  width: number,
  height: number,
  alt: string,
  extra: Partial<ImageAsset> = {},
): ImageAsset => ({
  src: url(`images/${name}.webp`),
  width,
  height,
  alt,
  demo: true,
  ...extra,
});

export const images = {
  heroStill: demo('hero-still', 880, 800, 'Hamburger intero su sfondo nero', { srcSm: url('images/hero-still-sm.webp'), widthSm: 520 }),
  bun: demo('ing-bun', 520, 390, 'Macro del pane brioche dorato con semi di sesamo'),
  lettuce: demo('ing-lettuce', 520, 390, 'Macro delle foglie di lattuga fresca'),
  tomato: demo('ing-tomato', 520, 390, 'Macro delle fette di pomodoro'),
  cheese: demo('ing-cheese', 560, 420, 'Macro del cheddar sopra la carne'),
  beef: demo('ing-beef', 520, 390, 'Macro del burger di manzo grigliato'),
  bacon: demo('ing-bacon', 640, 480, 'Macro del bacon croccante sul pane tostato'),
  sauce: demo('ing-sauce', 640, 480, 'Macro della salsa barbecue che cola sull’hamburger'),
  original: demo('burger-original', 800, 800, 'Hamburger classico completo', { srcSm: url('images/burger-original-sm.webp'), widthSm: 480 }),
  plated: demo('burger-plated', 1080, 960, 'Hamburger con salsa barbecue su un piatto bianco', { srcSm: url('images/burger-plated-sm.webp'), widthSm: 640 }),
  double: demo('burger-double', 780, 700, 'Formaggio, carne e bacon', { srcSm: url('images/burger-double-sm.webp'), widthSm: 480 }),
  pour: demo('burger-pour', 700, 700, 'Salsa barbecue che cola sul pane', { srcSm: url('images/burger-pour-sm.webp'), widthSm: 440 }),
  stack: demo('burger-stack', 820, 900, 'Hamburger ricomposto con salsa barbecue', { srcSm: url('images/burger-stack-sm.webp'), widthSm: 480 }),
};
