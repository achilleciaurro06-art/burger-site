import { hero, ingredients, ingredientsIntro, sauceMoment, finale } from '../config/content';
import { images, video } from '../config/assets';
import { TOTAL_VH, chapterStartVh } from '../config/timeline';
import { demoAttr, esc, img, lines, pad } from './helpers';

const total = ingredients.length;

const renderIngredient = (ing: (typeof ingredients)[number], i: number): string => {
  const n = pad(i + 1);
  const big = ing.layout.endsWith('-big');
  const side = ing.layout.startsWith('left') ? 'left' : 'right';
  return `
  <article class="layer layer--ing" data-layer="ing-${ing.id}" data-side="${side}" data-big="${big}" aria-labelledby="ing-${ing.id}-t">
    <span class="ing__ghost" aria-hidden="true">${n}</span>
    <div class="ing__text">
      <p class="ing__count st" style="--i:0"><b>${n}</b><span>/${pad(total)}</span><em>${esc(ingredientsIntro.label)}</em></p>
      <h2 class="ing__name st" id="ing-${ing.id}-t" style="--i:1">${lines(ing.name)}</h2>
      <p class="ing__title st" style="--i:2">${esc(ing.title)}</p>
      <p class="ing__desc st" style="--i:3">${esc(ing.description)}</p>
      <ul class="ing__tags st" style="--i:4">${ing.details.map((d) => `<li>${esc(d)}</li>`).join('')}</ul>
    </div>
    <figure class="ing__photo st" style="--i:2"${demoAttr(ing.image)}>
      ${img(ing.image, { sizes: '(max-width: 820px) 40vw, 30vw' })}
      <figcaption>FIG. ${n} — ${esc(ing.name.filter(Boolean).join(' '))}</figcaption>
    </figure>
    <span class="ing__line" aria-hidden="true"></span>
  </article>`;
};

export const renderExperience = (): string => `
<section class="exp" id="experience" style="--exp-vh:${TOTAL_VH}" aria-label="L’hamburger, ingrediente per ingrediente" data-experience>
  <span class="anchor" id="ingredienti" style="--at:${chapterStartVh('bun') + 14}" aria-hidden="true"></span>
  <div class="exp__stage" data-stage>
    <div class="exp__cam" data-cam style="aspect-ratio:${video.width}/${video.height}">
      <img class="exp__poster" data-poster src="${video.poster.src}" width="${video.width}" height="${video.height}" alt="" fetchpriority="high" decoding="async">
      <video class="exp__video" data-video muted playsinline preload="auto" tabindex="-1" aria-hidden="true" disablepictureinpicture disableremoteplayback></video>
    </div>

    <div class="exp__layers">
      <div class="layer layer--hero" data-layer="hero">
        <figure class="static-only hero__still">${img(images.heroStill, { eager: true, sizes: '(max-width: 820px) 90vw, 60vw' })}</figure>
        <h1 class="hero__title">
          <span class="ln" style="--l:0"><span>${esc(hero.titleLines[0])}</span></span>
          <span class="ln ln--r" style="--l:1"><span>${esc(hero.titleLines[1])}</span></span>
        </h1>
        <p class="hero__sub">${esc(hero.subtitle)}</p>
        <p class="hero__hint" aria-hidden="true"><span>${esc(hero.scrollHint)}</span><i></i></p>
      </div>

      ${ingredients.map(renderIngredient).join('')}

      <div class="layer layer--sauce" data-layer="sauce-moment" aria-labelledby="sauce-t">
        <h2 class="sauce__title" id="sauce-t">${sauceMoment.titleLines.map((l, i) => `<span class="ln" style="--l:${i}"><span>${esc(l)}</span></span>`).join('')}</h2>
        <p class="sauce__text st" style="--i:3">${esc(sauceMoment.text)}</p>
        <span class="sauce__rule" aria-hidden="true"></span>
      </div>

      <div class="layer layer--finale" data-layer="finale" aria-labelledby="finale-t">
        <figure class="static-only finale__still"${demoAttr(images.plated)}>${img(images.plated, { sizes: '(max-width: 820px) 100vw, 60vw' })}</figure>
        <h2 class="finale__title" id="finale-t">
          <span class="ln finale__a" style="--l:0"><span>${esc(finale.titleLines[0])}</span></span>
          <span class="ln finale__b" style="--l:1"><span>${esc(finale.titleLines[1])}</span></span>
        </h2>
        <p class="finale__sub st" style="--i:3">${esc(finale.subtitle)}</p>
      </div>
    </div>

    <ol class="rail" aria-hidden="true" data-rail>
      ${ingredients.map((ing, i) => `<li data-rail-item><b>${pad(i + 1)}</b><span>${esc(ing.name.filter(Boolean).join(' '))}</span></li>`).join('')}
    </ol>
    <div class="exp__bar" aria-hidden="true"><i data-bar></i></div>
    <p class="exp__loader" data-loader role="status" aria-live="polite"><span>${esc(hero.loading)}</span> <b data-loader-pct>0</b>%<i data-loader-bar></i></p>
  </div>
</section>`;
