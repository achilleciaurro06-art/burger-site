import { CHAPTERS, NARROW_QUERY, START, TOTAL_VH, type Cam } from '../config/timeline';
import { video as videoCfg } from '../config/assets';
import type { VideoSource } from '../types';
import { clamp, easeInOut, lerp, range } from './math';

/**
 * Esperienza scroll-driven.
 * Scroll → progresso globale (0–1) → capitolo + avanzamento locale → { tempo video, camera, livelli editoriali }.
 * Un solo loop rAF, attivo soltanto mentre il progresso sta convergendo: nessun lavoro a scroll fermo.
 * Il video viene scaricato per intero in un Blob (seek istantaneo, nessuna richiesta di rete durante lo scrub).
 */
export function initExperience(): void {
  const root = document.querySelector<HTMLElement>('[data-experience]');
  const html = document.documentElement;
  if (!root || html.dataset.exp !== 'scrub') return;

  const stage = root.querySelector<HTMLElement>('[data-stage]')!;
  const cam = root.querySelector<HTMLElement>('[data-cam]')!;
  const video = root.querySelector<HTMLVideoElement>('[data-video]')!;
  const bar = root.querySelector<HTMLElement>('[data-bar]')!;
  const loaderPct = root.querySelector<HTMLElement>('[data-loader-pct]')!;
  const loaderBar = root.querySelector<HTMLElement>('[data-loader-bar]')!;
  const railItems = [...root.querySelectorAll<HTMLElement>('[data-rail-item]')];
  const layerEls = new Map<string, HTMLElement>();
  root.querySelectorAll<HTMLElement>('[data-layer]').forEach((el) => layerEls.set(el.dataset.layer!, el));

  const narrowMQ = matchMedia(NARROW_QUERY);
  const cum: number[] = [];
  CHAPTERS.reduce((acc, c, i) => ((cum[i] = acc), acc + c.vh), 0);
  const ingChapters = CHAPTERS.map((c) => c.layer?.startsWith('ing-') ?? false);
  const firstIng = ingChapters.indexOf(true);

  let sectionTop = 0;
  let scrollable = 1;
  let stageW = 1;
  let stageH = 1;
  let frameH = 1;
  let narrow = false;
  let failed = false;
  let ready = false;
  let raf = 0;
  let last = 0;
  let ps = -1; // progresso smussato (−1 = non inizializzato)
  let videoT = 0;
  const layerCache = new Map<HTMLElement, string>();

  const measure = (): void => {
    sectionTop = root.getBoundingClientRect().top + window.scrollY;
    stageW = stage.clientWidth;
    stageH = stage.clientHeight;
    frameH = cam.offsetHeight;
    scrollable = Math.max(1, root.offsetHeight - stageH);
    narrow = narrowMQ.matches;
  };

  const rawProgress = (): number => clamp((window.scrollY - sectionTop) / scrollable);

  const camAt = (c: Cam): { s: number; fy: number; ay: number } => {
    const wideK = narrow ? 1 : clamp(stageW / stageH / 1.6, 0.78, 1);
    return { s: (narrow ? c.sm : c.s) * (narrow ? 1 : wideK), fy: c.fy, ay: narrow ? c.aym : c.ay };
  };

  const setLayer = (el: HTMLElement, vin: number, vout: number): void => {
    const key = `${vin.toFixed(3)}|${vout.toFixed(3)}`;
    if (layerCache.get(el) === key) return;
    layerCache.set(el, key);
    el.style.setProperty('--in', vin.toFixed(3));
    el.style.setProperty('--out', vout.toFixed(3));
  };

  const render = (p: number): void => {
    const v = p * TOTAL_VH;
    let i = 0;
    while (i < CHAPTERS.length - 1 && v >= cum[i + 1]) i++;
    const ch = CHAPTERS[i];
    const prev = i > 0 ? CHAPTERS[i - 1].to : START;
    const u = clamp((v - cum[i]) / ch.vh);
    const m = easeInOut(clamp(u / ch.move));

    // Camera
    const a = camAt(prev);
    const b = camAt(ch.to);
    const s = lerp(a.s, b.s, m);
    const fy = lerp(a.fy, b.fy, m);
    const ay = lerp(a.ay, b.ay, m);
    const ty = (ay - 0.5) * stageH - (fy - 0.5) * frameH * s;
    cam.style.transform = `translate3d(0,${ty.toFixed(2)}px,0) scale(${s.toFixed(4)})`;

    // Video
    videoT = lerp(prev.t, ch.to.t, u);
    if (ready && !video.seeking && Math.abs(video.currentTime - videoT) > 1 / 50) video.currentTime = videoT;

    cam.style.setProperty('--plate', range(videoT, 4.9, 6.2).toFixed(3));

    // Livelli editoriali (entrata/uscita legate allo scroll)
    CHAPTERS.forEach((c, j) => {
      if (!c.layer) return;
      const el = layerEls.get(c.layer);
      if (!el) return;
      const uj = j < i ? 1 : j > i ? 0 : u;
      // Capitoli futuri: livello completamente nascosto (anche per screen reader / hit-test).
      setLayer(el, range(uj, c.in[0], c.in[1]), j > i ? 1 : c.out ? range(uj, c.out[0], c.out[1]) : 0);
    });

    // Indicatori
    const ingIdx = ingChapters[i] ? i - firstIng : -1;
    const railOn = ingIdx >= 0 || (i === firstIng - 1 && u > 0.6);
    stage.dataset.rail = railOn ? 'on' : 'off';
    stage.dataset.mood = ch.id === 'sauce' || ch.id === 'sauce-moment' ? 'sauce' : 'base';
    railItems.forEach((it, k) => it.setAttribute('aria-current', String(k === ingIdx)));
    bar.style.transform = `scaleX(${p.toFixed(4)})`;
  };

  const tick = (now: number): void => {
    raf = 0;
    if (failed) return;
    const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
    last = now;
    const target = rawProgress();
    if (ps < 0 || Math.abs(target - ps) < 2e-5) ps = target;
    else ps += (target - ps) * (1 - Math.exp(-dt / 0.075));
    render(ps);
    if (ps !== target) request();
  };
  const request = (): void => {
    if (raf || failed) return;
    if (!last) last = performance.now();
    raf = requestAnimationFrame(tick);
  };

  // ---------- Caricamento video ----------
  const isSafari = /^((?!chrome|android|crios|fxios).)*safari/i.test(navigator.userAgent);
  const pickSource = (list: VideoSource[]): VideoSource | undefined => {
    const playable = list.filter((s) => video.canPlayType(s.type) !== '');
    if (isSafari) playable.sort((x, y) => Number(y.type.includes('mp4')) - Number(x.type.includes('mp4')));
    return playable[0];
  };

  const setLoader = (frac: number): void => {
    loaderPct.textContent = String(Math.round(frac * 100));
    loaderBar.style.transform = `scaleX(${frac.toFixed(3)})`;
  };

  const fallback = (reason: unknown): void => {
    if (failed) return;
    failed = true;
    console.warn('[experience] video non disponibile, uso la versione statica.', reason);
    html.dataset.exp = 'static';
    root.querySelectorAll<HTMLElement>('[data-layer]').forEach((el) => el.removeAttribute('style'));
    cam.style.transform = '';
  };

  const loadVideo = async (): Promise<void> => {
    const src = pickSource(narrowMQ.matches ? videoCfg.narrow : videoCfg.desktop);
    if (!src) throw new Error('nessun formato video supportato');
    const res = await fetch(src.src);
    if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);
    const total = Number(res.headers.get('content-length')) || src.approxBytes;
    const reader = res.body.getReader();
    const chunks: Uint8Array<ArrayBuffer>[] = [];
    let got = 0;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value as Uint8Array<ArrayBuffer>);
      got += value.length;
      setLoader(Math.min(0.99, got / total));
    }
    const blob = new Blob(chunks, { type: src.type.split(';')[0] });
    await new Promise<void>((resolve, reject) => {
      video.addEventListener('loadeddata', () => resolve(), { once: true });
      video.addEventListener('error', () => reject(new Error('errore di decodifica')), { once: true });
      video.src = URL.createObjectURL(blob);
      video.load();
    });
    // Alcuni browser (iOS) decodificano il primo frame solo dopo un play() silenzioso.
    try {
      await video.play();
      video.pause();
    } catch {
      /* ininfluente */
    }
    video.currentTime = videoT;
    await new Promise<void>((resolve) => {
      video.addEventListener('seeked', () => resolve(), { once: true });
      setTimeout(resolve, 600);
    });
    setLoader(1);
    ready = true;
    stage.dataset.ready = '';
    request();
  };

  // ---------- Avvio ----------
  measure();
  render(rawProgress());
  window.addEventListener('scroll', request, { passive: true });
  window.addEventListener('resize', () => {
    measure();
    request();
  });
  narrowMQ.addEventListener('change', () => {
    measure();
    request();
  });
  if ('ResizeObserver' in window) new ResizeObserver(() => { measure(); request(); }).observe(stage);

  loadVideo().catch(fallback);
}
