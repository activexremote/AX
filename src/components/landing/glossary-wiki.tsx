"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import { LocaleLink } from "@/components/locale-link";
import type { Locale } from "@/lib/i18n/config";

export type WikiTerm = {
  id: string;
  href: string;
  letter: string;
  term: string;
  short: string;
  synonyms: string[];
  category: string;
  categoryLabel: string;
  art: string;
};

type Copy = {
  azLabel: string;
  searchLabel: string;
  searchPlaceholder: string;
  noResults: string;
  clearSearch: string;
  categoryLabel: string;
  all: string;
  /** Con «{n}» donde va el número. */
  countTemplate: string;
};

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

/**
 * El diccionario, recorrido como una wiki.
 *
 * Antes era una lista agrupada por área: correcta, pero obligaba a saber en
 * qué área cae un término para encontrarlo, que es justo lo que no sabe quien
 * viene a buscarlo. De la A a la Z no hay que saber nada.
 *
 * El filtro y la búsqueda son de cliente y sólo esconden tarjetas: los 34
 * términos están en el HTML desde el principio, así que un buscador —o alguien
 * sin JavaScript— los ve todos igual.
 */
export function GlossaryWiki({
  terms,
  copy,
  categories,
  locale,
}: {
  terms: WikiTerm[];
  copy: Copy;
  categories: { key: string; label: string }[];
  locale: Locale;
}) {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<string | null>(null);

  const q = query.trim().toLocaleLowerCase(locale);

  const visible = useMemo(
    () =>
      terms.filter((t) => {
        if (cat && t.category !== cat) return false;
        if (!q) return true;
        const heno = [t.term, t.short, ...t.synonyms].join(" ").toLocaleLowerCase(locale);
        return heno.includes(q);
      }),
    [terms, q, cat, locale],
  );

  // Las letras que de verdad tienen algo. Enlazar a una vacía es prometer un
  // salto que no lleva a ninguna parte.
  const conTerminos = useMemo(() => new Set(visible.map((t) => t.letter)), [visible]);

  const porLetra = useMemo(() => {
    const mapa = new Map<string, WikiTerm[]>();
    for (const t of visible) {
      const arr = mapa.get(t.letter) ?? [];
      arr.push(t);
      mapa.set(t.letter, arr);
    }
    return [...mapa.entries()].sort(([a], [b]) => a.localeCompare(b, locale));
  }, [visible, locale]);

  const filtrando = Boolean(q || cat);

  return (
    <div className="axr-wiki">
      {/* ── Controles ─────────────────────────────── */}
      <div className="axr-wiki__controls">
        <div className="axr-wiki__search">
          <label htmlFor="wiki-q" className="axr-wiki__label">
            {copy.searchLabel}
          </label>
          <div className="axr-wiki__search-box">
            <input
              id="wiki-q"
              type="search"
              value={query}
              placeholder={copy.searchPlaceholder}
              onChange={(e) => setQuery(e.target.value)}
              autoComplete="off"
            />
            {query ? (
              <button type="button" onClick={() => setQuery("")}>
                {copy.clearSearch}
              </button>
            ) : null}
          </div>
        </div>

        <div className="axr-wiki__cats">
          <span className="axr-wiki__label">{copy.categoryLabel}</span>
          <div className="axr-wiki__cat-list">
            <button type="button" data-on={cat === null} onClick={() => setCat(null)}>
              {copy.all}
            </button>
            {categories.map((c) => (
              <button
                key={c.key}
                type="button"
                data-cat={c.key}
                data-on={cat === c.key}
                onClick={() => setCat(cat === c.key ? null : c.key)}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Índice A–Z ────────────────────────────── */}
      <nav className="axr-wiki__az" aria-label={copy.azLabel}>
        {ALPHABET.map((l) =>
          conTerminos.has(l) ? (
            <a key={l} href={`#letra-${l}`}>
              {l}
            </a>
          ) : (
            <span key={l} aria-hidden>
              {l}
            </span>
          ),
        )}
      </nav>

      <p className="axr-wiki__count" role="status">
        {copy.countTemplate.replace("{n}", String(visible.length))}
      </p>

      {/* ── Bloques por letra ─────────────────────── */}
      {porLetra.length === 0 ? (
        <p className="axr-wiki__empty">{copy.noResults}</p>
      ) : (
        porLetra.map(([letra, items]) => (
          <section key={letra} id={`letra-${letra}`} className="axr-wiki__block">
            <h2 className="axr-wiki__letter">
              <span>{letra}</span>
            </h2>
            <div className="axr-wiki__grid">
              {items.map((t) => (
                <LocaleLink key={t.id} href={t.href} className="axr-wiki__card" data-cat={t.category}>
                  <span className="axr-wiki__art">
                    <Image src={t.art} alt="" width={360} height={360} />
                  </span>
                  <span className="axr-wiki__body">
                    <span className="axr-wiki__cat">{t.categoryLabel}</span>
                    <strong>{t.term}</strong>
                    <span className="axr-wiki__short">{t.short}</span>
                  </span>
                </LocaleLink>
              ))}
            </div>
          </section>
        ))
      )}

      {filtrando ? null : <div className="axr-wiki__foot" aria-hidden />}
    </div>
  );
}
