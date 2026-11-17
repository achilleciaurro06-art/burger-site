/**
 * CONTENUTI EDITORIALI
 * Tutti i testi del sito. I contenuti sono DIMOSTRATIVI: sostituirli con le
 * caratteristiche reali del prodotto (provenienza, certificazioni, allergeni...) solo
 * quando verificate. Nulla di ciò che è scritto qui va considerato un dato reale.
 */
import type { Ingredient, PhotoItem, Product } from '../types';
import { images } from './assets';

export const hero = {
  titleLines: ['NOT JUST', 'A BURGER.'] as [string, string],
  subtitle: 'Ogni ingrediente ha una storia. Ogni morso, un carattere.',
  scrollHint: 'SCORRI',
  loading: 'CARICAMENTO',
};

export const ingredientsIntro = { label: 'INGREDIENTI', total: 7 };

export const ingredients: Ingredient[] = [
  {
    id: 'bun',
    name: ['BRIOCHE', 'BUN'],
    title: 'The perfect start.',
    description:
      'Il primo incontro è tutto. Una brioche dorata, morbida all’interno e leggermente tostata all’esterno. La base perfetta per tutto quello che viene dopo.',
    details: ['GOLDEN TOASTED', 'SOFT TEXTURE', 'BRIOCHE'],
    image: images.bun,
    layout: 'left',
  },
  {
    id: 'lettuce',
    name: ['FRESH', 'LETTUCE'],
    title: 'Freshness matters.',
    description:
      'La freschezza che spezza l’equilibrio delle consistenze. Una nota croccante e leggera che aggiunge contrasto a ogni morso.',
    details: ['FRESH', 'CRISP', 'GREEN'],
    image: images.lettuce,
    layout: 'right',
  },
  {
    id: 'tomato',
    name: ['TOMATO', ''],
    title: 'A touch of freshness.',
    description:
      'Colore, succosità e una nota naturalmente fresca. Il pomodoro aggiunge equilibrio e completa il carattere del panino.',
    details: ['FRESH CUT', 'JUICY', 'NATURAL'],
    image: images.tomato,
    layout: 'left',
  },
  {
    id: 'cheese',
    name: ['CHEDDAR', 'CHEESE'],
    title: 'Let it melt.',
    description:
      'Avvolgente, cremoso e ricco di carattere. Il cheddar incontra il calore della carne e aggiunge una consistenza irresistibile.',
    details: ['MELTED', 'CREAMY', 'RICH FLAVOUR'],
    image: images.cheese,
    layout: 'right-big',
  },
  {
    id: 'beef',
    name: ['GRILLED', 'BEEF'],
    title: 'The heart of it.',
    description:
      'Il protagonista assoluto. Una carne dalla consistenza importante, con una superficie grigliata e un interno succoso. Tutto il carattere del burger parte da qui.',
    details: ['GRILLED', 'JUICY', 'BOLD'],
    image: images.beef,
    layout: 'left-big',
  },
  {
    id: 'bacon',
    name: ['CRISPY', 'BACON'],
    title: 'Crunch with character.',
    description:
      'La nota croccante che cambia tutto. Il bacon aggiunge intensità e una consistenza decisa, creando un contrasto con la morbidezza degli altri ingredienti.',
    details: ['CRISPY', 'SAVOURY', 'TEXTURE'],
    image: images.bacon,
    layout: 'right',
  },
  {
    id: 'sauce',
    name: ['BBQ', 'SAUCE'],
    title: 'The final touch.',
    description:
      'Il dettaglio che lega tutto. Una salsa barbecue dalla consistenza densa e avvolgente, che accompagna la carne e completa il carattere del burger.',
    details: ['BBQ', 'GLOSSY', 'SMOKY'],
    image: images.sauce,
    layout: 'left',
  },
];

export const sauceMoment = {
  titleLines: ['THE SECRET', 'IS IN THE', 'SAUCE.'],
  text: 'Non è solo una salsa. È il dettaglio che unisce ogni ingrediente.',
};

export const finale = {
  titleLines: ['ALL TOGETHER.', 'ONE EXPERIENCE.'] as [string, string],
  subtitle: 'Il risultato di ogni singolo ingrediente.',
};

export const philosophy = {
  label: 'OUR PHILOSOPHY',
  titleLines: ['WE BELIEVE', 'IN EVERY', 'BITE.'],
  text:
    'Crediamo che un grande hamburger non sia semplicemente la somma dei suoi ingredienti. È l’equilibrio tra consistenze, sapori e carattere. Ogni dettaglio contribuisce al risultato finale.',
  principles: ['CONSISTENZE', 'SAPORI', 'CARATTERE'],
  image: images.photoPhilosophy,
  caption: 'FIG. — L’EQUILIBRIO',
};

