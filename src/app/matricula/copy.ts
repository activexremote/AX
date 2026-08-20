import type { Locale } from "@/lib/i18n/config";
import type { OfferKey } from "@/lib/stripe/catalog";

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
  offers: Record<OfferKey, { name: string; detail: string; note?: string }>;
  bothCourses: string;
  earlyBadge: string;
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
      description: "Formaliza tu matrícula en el programa de ActiveXRemote. Pago seguro con Stripe.",
    },
    eyebrow: "Matrícula",
    title: "Reserva tu plaza.",
    lead: "Grupos de 25 plazas. Al confirmarse el pago recibes en tu email el acceso al campus virtual.",

    courseLabel: "¿Qué camino haces?",
    courseHint: "Los 7 módulos de núcleo común entran en los dos.",
    courses: [
      { key: "remote-professional", name: "Remote Professional", sub: "Career Accelerator" },
      { key: "remote-founder", name: "Remote Founder", sub: "Global Builder" },
    ],

    offerLabel: "¿Cómo prefieres pagarlo?",
    offers: {
      "curso-unico": { name: "Pago único", detail: "Un curso, un solo cargo." },
      "curso-anticipada": {
        name: "Matrícula anticipada",
        detail: "Un curso, un solo cargo.",
        note: "Precio reducido hasta el 31 de octubre.",
      },
      "curso-plazos": {
        name: "3 plazos sin intereses",
        detail: "Un curso. Tres cargos mensuales de 800 €.",
        note: "El primer cargo es hoy; los otros dos, el mismo día de los dos meses siguientes. Se detiene solo al tercero.",
      },
      "pack-dos": { name: "Los dos caminos", detail: "Los 14 módulos completos de ambos cursos." },
    },
    bothCourses: "Remote Professional + Remote Founder",
    earlyBadge: "Precio anticipado",
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
      missing_course: "Elige un camino.",
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
    thanks: {
      title: "Matrícula confirmada.",
      body: "Ya tienes plaza en la convocatoria.",
      inbox:
        "Te hemos enviado un email con el acceso al campus virtual. Si no lo ves en unos minutos, mira en spam.",
      instalmentsNote:
        "Los otros dos plazos se cargarán automáticamente en la misma tarjeta, el mismo día de los dos meses siguientes.",
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
      description: "Complete your enrolment in the ActiveXRemote program. Secure payment with Stripe.",
    },
    eyebrow: "Enrolment",
    title: "Reserve your seat.",
    lead: "Groups of 25 seats. Once the payment clears you get campus access in your inbox.",

    courseLabel: "Which path are you taking?",
    courseHint: "The 7 core modules are included in both.",
    courses: [
      { key: "remote-professional", name: "Remote Professional", sub: "Career Accelerator" },
      { key: "remote-founder", name: "Remote Founder", sub: "Global Builder" },
    ],

    offerLabel: "How would you like to pay?",
    offers: {
      "curso-unico": { name: "One payment", detail: "One course, a single charge." },
      "curso-anticipada": {
        name: "Early enrolment",
        detail: "One course, a single charge.",
        note: "Reduced price until October 31.",
      },
      "curso-plazos": {
        name: "3 interest-free instalments",
        detail: "One course. Three monthly charges of €800.",
        note: "The first charge is today; the other two on the same day of the following two months. It stops on its own after the third.",
      },
      "pack-dos": { name: "Both paths", detail: "All 14 modules of both courses." },
    },
    bothCourses: "Remote Professional + Remote Founder",
    earlyBadge: "Early price",
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
      missing_course: "Pick a path.",
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
    thanks: {
      title: "Enrolment confirmed.",
      body: "Your seat in the cohort is booked.",
      inbox:
        "We've emailed you access to the virtual campus. If you don't see it in a few minutes, check your spam folder.",
      instalmentsNote:
        "The other two instalments will be charged automatically to the same card, on the same day of the following two months.",
      campus: "Enter the campus",
      home: "Back to the homepage",
      pendingTitle: "We're confirming the payment.",
      pendingBody:
        "Your bank hasn't cleared it yet. As soon as it does you'll get the access email; there's nothing you need to do.",
    },
  },
};
