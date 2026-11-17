import type { TextosChat } from "@/components/campus/assistant-chat";

// Los textos del chat de ayuda del panel (ver components/admin/ayuda).

export const ayudaPanelCopy: Record<"es" | "en", Record<"administrador" | "profesor" | "comercial", TextosChat>> = (() => {
  const es = {
    open: "Ayuda del panel",
    title: "Ayuda del panel",
    subtitle: "Cómo funciona cada sección y dónde encontrar cada cosa.",
    close: "Cerrar",
    placeholder: "Pregunta cómo hacer algo o dónde está…",
    send: "Enviar",
    thinking: "Pensando…",
    welcome:
      "¡Hola! Te explico cualquier parte del panel: qué hay en cada sección, cómo se hace cada cosa paso a paso y dónde mirar cada dato. Si preguntas «¿qué es esto?», te explico la página en la que estás.",
    suggestions: [] as string[],
    error: "No he podido responder ahora mismo. Inténtalo de nuevo en un momento.",
    noAnswer: "No tengo eso en el manual del panel. Pregúntalo a admin@activexremote.com.",
    noAnswerMaybe: "No lo tengo exactamente. ¿Te refieres a alguna de estas?",
    related: "Para seguir:",
    reset: "Nueva conversación",
    disclaimer: "Responde con IA a partir del manual del panel. Si algo no cuadra con lo que ves, avisa a admin@activexremote.com.",
  };
  const en = {
    ...es,
    open: "Panel help",
    title: "Panel help",
    subtitle: "How each section works and where to find things.",
    close: "Close",
    placeholder: "Ask how to do something or where it is…",
    send: "Send",
    thinking: "Thinking…",
    welcome:
      "Hi! I can explain any part of the panel: what each section shows, how to do each thing step by step and where to look for any data. Ask “what is this?” and I'll explain the page you're on.",
    error: "I couldn't answer right now. Please try again in a moment.",
    noAnswer: "That isn't in the panel manual. Please ask admin@activexremote.com.",
    noAnswerMaybe: "I don't have exactly that. Do you mean one of these?",
    related: "Next:",
    reset: "New conversation",
    disclaimer: "AI answers based on the panel manual. If something doesn't match what you see, tell admin@activexremote.com.",
  };
  const sug = {
    es: {
      administrador: ["¿Qué es esta página y cómo se usa?", "¿Cómo invito a alguien al dry run?", "¿Dónde corrijo las tareas de los alumnos?"],
      profesor: ["¿Qué es esta página y cómo se usa?", "¿Dónde corrijo las tareas de mis alumnos?", "¿Cómo veo el progreso de un alumno?"],
      comercial: ["¿Qué es esta página y cómo se usa?", "¿Cómo calculo un presupuesto?", "¿Dónde está el material para enviar a un cliente?"],
    },
    en: {
      administrador: ["What is this page and how do I use it?", "How do I invite someone to the dry run?", "Where do I grade students' tasks?"],
      profesor: ["What is this page and how do I use it?", "Where do I grade my students' tasks?", "How do I see a student's progress?"],
      comercial: ["What is this page and how do I use it?", "How do I calculate a quote?", "Where is the material to send a client?"],
    },
  };
  const con = (base: typeof es, l: "es" | "en") =>
    Object.fromEntries((["administrador", "profesor", "comercial"] as const).map((r) => [r, { ...base, suggestions: sug[l][r] }])) as Record<
      "administrador" | "profesor" | "comercial",
      TextosChat
    >;
  return { es: con(es, "es"), en: con(en, "en") };
})();
