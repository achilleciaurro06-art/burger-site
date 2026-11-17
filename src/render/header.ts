import { site, orderHref, orderIsExternal } from '../config/site';
import { esc, roll } from './helpers';

const ext = () => (orderIsExternal() ? ' target="_blank" rel="noopener noreferrer"' : '');

export const renderLogo = (cls = ''): string => {
  const { name, logoSrc } = site.brand;
  const inner = logoSrc
    ? `<img src="${logoSrc}" alt="${esc(name)}" height="28">`
    : `<span class="logo__mark" aria-hidden="true"></span><span class="logo__text">${esc(name)}</span>`;
  return `<a class="logo ${cls}" href="#top" aria-label="${esc(name)} — inizio pagina">${inner}</a>`;
};

export const renderHeader = (): string => `
<header class="hdr" data-header>
  ${renderLogo()}
  <nav class="nav" aria-label="Principale">
    <ul>${site.nav.map((n) => `<li><a href="${n.href}">${roll(n.label)}</a></li>`).join('')}</ul>
  </nav>
  <a class="btn btn--solid hdr__cta" href="${orderHref()}"${ext()}>${roll('ORDINA')}</a>
  <button class="burger" type="button" aria-expanded="false" aria-controls="mobile-menu" aria-label="Apri il menu"><span></span><span></span></button>
</header>
<div class="mm" id="mobile-menu" inert>
  <nav aria-label="Menu mobile">
    <ul>
      ${site.nav.map((n, i) => `<li style="--i:${i}"><a href="${n.href}"><small>0${i + 1}</small>${esc(n.label)}</a></li>`).join('')}
    </ul>
    <a class="btn btn--solid mm__cta" style="--i:${site.nav.length}" href="${orderHref()}"${ext()}>ORDINA</a>
  </nav>
</div>`;
