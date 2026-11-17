/**
 * CONFIGURAZIONE GLOBALE DEL SITO
 * Tutto ciò che identifica il brand, la navigazione, i link e i contatti vive qui.
 * I valori `null` / '' = "non ancora forniti": l'interfaccia li mostra come
 * "da configurare" e non inventa mai dati reali.
 */
import type { NavLink } from '../types';

export const site = {
  lang: 'it',
  /** URL pubblico del sito (serve per canonical / Open Graph). Lasciare '' finché non è noto. */
  url: '',

  brand: {
    // NOME PROVVISORIO: sostituire con il brand reale.
    name: 'YOUR BRAND',
    /** Se valorizzato (es. '/images/logo.svg') sostituisce il wordmark testuale. */
    logoSrc: null as string | null,
  },

  seo: {
    title: 'Not Just a Burger — YOUR BRAND',
    description:
      'Un hamburger che si scompone, racconta ogni ingrediente e si ricompone su un piatto bianco. Scorri per seguirlo.',
    themeColor: '#000000',
  },

  /** Palette: viene iniettata come variabili CSS (:root) in fase di render. */
  colors: {
    black: '#000000',
    black2: '#101010',
    white: '#FFFFFF',
    warm: '#F5F2EC',
    bbq: '#A52A20',
    caramel: '#D6A15D',
  },

  nav: [
    { label: 'MENU', href: '#menu' },
    { label: 'INGREDIENTI', href: '#ingredienti' },
    { label: 'LA NOSTRA FILOSOFIA', href: '#filosofia' },
  ] as NavLink[],

  /**
   * Destinazioni delle CTA.
   * orderUrl: link al servizio di ordinazione (sito, app delivery, WhatsApp, telefono `tel:`...).
   * Finché è vuoto, "ORDINA" porta alla sezione contatti del footer.
   */
  links: {
    orderUrl: '',
    orderFallback: '#contatti',
    menu: '#menu',
  },

  contacts: {
    email: null as string | null,
    phone: null as string | null,
    address: null as string | null,
    hours: null as string[] | null, // es. ['Lun–Ven 12:00–23:00', 'Sab–Dom 12:00–00:00']
  },

  social: {
    instagram: null as string | null,
    tiktok: null as string | null,
  },

  legal: {
    privacy: 'privacy.html',
    cookie: 'cookie.html',
  },

  currency: 'EUR',

  /** Mostra l'etichetta "IMG DEMO" sulle immagini provvisorie. Mettere false in produzione. */
  showPlaceholderLabels: true,
};

export const orderHref = () => site.links.orderUrl || site.links.orderFallback;
export const orderIsExternal = () => /^https?:\/\//i.test(site.links.orderUrl);
