/**
 * TIMELINE DELL'ESPERIENZA SCROLL-DRIVEN
 *
 * Ogni capitolo = un tratto di scroll (vh) con:
 *  - to.t    tempo del video (s) raggiunto a fine capitolo
 *  - to.s    zoom camera (desktop) / to.sm (viewport strette)
 *  - to.fy   punto del frame (0–1, dall'alto) che la camera inquadra
 *  - ay/aym  dove cade quel punto nello stage (0–1): desktop / viewport strette
 *  - move    quota iniziale del capitolo usata per lo spostamento di camera (il resto è "dwell")
 *  - layer   id del livello editoriale mostrato (null = solo video)
 *  - in/out  finestre [da, a] (0–1 dentro il capitolo) di entrata/uscita del livello
 *
 * Se il video viene sostituito, ricalibrare i valori `t` (tempo) e `fy` (posizione verticale
 * degli ingredienti nel frame): è l'UNICO punto da toccare.
 *
 * Mappa del video attuale (7.92 s, 24 fps):
 *   0.0–1.0  hamburger intero che cade e ruota      1.0–1.7  si apre
 *   1.7–2.4  ingredienti sospesi                    2.0–4.4  colata di salsa
 *   3.9–5.0  si ricompone                           5.0–7.9  atterra sul piatto bianco
 */
export interface Cam {
  t: number;
  s: number;
  sm: number;
  fy: number;
  ay: number;
  aym: number;
}

export interface Chapter {
  id: string;
  layer: string | null;
  vh: number;
  to: Cam;
  move: number;
  in: [number, number];
  out: [number, number] | null;
}

export const START: Cam = { t: 0, s: 1.7, sm: 1.22, fy: 0.31, ay: 0.46, aym: 0.33 };

const ING = { move: 0.7, in: [0.02, 0.28] as [number, number], out: [0.74, 0.96] as [number, number] };
const cam = (t: number, s: number, sm: number, fy: number, ay = 0.5, aym = 0.37): Cam => ({ t, s, sm, fy, ay, aym });

export const CHAPTERS: Chapter[] = [
  // Hero: l'hamburger intero cade, ruota e si apre.
  { id: 'hero', layer: 'hero', vh: 70, to: cam(1.5, 1, 1, 0.5, 0.5, 0.5), move: 1, in: [0, 0], out: [0.06, 0.34] },
  // Visione d'insieme degli ingredienti sospesi.
  { id: 'reveal', layer: null, vh: 15, to: cam(1.75, 1, 1, 0.5, 0.5, 0.5), move: 0.8, in: [0, 0], out: null },
  // 01–06: la camera scorre da un ingrediente al successivo mentre il video continua ad avanzare.
  { id: 'bun', layer: 'ing-bun', vh: 34, to: cam(1.95, 1.4, 1.12, 0.155), ...ING },
  { id: 'lettuce', layer: 'ing-lettuce', vh: 34, to: cam(2.15, 1.4, 1.12, 0.29), ...ING },
  { id: 'tomato', layer: 'ing-tomato', vh: 34, to: cam(2.35, 1.4, 1.12, 0.43), ...ING },
  { id: 'cheese', layer: 'ing-cheese', vh: 34, to: cam(2.55, 1.4, 1.12, 0.55), ...ING },
  { id: 'beef', layer: 'ing-beef', vh: 34, to: cam(2.75, 1.4, 1.12, 0.65), ...ING },
  { id: 'bacon', layer: 'ing-bacon', vh: 34, to: cam(2.95, 1.4, 1.12, 0.78), ...ING },
  // 07: la camera risale sul pane mentre la salsa arriva.
  { id: 'sauce', layer: 'ing-sauce', vh: 42, to: cam(3.6, 1.35, 1.1, 0.2), ...ING },
  // Momento salsa: la colata attraversa l'hamburger.
  { id: 'sauce-moment', layer: 'sauce-moment', vh: 60, to: cam(4.35, 1.12, 1, 0.42, 0.5, 0.36), move: 0.6, in: [0.08, 0.3], out: [0.86, 1] },
  // Ricomposizione: nessun testo, solo prodotto.
  { id: 'recompose', layer: null, vh: 45, to: cam(5.3, 1, 1, 0.5, 0.5, 0.5), move: 0.7, in: [0, 0], out: null },
  // Atterraggio sul piatto bianco.
  { id: 'land', layer: null, vh: 60, to: cam(7.6, 1.3, 1.04, 0.6, 0.5, 0.33), move: 0.85, in: [0, 0], out: null },
  // Pausa visiva + conclusione.
  { id: 'finale', layer: 'finale', vh: 55, to: cam(7.9167, 1.3, 1.04, 0.6, 0.5, 0.33), move: 0.1, in: [0.4, 0.75], out: null },
];

export const TOTAL_VH = CHAPTERS.reduce((a, c) => a + c.vh, 0);

/** Offset (vh) dell'inizio del capitolo `id` dentro la sezione: usato per l'ancora #ingredienti. */
export const chapterStartVh = (id: string): number => {
  let acc = 0;
  for (const c of CHAPTERS) {
    if (c.id === id) return acc;
    acc += c.vh;
  }
  return 0;
};

/** Query condivisa CSS/JS: layout "stretto" (smartphone, tablet verticale). */
export const NARROW_QUERY = '(max-width: 820px), (max-aspect-ratio: 9/10)';
