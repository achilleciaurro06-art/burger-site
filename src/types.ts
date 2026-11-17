export interface ImageAsset {
  src: string;
  /** Variante piccola per srcset (opzionale). */
  srcSm?: string;
  widthSm?: number;
  width: number;
  height: number;
  alt: string;
  /** true = immagine dimostrativa (ritaglio dal video) da sostituire con foto reali. */
  demo?: boolean;
  /** object-position CSS per il ritaglio responsive. */
  position?: string;
}

export interface VideoSource {
  src: string;
  type: string;
  /** Peso indicativo in byte, usato per la barra di caricamento se il server non invia Content-Length. */
  approxBytes: number;
}

export interface Ingredient {
  id: string;
  name: [string, string];
  title: string;
  description: string;
  details: [string, string, string];
  image: ImageAsset;
  /** Composizione: testo a sinistra/destra, "big" = foto macro di grande formato. */
  layout: 'left' | 'right' | 'left-big' | 'right-big';
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  longDescription: string;
  ingredients: string[];
  /** null = prezzo non ancora definito. */
  price: number | null;
  /** Solo se forniti dal brand. Array vuoto = sezione non mostrata. */
  allergens: string[];
  image: ImageAsset;
  size: 'l' | 'm' | 's';
}

export interface PhotoItem {
  id: string;
  caption: string;
  image: ImageAsset;
  span: string;
}

export interface NavLink {
  label: string;
  href: string;
}
