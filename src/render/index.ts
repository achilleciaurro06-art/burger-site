import { site } from '../config/site';
import { url } from '../config/assets';
import { renderHeader } from './header';
import { renderExperience } from './experience';
import { renderDialogs, renderFinalCta, renderFooter, renderMenu, renderPhilosophy, renderPhotography } from './sections';
import { esc } from './helpers';

/** HTML del <body>: generato a build/dev time (pre-render) per SEO e primo paint senza JS. */
export const renderApp = (): string =>
  `${renderHeader()}<main id="main">${renderExperience()}${renderPhilosophy()}${renderMenu()}${renderPhotography()}${renderFinalCta()}</main>${renderFooter()}${renderDialogs()}`;

/** Metadati + tema (variabili CSS dalla config) per <head>. */
export const renderHead = (): string => {
  const c = site.colors;
  const canonical = site.url ? `<link rel="canonical" href="${esc(site.url)}">` : '';
  return [
    `<title>${esc(site.seo.title)}</title>`,
    `<meta name="description" content="${esc(site.seo.description)}">`,
    `<meta name="theme-color" content="${site.seo.themeColor}">`,
    canonical,
    `<meta property="og:type" content="website">`,
    `<meta property="og:title" content="${esc(site.seo.title)}">`,
    `<meta property="og:description" content="${esc(site.seo.description)}">`,
    `<meta name="twitter:card" content="summary">`,
    `<link rel="icon" href="${url('favicon.svg')}" type="image/svg+xml">`,
    `<style id="theme">:root{--black:${c.black};--black-2:${c.black2};--white:${c.white};--warm:${c.warm};--bbq:${c.bbq};--caramel:${c.caramel}}</style>`,
  ].join('\n    ');
};
