import type { Locale } from "@/lib/i18n/config";

// Copy del checkout. Separada de la landing porque aquí no se vende: se cobra.
// El tono cambia — frases cortas, cero adjetivos y ninguna sorpresa sobre lo
// que se va a cargar en la tarjeta.

export const checkoutCopy: Record<Locale, {
  meta: { title: string; description: string };
  eyebrow: string;
  title: string;
  lead: string;
  courseLabel: string;
  courseHint: string;
  courses: { key: string; name: string; sub: string }[];
  offerLabel: string;
  offers: Record<"professional-unico" | "professional-plazos" | "founder-unico" | "founder-plazos", { name: string; detail: string; note?: string }>;
  totalLabel: string;
  dataLabel: string;
  firstName: string;
  lastName: string;
  email: string;
  emailHint: string;
  consent: string;
  submit: string;
  sending: string;
  secure: string;
  errors: Record<string, string>;
  cancelled: { title: string; body: string; retry: string; help: string };
  unavailable: { title: string; body: string };
  closed: { title: string; body: string; cta: string };
  thanks: {
    title: string;
    body: string;
    inbox: string;
    instalmentsNote: string;
    campus: string;
    home: string;
    pendingTitle: string;
    pendingBody: string;
  };
}> = {
  es: {
    meta: {
      title: "Matrícula",
      description: "Formaliza tu matrícula en Remote Professional o Remote Founder. Pago seguro con Stripe.",
    },
    eyebrow: "Matrícula",
    title: "Reserva tu plaza.",
    lead: "Grupos de 25 plazas. Al confirmarse el pago recibes en tu email el acceso al campus virtual.",

    courseLabel: "¿Qué curso haces?",
    courseHint: "Remote Professional dura 8 semanas; Remote Founder, 13.",
    courses: [
      { key: "remote-professional", name: "Remote Professional", sub: "8 semanas" },
      { key: "remote-founder", name: "Remote Founder", sub: "13 semanas" },
    ],

    offerLabel: "¿Cómo prefieres pagarlo?",
    offers: {
      "professional-unico": { name: "Pago único", detail: "Todo el curso en un solo cargo. Te ahorras 100 €." },
      "professional-plazos": {
        name: "5 plazos",
        detail: "Cinco cargos mensuales de 198 € (990 € en total).",
        note: "El primer cargo es hoy; los otros cuatro, el mismo día de los meses siguientes. Se detiene solo al quinto. Cada cargo lleva su factura.",
      },
      "founder-unico": { name: "Pago único", detail: "Todo el curso en un solo cargo. Te ahorras 100 €." },
      "founder-plazos": {
        name: "5 plazos",
        detail: "Cinco cargos mensuales de 318 € (1.590 € en total).",
        note: "El primer cargo es hoy; los otros cuatro, el mismo día de los meses siguientes. Se detiene solo al quinto. Cada cargo lleva su factura.",
      },
    },
    totalLabel: "Total",

    dataLabel: "Tus datos",
    firstName: "Nombre",
    lastName: "Apellidos",
    email: "Email",
    emailHint: "Aquí te llega el acceso al campus. Revisa que esté bien escrito.",
    consent:
      "He leído y acepto las condiciones de contratación y la política de privacidad.",
    submit: "Ir al pago seguro",
    sending: "Abriendo el pago…",
    secure: "El pago lo procesa Stripe. No guardamos ni vemos los datos de tu tarjeta.",

    errors: {
      missing_course: "Elige un curso.",
      missing_offer: "Elige una forma de pago.",
      missing_fields: "Completa nombre, apellidos y email.",
      bad_email: "Revisa la dirección de email.",
      no_consent: "Tienes que aceptar las condiciones para continuar.",
      offer_expired: "Esa oferta ya no está disponible. Vuelve a elegir.",
      not_configured: "El pago no está disponible ahora mismo. Escríbenos y lo resolvemos.",
      stripe: "No se pudo abrir el pago. Inténtalo de nuevo en un momento.",
      db: "No se pudo registrar la solicitud. Inténtalo de nuevo.",
    },

    cancelled: {
      title: "Has salido del pago.",
      body: "No se ha cobrado nada. Tus datos siguen guardados, así que puedes retomarlo cuando quieras.",
      retry: "Volver al pago",
      help: "¿Alguna duda antes de decidir? Escríbenos y te la resolvemos.",
    },
    unavailable: {
      title: "El pago todavía no está activo.",
      body: "Estamos terminando de configurarlo. Déjanos tus datos desde la página del programa y te avisamos en cuanto se abra la matrícula.",
    },
    closed: {
      title: "La plaza se reserva hablando con el equipo.",
      body: "Déjanos tus datos y te enviamos el temario, las fechas, el precio y las condiciones de la convocatoria. Te escribimos en menos de 24 horas laborables, sin compromiso.",
      cta: "Solicita información",
    },
    thanks: {
      title: "Matrícula confirmada.",
      body: "Ya tienes plaza en la convocatoria.",
      inbox:
        "Te hemos enviado un email con el acceso al campus virtual. Si no lo ves en unos minutos, mira en spam.",
      instalmentsNote:
        "Los otros cuatro plazos se cargarán automáticamente en la misma tarjeta, el mismo día de los meses siguientes.",
      campus: "Entrar al campus",
      home: "Volver a la portada",
      pendingTitle: "Estamos confirmando el pago.",
      pendingBody:
        "Tu banco todavía no ha dado el visto bueno. En cuanto lo haga te llega el email con el acceso; no hace falta que hagas nada.",
    },
  },

  en: {
    meta: {
      title: "Enrolment",
      description: "Complete your enrolment in Remote Professional or Remote Founder. Secure payment with Stripe.",
    },
    eyebrow: "Enrolment",
    title: "Reserve your seat.",
    lead: "Groups of 25 seats. Once the payment clears you get campus access in your inbox.",

    courseLabel: "Which course are you taking?",
    courseHint: "Remote Professional runs for 8 weeks; Remote Founder for 13.",
    courses: [
      { key: "remote-professional", name: "Remote Professional", sub: "8 weeks" },
      { key: "remote-founder", name: "Remote Founder", sub: "13 weeks" },
    ],

    offerLabel: "How would you like to pay?",
    offers: {
      "professional-unico": { name: "One payment", detail: "The whole course in a single charge. You save €100." },
      "professional-plazos": {
        name: "5 instalments",
        detail: "Five monthly charges of €198 (€990 in total).",
        note: "The first charge is today; the other four on the same day of the following months. It stops on its own after the fifth. Every charge comes with its invoice.",
      },
      "founder-unico": { name: "One payment", detail: "The whole course in a single charge. You save €100." },
      "founder-plazos": {
        name: "5 instalments",
        detail: "Five monthly charges of €318 (€1,590 in total).",
        note: "The first charge is today; the other four on the same day of the following months. It stops on its own after the fifth. Every charge comes with its invoice.",
      },
    },
    totalLabel: "Total",

    dataLabel: "Your details",
    firstName: "First name",
    lastName: "Last name",
    email: "Email",
    emailHint: "This is where campus access is sent. Check the spelling.",
    consent: "I have read and accept the terms of service and the privacy policy.",
    submit: "Go to secure payment",
    sending: "Opening payment…",
    secure: "Payment is processed by Stripe. We never see or store your card details.",

    errors: {
      missing_course: "Pick a course.",
      missing_offer: "Pick a payment option.",
      missing_fields: "Fill in your first name, last name and email.",
      bad_email: "Check the email address.",
      no_consent: "You need to accept the terms to continue.",
      offer_expired: "That offer is no longer available. Please choose again.",
      not_configured: "Payment is not available right now. Write to us and we'll sort it out.",
      stripe: "Payment could not be opened. Please try again in a moment.",
      db: "We could not register the request. Please try again.",
    },

    cancelled: {
      title: "You left the payment.",
      body: "Nothing was charged. Your details are saved, so you can pick it up whenever you want.",
      retry: "Back to payment",
      help: "Any questions before deciding? Write to us and we'll answer them.",
    },
    unavailable: {
      title: "Payment is not live yet.",
      body: "We're finishing the setup. Leave your details on the program page and we'll tell you the moment enrolment opens.",
    },
    closed: {
      title: "Seats are booked by talking to the team.",
      body: "Leave us your details and we'll send you the syllabus, the dates, the price and the cohort's terms. We reply within 24 working hours, no strings attached.",
      cta: "Request information",
    },
    thanks: {
      title: "Enrolment confirmed.",
      body: "Your seat in the cohort is booked.",
      inbox:
        "We've emailed you access to the virtual campus. If you don't see it in a few minutes, check your spam folder.",
      instalmentsNote:
        "The other four instalments will be charged automatically to the same card, on the same day of the following months.",
      campus: "Enter the campus",
      home: "Back to the homepage",
      pendingTitle: "We're confirming the payment.",
      pendingBody:
        "Your bank hasn't cleared it yet. As soon as it does you'll get the access email; there's nothing you need to do.",
    },
  },
};
