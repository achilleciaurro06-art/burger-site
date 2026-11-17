# Premium Burger — immersive scroll experience

Vite + TypeScript, **zero dipendenze runtime** (JS ≈ 10 kB, font self-hosted). Il markup viene pre-renderizzato in `index.html` (SEO, primo paint immediato, funziona anche senza JS).

```bash
npm install
npm run dev        # sviluppo
npm run build      # typecheck + build in dist/
npm run preview    # serve dist/
npm run media -- percorso/video.mp4   # rigenera video + immagini dal sorgente (richiede ffmpeg)
```
Test rapidi: `?exp=scrub` forza l'esperienza scroll-driven, `?exp=static` la versione statica.

## Dove si modifica cosa
| Cosa | File |
|---|---|
| Brand, nav, colori, link ordine, contatti, social | `src/config/site.ts` |
| Tutti i testi, ingredienti, menu/prezzi/allergeni, foto | `src/config/content.ts` |
| Video, poster, immagini (+ flag `demo`) | `src/config/assets.ts` |
| Tempi video ↔ scroll ↔ camera ↔ schede ingrediente | `src/config/timeline.ts` |
| Markup dei componenti | `src/render/*.ts` |
| Comportamento (scroll, nav, dialog, reveal) | `src/core/*.ts` |
| Stile | `src/styles/*.css` |

## Come funziona l'esperienza
`scroll → progresso (0–1) → capitolo → { currentTime video, camera (zoom/pan), livelli editoriali }`. Un solo `requestAnimationFrame` con smorzamento, attivo solo mentre il progresso converge. Il video è scaricato interamente in un Blob (seek istantaneo, nessuna rete durante lo scrub) con barra di caricamento; il poster coincide col primo frame. Lunghezza: ~730vh (7 ingredienti + salsa + ricomposizione), modificabile nei `vh` dei capitoli.

Versione **statica** (editoriale impilata, nessun video) per: `prefers-reduced-motion`, Save-Data, rete 2G, ≤2 GB RAM / ≤2 core, JS assente, video mancante/non decodificabile.
Smartphone/viewport strette: video 720p, layout con testo in basso, macro-foto nascoste nello scrub (visibili nella versione statica).

## Da sostituire con contenuti reali
- **Foto**: tutte le immagini sono fotogrammi ritagliati dal video (`demo: true`, etichetta "IMG DEMO" → `showPlaceholderLabels` in `site.ts`).
- **Brand** ("YOUR BRAND"), prezzi (demo), composizioni dei 4 panini, testi: provvisori.
- `orderUrl` vuoto: "ORDINA" porta al footer/contatti. Contatti, indirizzo, orari, social: "Da configurare".
- `public/privacy.html` e `cookie.html`: segnaposto.
- Se cambi il video: ricalibra `t` e `fy` in `timeline.ts`.

## Foto reali e piatto
- Le foto fornite stanno in `assets-src/photos/*.jpg` (non tracciate in git) e vengono convertite da `npm run media` in `public/images/photo-*.webp`.
- Il video è tagliato a 5.45 s: finisce sull'hamburger ricomposto con la salsa. Il piatto bianco (che nel video esce dai bordi del frame) non viene usato.
