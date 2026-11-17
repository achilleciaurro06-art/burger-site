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
  duration: 5.4583,
  /** Frame "core" 9:16: è la base di tutti i calcoli di layout/camera. Nessun layout shift. */
  width: 1080,
  height: 1920,
  /** Larghezza reale dei file video/poster (= width se il video non ha fasce laterali extra). */
  fullWidth: 1080,
  /** Ordine di preferenza. Su Safari viene preferito l'MP4 (decodifica hardware, seek più rapido). */
  desktop: [
    { src: url('videos/burger-scroll.webm'), type: 'video/webm; codecs="vp9"', approxBytes: 2_680_000 },
    { src: url('videos/burger-scroll.mp4'), type: 'video/mp4', approxBytes: 3_070_000 },
  ] as VideoSource[],
  /** Smartphone / viewport strette: 720×1280, più leggero. */
  narrow: [
    { src: url('videos/burger-scroll-720.webm'), type: 'video/webm; codecs="vp9"', approxBytes: 1_650_000 },
    { src: url('videos/burger-scroll-720.mp4'), type: 'video/mp4', approxBytes: 1_600_000 },
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

/** Fotografie reali fornite dal brand (nessuna etichetta demo). */
const photo = (name: string, width: number, height: number, widthSm: number, alt: string, position?: string): ImageAsset => ({
  src: url(`images/photo-${name}.webp`),
  srcSm: url(`images/photo-${name}-sm.webp`),
  widthSm,
  width,
  height,
  alt,
  position,
});

export const images = {
  photoOriginal: photo('original', 1600, 1064, 800, 'Hamburger con pane al sesamo, lattuga, pomodoro, cipolla e formaggio su tavolo di legno', '64% 50%'),
  photoDouble: photo('double', 900, 1600, 560, 'Hamburger doppio con formaggio fuso e cipolla rossa, patatine in primo piano'),
  photoCrunch: photo('crunch', 1600, 1068, 800, 'Hamburger con cotoletta croccante, uovo e pomodoro con patatine e salsa su tagliere', '30% 50%'),
  photoPhilosophy: photo('philosophy', 1600, 1066, 800, 'Hamburger doppio con formaggio fuso accanto a patatine rustiche', '86% 50%'),
  photoCta: photo('cta', 1800, 1200, 900, 'Hamburger con pomodoro e cipolla rossa accanto a patatine in un contenitore d\u2019acciaio', '68% 50%'),
  heroStill: demo('hero-still', 880, 800, 'Hamburger intero su sfondo nero', { srcSm: url('images/hero-still-sm.webp'), widthSm: 520 }),
  bun: demo('ing-bun', 520, 390, 'Macro del pane brioche dorato con semi di sesamo'),
  lettuce: demo('ing-lettuce', 520, 390, 'Macro delle foglie di lattuga fresca'),
  tomato: demo('ing-tomato', 520, 390, 'Macro delle fette di pomodoro'),
  cheese: demo('ing-cheese', 560, 420, 'Macro del cheddar sopra la carne'),
  beef: demo('ing-beef', 520, 390, 'Macro del burger di manzo grigliato'),
  bacon: demo('ing-bacon', 640, 480, 'Macro del bacon croccante sul pane tostato'),
  sauce: demo('ing-sauce', 640, 480, 'Macro della salsa barbecue che cola sull’hamburger'),
  stack: demo('burger-stack', 820, 900, 'Hamburger ricomposto con salsa barbecue', { srcSm: url('images/burger-stack-sm.webp'), widthSm: 480 }),
};
