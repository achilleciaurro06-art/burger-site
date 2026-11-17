import type { ImageAsset } from '../types';
import { site } from '../config/site';

export const esc = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

interface ImgOpts {
  /** Attributo sizes per srcset. */
  sizes?: string;
  eager?: boolean;
  className?: string;
}

export const img = (a: ImageAsset, o: ImgOpts = {}): string => {
  const srcset = a.srcSm ? ` srcset="${a.srcSm} ${a.widthSm ?? a.width}w, ${a.src} ${a.width}w" sizes="${o.sizes ?? '100vw'}"` : '';
  const pos = a.position ? ` style="object-position:${a.position}"` : '';
  return `<img${o.className ? ` class="${o.className}"` : ''} src="${a.src}"${srcset} width="${a.width}" height="${a.height}" alt="${esc(a.alt)}" ${o.eager ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"'} decoding="async"${pos}>`;
};

/** Attributo per l'etichetta "IMG DEMO". */
export const demoAttr = (a: ImageAsset): string => (a.demo && site.showPlaceholderLabels ? ' data-demo' : '');

/** Righe di titolo con maschera per l'animazione di entrata. */
export const lines = (ls: readonly string[], cls = 'ln'): string =>
  ls.filter(Boolean).map((l, i) => `<span class="${cls}" style="--l:${i}"><span>${esc(l)}</span></span>`).join('');

/** Link con effetto "roll" (testo che scorre in verticale all'hover). */
export const roll = (label: string): string => `<span class="roll" data-text="${esc(label)}"><span>${esc(label)}</span></span>`;

export const pad = (n: number): string => String(n).padStart(2, '0');

export const formatPrice = (n: number | null): string | null =>
  n == null ? null : new Intl.NumberFormat('it-IT', { style: 'currency', currency: site.currency }).format(n);
