import { finalCta, footerCopy, menuSection, philosophy, photography, products } from '../config/content';
import { orderHref, orderIsExternal, site } from '../config/site';
import { renderLogo } from './header';
import { demoAttr, esc, formatPrice, img, lines, pad, roll } from './helpers';

const ext = () => (orderIsExternal() ? ' target="_blank" rel="noopener noreferrer"' : '');

export const renderPhilosophy = (): string => `
<section class="phil" id="filosofia" aria-labelledby="phil-t">
  <p class="eyebrow" data-reveal="up">${esc(philosophy.label)}</p>
  <h2 class="phil__title" id="phil-t" data-reveal="mask">${lines(philosophy.titleLines)}</h2>
  <figure class="phil__photo" data-reveal="img"${demoAttr(philosophy.image)}>
    ${img(philosophy.image, { sizes: '(max-width: 820px) 100vw, 46vw' })}
    <figcaption>${esc(philosophy.caption)}</figcaption>
  </figure>
  <div class="phil__body">
    <p class="phil__text" data-reveal="up">${esc(philosophy.text)}</p>
    <ol class="phil__list" data-reveal="up" style="--rd:.12s">
      ${philosophy.principles.map((p, i) => `<li><b>${pad(i + 1)}</b><span>${esc(p)}</span></li>`).join('')}
    </ol>
  </div>
</section>`;

const renderProduct = (p: (typeof products)[number], i: number): string => {
  const price = formatPrice(p.price);
  return `
  <li class="prod prod--${p.size}" data-reveal="up" style="--rd:${(i % 2) * 0.1}s">
    <figure class="prod__photo"${demoAttr(p.image)}>${img(p.image, { sizes: p.size === 'l' ? '(max-width: 820px) 100vw, 56vw' : '(max-width: 820px) 100vw, 36vw' })}</figure>
    <div class="prod__info">
      <p class="prod__no">${pad(i + 1)}<span>/${pad(products.length)}</span></p>
      <h3 class="prod__name">${esc(p.name)}</h3>
      <p class="prod__desc">${esc(p.description)}</p>
      <p class="prod__ing">${p.ingredients.map(esc).join(' <i>/</i> ')}</p>
      <div class="prod__row">
        <p class="prod__price">${price ? esc(price) : `<small>${esc(menuSection.priceTbd)}</small>`}</p>
        <button class="btn btn--line prod__btn" type="button" data-open="${p.id}" aria-haspopup="dialog">${roll(menuSection.detailsLabel)}<span class="plus" aria-hidden="true"></span><span class="sr-only"> — ${esc(p.name)}</span></button>
      </div>
    </div>
  </li>`;
};

export const renderMenu = (): string => `
<section class="menu" id="menu" aria-labelledby="menu-t">
  <header class="menu__head">
    <p class="eyebrow" data-reveal="up">${esc(menuSection.label)}</p>
    <h2 class="menu__title" id="menu-t" data-reveal="mask">${lines([menuSection.title])}</h2>
    <p class="menu__intro" data-reveal="up">${esc(menuSection.intro)}</p>
  </header>
  <ul class="menu__list">${products.map(renderProduct).join('')}</ul>
</section>`;

export const renderDialogs = (): string =>
  products
    .map((p, i) => {
      const price = formatPrice(p.price);
      return `
<dialog class="pd" id="pd-${p.id}" aria-labelledby="pd-${p.id}-t">
  <button class="pd__close" type="button" data-close aria-label="${esc(menuSection.closeLabel)}"><span></span><span></span></button>
  <div class="pd__inner">
    <figure class="pd__photo"${demoAttr(p.image)}>${img(p.image, { sizes: '(max-width: 820px) 100vw, 50vw' })}</figure>
    <div class="pd__body">
      <p class="pd__no">${pad(i + 1)}<span>/${pad(products.length)}</span></p>
      <h3 class="pd__name" id="pd-${p.id}-t">${esc(p.name)}</h3>
      <p class="pd__tag">${esc(p.tagline)}</p>
      <p class="pd__desc">${esc(p.longDescription)}</p>
      <h4 class="pd__h">${esc(menuSection.ingredientsLabel)}</h4>
      <ul class="pd__list">${p.ingredients.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
      ${
        p.allergens.length
          ? `<h4 class="pd__h">${esc(menuSection.allergensLabel)}</h4><p class="pd__all">${p.allergens.map(esc).join(', ')}</p>`
          : ''
      }
      <div class="pd__foot">
        <p class="pd__price">${price ? esc(price) : `<small>${esc(menuSection.priceTbd)}</small>`}</p>
        <a class="btn btn--solid" href="${orderHref()}"${ext()}>${roll(menuSection.orderLabel)}</a>
      </div>
    </div>
  </div>
</dialog>`;
    })
    .join('');

