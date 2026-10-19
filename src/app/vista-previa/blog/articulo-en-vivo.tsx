"use client";

import { useEffect, useState } from "react";

import { ArticleView } from "@/app/blog/article-view";
import type { Article } from "@/app/blog/types";

/**
 * El artículo de la vista previa, que se repinta con cada mensaje del editor.
 * Sólo se aceptan mensajes del mismo origen: la página no pinta lo que le
 * mande cualquier otra web que la meta en un iframe.
 */
export function ArticuloEnVivo({ inicial }: { inicial: Article }) {
  const [a, setA] = useState(inicial);

  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if (e.origin !== window.location.origin || e.data?.type !== "axr:blog-preview" || !e.data.article) return;
      setA(e.data.article as Article);
    };
    window.addEventListener("message", onMsg);
    if (window.parent !== window) window.parent.postMessage({ type: "axr:blog-preview-ready" }, window.location.origin);

    // Es una maqueta: los enlaces no navegan (sacarían la vista previa del
    // iframe). Las anclas del índice sí funcionan.
    const onClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest("a");
      if (link && !link.getAttribute("href")?.startsWith("#")) e.preventDefault();
    };
    document.addEventListener("click", onClick, true);
    return () => {
      window.removeEventListener("message", onMsg);
      document.removeEventListener("click", onClick, true);
    };
  }, []);

  return <ArticleView a={a} terms={[]} />;
}
