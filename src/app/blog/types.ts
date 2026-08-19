import type { Locale } from "@/lib/i18n/config";

import type { Cluster, Funnel, Intent } from "@/app/blog/content-map";

// Modelo de un artículo. Está pensado para tres lectores a la vez:
//  · la persona, que escanea encabezados y tablas;
//  · el buscador, que necesita estructura y datos marcados;
//  · el modelo de lenguaje, que cita bloques sueltos —de ahí `answer`, una
//    respuesta autónoma de 40-60 palabras al principio de cada sección.

export type Block =
  | { t: "p"; text: string }
  | { t: "ul"; items: string[] }
  | { t: "ol"; items: string[] }
  | { t: "note"; text: string }
  | { t: "quote"; text: string; by?: string }
  | { t: "table"; head: string[]; rows: string[][] }
  | { t: "steps"; items: { title: string; text: string }[] }
  | { t: "pros"; pros: string[]; cons: string[] };

export type ArticleSection = {
  /** Ancla del índice. */
  id: string;
  h2: string;
  /** Respuesta directa de 40-60 palabras. Va primero, siempre. */
  answer: string;
  blocks: Block[];
  /** Cierre de sección: lo que hay que recordar. */
  takeaway?: string;
};

export type Faq = { q: string; a: string };

export type Article = {
  slug: string;
  locale: Locale;
  cluster: Cluster;
  funnel: Funnel;
  intent: Intent;
  keyword: string;
  /** Secundarias y semánticas que el texto debe cubrir de forma natural. */
  secondary: string[];
  title: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
  /** ISO 8601. */
  published: string;
  updated: string;
  readingMinutes: number;
  author: string;
  /** Entradilla: dos o tres párrafos antes del índice. */
  intro: string[];
  sections: ArticleSection[];
  faqs: Faq[];
  /** Fuentes oficiales o de autoridad. */
  external: { label: string; url: string }[];
  /** Términos del diccionario que se enlazan. */
  terms: string[];
  /** Otros artículos del mismo idioma. */
  related: string[];
  course?: "remote-professional" | "remote-founder";
  /** Ilustración de cabecera: fichero en public/blog y su ALT. */
  hero?: { file: string; alt: string };
};