export const renderPhotography = (): string => `
<section class="foto" id="foto" aria-labelledby="foto-t">
  <header class="foto__head">
    <p class="eyebrow" data-reveal="up">${esc(photography.label)}</p>
    <h2 class="foto__title" id="foto-t" data-reveal="mask">${lines([photography.title])}</h2>
    <p class="foto__intro" data-reveal="up">${esc(photography.intro)}</p>
  </header>
  <div class="foto__grid">
    ${photography.items
      .map(
        (it, i) => `
    <figure class="ph ph--${it.span}" data-reveal="img"${demoAttr(it.image)}>
      ${img(it.image, { sizes: '(max-width: 820px) 100vw, 42vw' })}
      <figcaption><b>${pad(i + 1)}</b>${esc(it.caption)}</figcaption>
    </figure>`,
      )
      .join('')}
  </div>
</section>`;

export const renderFinalCta = (): string => `
<section class="cta" id="ordina" aria-labelledby="cta-t">
  <figure class="cta__photo" data-reveal="fade"${demoAttr(finalCta.image)}>${img(finalCta.image, { sizes: '(max-width: 820px) 100vw, 70vw' })}</figure>
  <div class="cta__body">
    <h2 class="cta__title" id="cta-t" data-reveal="mask">${lines(finalCta.titleLines)}</h2>
    <p class="cta__sub" data-reveal="up">${esc(finalCta.subtitle)}</p>
    <div class="cta__btns" data-reveal="up" style="--rd:.1s">
      <a class="btn btn--solid btn--lg" href="${site.links.menu}">${roll(finalCta.primary)}</a>
      <a class="btn btn--line btn--lg" href="${orderHref()}"${ext()}>${roll(finalCta.secondary)}</a>
    </div>
  </div>
</section>`;

const pending = `<span class="pending">${esc(footerCopy.pending)}</span>`;
const social = (label: string, href: string | null) =>
  href ? `<a href="${esc(href)}" target="_blank" rel="noopener noreferrer">${roll(label)}</a>` : `${esc(label)} ${pending}`;

export const renderFooter = (): string => {
  const c = site.contacts;
  return `
<footer class="ftr" id="contatti">
  <div class="ftr__grid">
    <div class="ftr__brand">${renderLogo('logo--lg')}</div>
    <nav class="ftr__col" aria-label="${esc(footerCopy.nav)}">
      <h3>${esc(footerCopy.nav)}</h3>
      <ul>${site.nav.map((n) => `<li><a href="${n.href}">${roll(n.label)}</a></li>`).join('')}</ul>
    </nav>
    <nav class="ftr__col" aria-label="${esc(footerCopy.menu)}">
      <h3>${esc(footerCopy.menu)}</h3>
      <ul>${products.map((p) => `<li><a href="#menu" data-open="${p.id}">${roll(p.name)}</a></li>`).join('')}</ul>
    </nav>
    <div class="ftr__col">
      <h3>${esc(footerCopy.contacts)}</h3>
      <ul>
        <li>${c.email ? `<a href="mailto:${esc(c.email)}">${roll(c.email)}</a>` : `Email ${pending}`}</li>
        <li>${c.phone ? `<a href="tel:${esc(c.phone.replace(/\s/g, ''))}">${roll(c.phone)}</a>` : `Telefono ${pending}`}</li>
        <li>${social('Instagram', site.social.instagram)}</li>
        <li>${social('TikTok', site.social.tiktok)}</li>
      </ul>
    </div>
    <div class="ftr__col">
      <h3>${esc(footerCopy.address)}</h3>
      <p>${c.address ? esc(c.address) : pending}</p>
      <h3 class="ftr__h2">${esc(footerCopy.hours)}</h3>
      ${c.hours?.length ? `<ul>${c.hours.map((h) => `<li>${esc(h)}</li>`).join('')}</ul>` : `<p>${pending}</p>`}
    </div>
  </div>
  <p class="ftr__giant" aria-hidden="true">${esc(site.brand.name)}</p>
  <div class="ftr__legal">
    <p>© ${new Date().getFullYear()} ${esc(site.brand.name)}. ${esc(footerCopy.rights)}</p>
    <p><a href="${site.legal.privacy}">${roll(footerCopy.privacy)}</a> <a href="${site.legal.cookie}">${roll(footerCopy.cookie)}</a></p>
  </div>
</footer>`;
};
