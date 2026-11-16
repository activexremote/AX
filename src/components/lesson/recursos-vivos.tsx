"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

// Los enlaces del material se abren en otra pestaña. Al pulsar uno se marca
// aquí al momento y, al volver a la lección, se recarga lo que depende de
// ello (lo que falta, si la lección ya está terminada).
export function RecursosVivos() {
  const router = useRouter();
  useEffect(() => {
    let pendiente = false;
    const clic = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest?.("a[data-recurso]");
      if (!a) return;
      a.classList.add("is-seen");
      pendiente = true;
    };
    const vuelve = () => {
      if (document.visibilityState !== "visible" || !pendiente) return;
      pendiente = false;
      router.refresh();
    };
    document.addEventListener("click", clic);
    document.addEventListener("auxclick", clic);
    document.addEventListener("visibilitychange", vuelve);
    window.addEventListener("focus", vuelve);
    return () => {
      document.removeEventListener("click", clic);
      document.removeEventListener("auxclick", clic);
      document.removeEventListener("visibilitychange", vuelve);
      window.removeEventListener("focus", vuelve);
    };
  }, [router]);
  return null;
}