export const menuSection = {
  label: 'OUR MENU',
  title: 'THE MENU.',
  intro: 'Quattro hamburger. Un solo standard.',
  detailsLabel: 'DETTAGLI',
  orderLabel: 'ORDINA',
  priceTbd: 'PREZZO DA DEFINIRE',
  ingredientsLabel: 'INGREDIENTI',
  allergensLabel: 'ALLERGENI',
  closeLabel: 'CHIUDI',
};

/** Nomi, composizioni e prezzi PROVVISORI. */
export const products: Product[] = [
  {
    id: 'the-original',
    name: 'THE ORIGINAL',
    tagline: 'Il classico.',
    description: 'L’hamburger classico, nel suo equilibrio più pulito.',
    longDescription:
      'L’hamburger classico: brioche, lattuga, pomodoro, cheddar e carne grigliata. Gli ingredienti essenziali, bilanciati per lasciare spazio al carattere di ciascuno.',
    ingredients: ['Brioche bun', 'Fresh lettuce', 'Tomato', 'Cheddar cheese', 'Grilled beef'],
    price: 9, // DEMO
    allergens: [],
    image: images.photoOriginal,
    size: 'l',
  },
  {
    id: 'the-bbq',
    name: 'THE BBQ',
    tagline: 'Smoky e glossy.',
    description: 'L’hamburger con salsa barbecue, densa e avvolgente.',
    longDescription:
      'Il classico completato dalla salsa barbecue: una colata densa che lega carne, formaggio e bacon in un unico carattere affumicato.',
    ingredients: ['Brioche bun', 'Fresh lettuce', 'Tomato', 'Cheddar cheese', 'Grilled beef', 'Crispy bacon', 'BBQ sauce'],
    price: 11, // DEMO
    allergens: [],
    image: images.stack, // DEMO (fotogramma dal video)
    size: 'm',
  },
  {
    id: 'the-double',
    name: 'THE DOUBLE',
    tagline: 'Doppia carne.',
    description: 'Il protagonista, due volte. Doppia carne, stesso equilibrio.',
    longDescription:
      'Per chi vuole la carne al centro di tutto: doppia carne grigliata, cheddar fuso e la stessa attenzione alle consistenze.',
    ingredients: ['Brioche bun', 'Grilled beef ×2', 'Cheddar cheese', 'Tomato', 'Fresh lettuce'],
    price: 13, // DEMO
    allergens: [],
    image: images.photoDouble,
    size: 's',
  },
  {
    id: 'the-crunch',
    name: 'THE CRUNCH',
    tagline: 'Croccante, deciso.',
    description: 'Una componente croccante come protagonista della consistenza.',
    longDescription:
      'Il croccante guida il morso: una nota intensa e decisa che contrasta con la morbidezza della brioche e degli altri ingredienti. Composizione da definire.',
    ingredients: ['Brioche bun', 'Componente croccante', 'Fresh lettuce', 'Tomato'],
    price: 10, // DEMO
    allergens: [],
    image: images.photoCrunch,
    size: 'l',
  },
];

export const photography = {
  label: 'FOOD PHOTOGRAPHY',
  title: 'CLOSE UP.',
  intro: 'Texture, calore, dettaglio.',
  items: [
    { id: 'beef', caption: 'MACRO — CARNE', image: images.beef, span: 'a' },
    { id: 'cheese', caption: 'FORMAGGIO FUSO', image: images.cheese, span: 'b' },
    { id: 'bun', caption: 'PANE TOSTATO', image: images.bun, span: 'c' },
    { id: 'bacon', caption: 'BACON CROCCANTE', image: images.bacon, span: 'd' },
    { id: 'sauce', caption: 'SALSA BARBECUE', image: images.sauce, span: 'e' },
    { id: 'full', caption: 'HAMBURGER COMPLETO', image: images.stack, span: 'f' },
  ] as PhotoItem[],
};

export const finalCta = {
  titleLines: ['READY FOR', 'YOUR NEXT', 'BITE?'],
  subtitle: 'Non limitarti a guardarlo.',
  primary: 'SCOPRI IL MENU',
  secondary: 'ORDINA ORA',
  image: images.photoCta,
};

export const footerCopy = {
  nav: 'NAVIGAZIONE',
  menu: 'MENU',
  contacts: 'CONTATTI',
  social: 'SOCIAL',
  address: 'INDIRIZZO',
  hours: 'ORARI',
  pending: 'Da configurare',
  privacy: 'Privacy Policy',
  cookie: 'Cookie Policy',
  rights: 'Tutti i diritti riservati.',
};
