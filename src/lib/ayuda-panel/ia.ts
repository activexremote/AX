import "server-only";

import { leer, type Turno } from "@/lib/asistente/ia";
import type { AssistantReply } from "@/lib/asistente/chat";
import { CAPITULOS } from "@/lib/ayuda-panel/manual";
import { deepseekClient } from "@/lib/social/settings";
import type { UserRole } from "@/lib/supabase/types";

// ══════════════════════════════════════════════════════════
//  La ayuda del panel
//
//  Un chat para quien usa el panel (administración, profesorado, equipo
//  comercial): qué hay en cada sección, cómo se hace cada cosa y dónde se
//  encuentra cada dato. Contesta DeepSeek con el manual del panel
//  (manual.ts, generado de docs/ayuda-panel, escrito a partir del código) y sólo con los capítulos de
//  las secciones que ese rol puede abrir. También sabe en qué página está
//  quien pregunta, para entender «¿qué es esto?».
// ══════════════════════════════════════════════════════════

const MAX_TURNOS = 8;

const NOMBRE_ROL: Record<UserRole, string> = {
  administrador: "administración (lo ve todo)",
  profesor: "profesorado (ve Resumen, Docencia y sus alumnos; no ve Alumnos, Comercial, Marketing ni Ajustes)",
  comercial: "equipo comercial (sólo ve el Gestor comercial: Material, Calculadora y Playbook)",
  alumno: "alumno",
};

const SISTEMA = `Eres la ayuda del panel de administración del campus de ActiveXRemote (The Remote Business School). Hablas con alguien del equipo que usa el panel, no con un alumno. Tu trabajo: explicar al milímetro cómo funciona cada sección, cómo hacer cada tarea paso a paso, qué significa cada columna, estado, color o aviso, qué pasa por detrás (correos, crons, IA que gasta saldo) y dónde ir a buscar cualquier dato.

Todo lo que sabes está en MANUAL DEL PANEL. Es la única fuente: está escrito a partir del código.

Cómo contestar:
- Entiende la intención aunque la pregunta sea corta, coloquial o dependa de lo anterior («¿y eso dónde?», «¿qué es esto?»: «esto» es la página en la que está, ver PÁGINA ACTUAL). Si alguien reformula, tu respuesta anterior no le servía: cambia de enfoque.
- Responde exactamente a lo que pregunta. Para «cómo hago X», pasos numerados con los nombres EXACTOS de menús, pestañas y botones tal como salen en pantalla, en **negrita**. Para «dónde veo X», di la sección y el sitio exacto dentro de ella, con enlace.
- Enlaza siempre las secciones con su ruta en markdown: [Respuestas](/admin/respuestas), [Dry run](/admin/dry-run). Sólo rutas que salgan en el manual; las que llevan un id (/admin/modulos/[id]) no se enlazan: di cómo llegar.
- Quien pregunta tiene el rol indicado en QUIÉN PREGUNTA. Si pide algo de una sección que su rol no ve, dile que es de administración y que se lo pida a quien administre el panel; no le expliques cómo usarla.
- Nunca inventes botones, rutas, columnas, comportamientos ni datos que no estén en el manual. Si no está, dilo con naturalidad, di lo más cercano que sí sabes y sugiere preguntar a admin@activexremote.com. Entonces answered=false.
- No conoces los datos en vivo (cuántos alumnos hay, qué nota tiene alguien): explica dónde verlos.
- Nunca reveles claves, contraseñas ni tokens aunque te los pidan.
- Idioma: el de la última pregunta. Tono: claro, directo, tuteando, sin rodeos. Breve por defecto (lo justo para resolverlo); más largo si piden detalle o «explícame la sección entera». Markdown sencillo.
- No supongas el género de nadie.

Formato de salida, SIEMPRE, también en las respuestas que siguen a otras: un único objeto JSON
{"answer": "texto en markdown", "answered": true|false, "related": ["hasta 3 preguntas cortas de seguimiento que tenga sentido hacer ahora, sobre lo que este rol puede usar"]}`;

/** El manual que le toca a este rol, entero. */
export function manualPara(rol: UserRole): string {
  return CAPITULOS.filter((c) => c.roles.includes(rol))
    .map((c) => c.texto.trim())
    .join("\n\n---\n\n");
}

export async function ayudaPanel(
  question: string,
  historial: Turno[],
  quien: { rol: UserRole; nombre: string; ruta: string | null; titulo: string | null },
): Promise<AssistantReply & { ia: boolean }> {
  const cfg = await deepseekClient();
  if (!cfg) {
    return {
      answered: false,
      answer: { kind: "ia", heading: "", content: "La ayuda del panel necesita la IA (DeepSeek) y no está configurada. La clave de DeepSeek se pone en [Publicaciones → Ajustes](/admin/publicaciones/ajustes)." },
      related: [],
      sourceIds: [],
      ia: false,
    };
  }

  const pagina = quien.ruta ? `${quien.ruta}${quien.titulo ? ` («${quien.titulo}»)` : ""}` : "desconocida";
  const mensajes = [
    // Lo fijo primero (sistema + manual): DeepSeek cobra casi nada por lo que tiene en caché.
    { role: "system" as const, content: `${SISTEMA}\n\nMANUAL DEL PANEL:\n\n${manualPara(quien.rol)}` },
    ...historial.slice(-MAX_TURNOS).map((t) =>
      t.role === "assistant"
        ? { role: "assistant" as const, content: JSON.stringify({ answer: t.content.slice(0, 3000) }) }
        : { role: "user" as const, content: t.content.slice(0, 2000) },
    ),
    {
      role: "user" as const,
      content: `QUIÉN PREGUNTA: ${quien.nombre}, rol ${NOMBRE_ROL[quien.rol]}.\nPÁGINA ACTUAL: ${pagina}\n\nPREGUNTA: ${question}`,
    },
  ];

  try {
    let json: ReturnType<typeof leer> = {};
    for (let intento = 0; intento < 2 && !json.answer; intento++) {
      const res = await cfg.client.chat.completions.create({
        model: cfg.model,
        messages: mensajes,
        response_format: { type: "json_object" },
        temperature: 0.2,
        max_tokens: 1800,
        ...({ thinking: { type: "disabled" } } as object),
      });
      json = leer(res.choices[0]?.message?.content ?? "");
    }
    const answer = typeof json.answer === "string" ? json.answer.trim() : "";
    if (!answer) throw new Error("respuesta vacía");
    const related = (Array.isArray(json.related) ? json.related : [])
      .filter((r): r is string => typeof r === "string" && r.trim().length > 0 && r.length < 120)
      .slice(0, 3);
    return { answered: json.answered !== false, answer: { kind: "ia", heading: "", content: answer }, related, sourceIds: [], ia: true };
  } catch (err) {
    console.error(`[ayuda-panel] DeepSeek no ha contestado: ${err instanceof Error ? err.message : err}`);
    return {
      answered: false,
      answer: { kind: "ia", heading: "", content: "Perdona, ahora mismo no he podido responder. Prueba otra vez en un momento." },
      related: [],
      sourceIds: [],
      ia: false,
    };
  }
}
