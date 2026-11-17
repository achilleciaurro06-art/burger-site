/** Header (stato "scrolled") e menu mobile animato. */
export function initNav(): void {
  const html = document.documentElement;
  const header = document.querySelector<HTMLElement>('[data-header]');
  const burger = document.querySelector<HTMLButtonElement>('.burger');
  const menu = document.getElementById('mobile-menu');
  if (!header) return;

  const exp = document.querySelector<HTMLElement>('[data-experience]');
  const onScroll = (): void => {
    // Durante l'esperienza scroll-driven l'header resta trasparente: il video è a tutto schermo.
    const solid =
      html.dataset.exp === 'scrub' && exp ? exp.getBoundingClientRect().bottom <= header.offsetHeight : window.scrollY > 24;
    header.toggleAttribute('data-scrolled', solid);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  if (!burger || !menu) return;
  const setOpen = (open: boolean): void => {
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Chiudi il menu' : 'Apri il menu');
    menu.toggleAttribute('data-open', open);
    menu.toggleAttribute('inert', !open);
    html.classList.toggle('menu-open', open);
  };
  burger.addEventListener('click', () => setOpen(burger.getAttribute('aria-expanded') !== 'true'));
  menu.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).closest('a')) setOpen(false);
  });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.hasAttribute('data-open')) {
      setOpen(false);
      burger.focus();
    }
  });
  matchMedia('(min-width: 961px)').addEventListener('change', (e) => e.matches && setOpen(false));
}
