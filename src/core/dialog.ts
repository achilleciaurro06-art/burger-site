/** Pannello di dettaglio prodotto: <dialog> nativo (focus trap, ESC) con animazione di chiusura. */
export function initDialogs(): void {
  const html = document.documentElement;

  const open = (id: string): void => {
    const dlg = document.getElementById(`pd-${id}`) as HTMLDialogElement | null;
    if (!dlg || dlg.open) return;
    dlg.classList.remove('is-closing');
    dlg.showModal();
    html.classList.add('dialog-open');
    dlg.querySelector<HTMLElement>('.pd__body')?.scrollTo(0, 0);
  };

  const close = (dlg: HTMLDialogElement): void => {
    if (!dlg.open || dlg.classList.contains('is-closing')) return;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    dlg.classList.add('is-closing');
    setTimeout(() => dlg.close(), reduce ? 0 : 440);
  };

  document.addEventListener('click', (e) => {
    const t = e.target as HTMLElement;
    const trigger = t.closest<HTMLElement>('[data-open]');
    if (trigger) {
      e.preventDefault();
      open(trigger.dataset.open!);
      return;
    }
    const card = t.closest<HTMLElement>('.prod');
    if (card && !t.closest('a')) card.querySelector<HTMLElement>('[data-open]')?.click();
  });

  document.querySelectorAll<HTMLDialogElement>('dialog.pd').forEach((dlg) => {
    dlg.addEventListener('click', (e) => {
      const t = e.target as HTMLElement;
      if (t === dlg || t.closest('[data-close]')) close(dlg);
    });
    dlg.addEventListener('cancel', (e) => {
      e.preventDefault();
      close(dlg);
    });
    dlg.addEventListener('close', () => {
      dlg.classList.remove('is-closing');
      html.classList.remove('dialog-open');
    });
  });
}
