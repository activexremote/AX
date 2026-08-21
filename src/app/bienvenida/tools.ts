import type { Locale } from "@/lib/i18n/config";

// ══════════════════════════════════════════════════════════
//  El stack: todas las herramientas que se ven en el programa,
//  clasificadas por función.
//
//  `icon` es el slug de simple-icons (ver src/components/landing/tool-icons.ts).
//  `logo` es un SVG propio de public/logos, cuando lo tenemos.
//  Sin ninguno de los dos, la ficha se pinta con el monograma de la marca:
//  Microsoft, OpenAI, Slack, Adobe, Canva, LinkedIn y Salesforce, entre otras,
//  pidieron que se retirasen sus iconos de las colecciones libres, así que no
//  hay una fuente que podamos redistribuir. El `hex` de esas es aproximado.
// ══════════════════════════════════════════════════════════

export type Tool = {
  id: string;
  name: string;
  /** slug de simple-icons */
  icon?: string;
  /** ruta bajo /logos, o "slack" para el componente en línea */
  logo?: string;
};

export const TOOLS: readonly Tool[] = [
  // — IA —
  { id: "chatgpt", name: "ChatGPT", logo: "tools/chatgpt.svg" },
  { id: "claude", name: "Claude", icon: "claude" },
  { id: "gemini", name: "Gemini", icon: "googlegemini" },
  { id: "perplexity", name: "Perplexity", icon: "perplexity" },
  { id: "copilot", name: "Microsoft Copilot", logo: "tools/copilot.svg" },
  { id: "cursor", name: "Cursor", icon: "cursor" },
  { id: "lovable", name: "Lovable", logo: "tools/lovable.svg" },
  { id: "replit", name: "Replit", icon: "replit" },
  { id: "bolt", name: "Bolt", logo: "tools/bolt.svg" },
  { id: "make", name: "Make", icon: "make" },
  { id: "n8n", name: "n8n", icon: "n8n" },

  // — Comunicación —
  { id: "slack", name: "Slack", logo: "slack" },
  { id: "teams", name: "Microsoft Teams", logo: "tools/teams.svg" },
  { id: "zoom", name: "Zoom", icon: "zoom" },
  { id: "meet", name: "Google Meet", icon: "googlemeet" },
  { id: "loom", name: "Loom", icon: "loom" },

  // — Proyectos —
  { id: "notion", name: "Notion", icon: "notion" },
  { id: "asana", name: "Asana", icon: "asana" },
  { id: "clickup", name: "ClickUp", icon: "clickup" },
  { id: "linear", name: "Linear", icon: "linear" },
  { id: "trello", name: "Trello", icon: "trello" },
  { id: "jira", name: "Jira", icon: "jira" },

  // — Documentación —
  { id: "workspace", name: "Google Workspace", icon: "google" },
  { id: "m365", name: "Microsoft 365", logo: "tools/m365.svg" },
  { id: "confluence", name: "Confluence", icon: "confluence" },

  // — Automatización —
  { id: "zapier", name: "Zapier", icon: "zapier" },
  { id: "airtable", name: "Airtable", icon: "airtable" },

  // — Reuniones —
  { id: "granola", name: "Granola", logo: "tools/granola.svg" },

  // — Tiempo —
  { id: "toggl", name: "Toggl Track", icon: "toggltrack" },
  { id: "clockify", name: "Clockify", icon: "clockify" },

  // — Ficheros —
  { id: "gdrive", name: "Google Drive", icon: "googledrive" },
  { id: "dropbox", name: "Dropbox", icon: "dropbox" },
  { id: "onedrive", name: "OneDrive", logo: "tools/onedrive.svg" },
  { id: "box", name: "Box", icon: "box" },

  // — Diseño —
  { id: "figma", name: "Figma", icon: "figma" },
  { id: "canva", name: "Canva", logo: "tools/canva.svg" },
  { id: "adobe", name: "Adobe Creative Cloud", logo: "tools/adobe.svg" },
  { id: "framer", name: "Framer", icon: "framer" },

  // — Desarrollo —
  { id: "github", name: "GitHub", icon: "github" },
  { id: "gitlab", name: "GitLab", icon: "gitlab" },
  { id: "vscode", name: "VS Code", logo: "tools/vscode.svg" },
  { id: "vercel", name: "Vercel", icon: "vercel" },
  { id: "supabase", name: "Supabase", icon: "supabase" },

  // — Ventas —
  { id: "hubspot", name: "HubSpot", icon: "hubspot" },
  { id: "salesforce", name: "Salesforce", logo: "tools/salesforce.svg" },
  { id: "apollo", name: "Apollo", logo: "tools/apollo.svg" },

  // — Empleo —
  { id: "linkedin", name: "LinkedIn", logo: "tools/linkedin.svg" },
  { id: "deel", name: "Deel", logo: "deel.svg" },
  { id: "upwork", name: "Upwork", icon: "upwork" },
  { id: "fiverr", name: "Fiverr", icon: "fiverr" },

  // — Finanzas —
  { id: "stripe", name: "Stripe", icon: "stripe" },
  { id: "wise", name: "Wise", icon: "wise" },
  { id: "paypal", name: "PayPal", icon: "paypal" },
  { id: "revolut", name: "Revolut", icon: "revolut" },
  { id: "xero", name: "Xero", icon: "xero" },

  // — Seguridad —
  { id: "1password", name: "1Password", icon: "1password" },
  { id: "bitwarden", name: "Bitwarden", icon: "bitwarden" },
  { id: "nordvpn", name: "NordVPN", icon: "nordvpn" },
  { id: "cloudflare", name: "Cloudflare", icon: "cloudflare" },

  // — Investigación —
  { id: "google", name: "Google", icon: "google" },
  { id: "notebooklm", name: "NotebookLM", icon: "notebooklm" },
  { id: "feedly", name: "Feedly", icon: "feedly" },

  // — Marketing —
  { id: "googleads", name: "Google Ads", icon: "googleads" },
  { id: "metaads", name: "Meta Ads Manager", icon: "meta" },
  { id: "ga4", name: "Google Analytics", icon: "googleanalytics" },
  { id: "gsc", name: "Search Console", icon: "googlesearchconsole" },
  { id: "semrush", name: "Semrush", icon: "semrush" },
  { id: "ahrefs", name: "Ahrefs", logo: "tools/ahrefs.svg" },

  // — Soporte —
  { id: "intercom", name: "Intercom", icon: "intercom" },
  { id: "zendesk", name: "Zendesk", icon: "zendesk" },
  { id: "helpscout", name: "Help Scout", icon: "helpscout" },

  // — Agenda —
  { id: "calendly", name: "Calendly", icon: "calendly" },
  { id: "gcal", name: "Google Calendar", icon: "googlecalendar" },
  { id: "calcom", name: "Cal.com", icon: "caldotcom" },

  // — Cultura —
  { id: "miro", name: "Miro", icon: "miro" },
];

export type CategoryKey =
  | "ai" | "comms" | "pm" | "docs" | "automation" | "meetings"
  | "files" | "design" | "dev" | "sales" | "hiring" | "finance" | "security"
  | "research" | "marketing" | "support" | "scheduling";

// Una herramienta puede vivir en varias categorías (Notion en proyectos y en
// documentación, Loom en comunicación y en reuniones…). Es intencionado.
export const CATEGORIES: readonly { key: CategoryKey; tools: readonly string[] }[] = [
  { key: "ai", tools: ["chatgpt", "claude", "gemini", "perplexity", "copilot", "cursor", "lovable", "replit", "bolt", "make", "n8n"] },
  { key: "comms", tools: ["slack", "teams", "zoom", "meet", "loom"] },
  { key: "pm", tools: ["notion", "asana", "clickup", "linear", "trello", "jira", "toggl", "clockify"] },
  { key: "docs", tools: ["notion", "workspace", "m365", "confluence"] },
  { key: "automation", tools: ["make", "zapier", "n8n", "airtable"] },
  { key: "meetings", tools: ["loom", "zoom", "meet", "granola", "miro"] },
  { key: "files", tools: ["gdrive", "dropbox", "onedrive", "box"] },
  { key: "design", tools: ["figma", "canva", "adobe", "framer"] },
  { key: "dev", tools: ["github", "gitlab", "cursor", "vscode", "vercel", "supabase"] },
  { key: "sales", tools: ["hubspot", "salesforce", "apollo"] },
  { key: "hiring", tools: ["linkedin", "deel", "upwork", "fiverr"] },
  { key: "finance", tools: ["stripe", "wise", "paypal", "revolut", "xero"] },
  { key: "security", tools: ["1password", "bitwarden", "nordvpn", "cloudflare"] },
  { key: "research", tools: ["perplexity", "google", "notebooklm", "feedly"] },
  { key: "marketing", tools: ["googleads", "metaads", "ga4", "gsc", "semrush", "ahrefs"] },
  { key: "support", tools: ["intercom", "zendesk", "helpscout"] },
  { key: "scheduling", tools: ["calendly", "gcal", "calcom"] },
];

// Las páginas de curso muestran sólo las categorías que les tocan: el camino
// de empleo no necesita CRM ni pasarelas de pago, y el de negocio no vive de
// la búsqueda de ofertas.
export const COURSE_CATEGORIES: Record<string, readonly CategoryKey[]> = {
  "remote-professional": [
    "ai", "comms", "pm", "docs", "meetings", "files",
    "research", "scheduling", "hiring", "security",
  ],
  "remote-founder": [
    "ai", "automation", "sales", "marketing", "finance", "design",
    "dev", "support", "scheduling", "security", "comms",
  ],
};

export const toolsCopy: Record<Locale, {
  eyebrow: string;
  title: string;
  lead: string;
  all: string;
  hint: string;
  /** Abre la rejilla completa dentro de la banda del stack. */
  seeAll: string;
  categories: Record<CategoryKey, string>;
  desc: Record<string, string>;
}> = {
  es: {
    eyebrow: "El stack",
    title: "Las herramientas que vas a dominar.",
    lead: "75 herramientas reales, agrupadas por función. Señala cualquiera para ver para qué sirve.",
    all: "Todas",
    hint: "Pasa por encima de un logo —o tócalo— para ver para qué sirve",
    seeAll: "Ver las 75 herramientas, agrupadas por función",
    categories: {
      ai: "IA y agentes",
      comms: "Comunicación",
      pm: "Proyectos y tiempo",
      docs: "Documentación",
      automation: "Automatización",
      meetings: "Reuniones y asíncrono",
      files: "Archivos",
      design: "Diseño",
      dev: "Desarrollo",
      sales: "Ventas y CRM",
      hiring: "Empleo remoto",
      finance: "Finanzas y cobros",
      security: "Seguridad",
      research: "Investigación",
      marketing: "Marketing",
      support: "Soporte",
      scheduling: "Agenda",
    },
    desc: {
      chatgpt: "Redacta, resume y analiza: el asistente de propósito general.",
      claude: "Textos largos y análisis de documentos con mucho contexto.",
      gemini: "La IA de Google, metida dentro de Gmail, Docs y Drive.",
      perplexity: "Busca en la web y responde citando de dónde lo saca.",
      copilot: "La IA de Microsoft dentro de Word, Excel y Teams.",
      cursor: "Editor de código con IA: escribe y refactoriza contigo.",
      lovable: "Convierte una idea en una app web funcionando, sin código.",
      replit: "Programa y publica desde el navegador, sin instalar nada.",
      bolt: "Prototipos web completos a partir de una sola instrucción.",
      make: "Conecta aplicaciones con flujos visuales, con IA o sin ella.",
      n8n: "Automatiza procesos con IA y alójalos donde tú quieras.",
      slack: "El cuartel general del equipo: canales, hilos y avisos automáticos.",
      teams: "Chat, reuniones y ficheros dentro del ecosistema Microsoft.",
      zoom: "Videollamadas fiables, con grabación y transcripción.",
      meet: "Videollamadas desde el propio calendario, sin instalar nada.",
      loom: "Graba tu pantalla y explica en tres minutos lo que serían tres correos.",
      notion: "Wiki, notas y bases de datos en un mismo sitio.",
      asana: "Reparte tareas y plazos con un responsable claro.",
      clickup: "Tareas, documentos y objetivos en una sola herramienta.",
      linear: "Seguimiento de producto rápido y sin fricción para equipos técnicos.",
      trello: "Tableros visuales: lo más simple para empezar a ordenarte.",
      jira: "El estándar corporativo para seguir desarrollo e incidencias.",
      workspace: "Docs, Sheets y Gmail: la base documental del trabajo remoto.",
      m365: "Word, Excel y SharePoint para entornos corporativos.",
      confluence: "Documentación de equipo conectada con Jira.",
      zapier: "Automatiza tareas repetitivas entre miles de aplicaciones.",
      airtable: "Una base de datos con cara de hoja de cálculo.",
      granola: "Toma las notas de tus reuniones y te las deja ordenadas.",
      toggl: "Mide en qué se te va el tiempo y conviértelo en factura.",
      clockify: "Control horario gratuito para equipos y autónomos.",
      gdrive: "Archivos compartidos y accesibles desde cualquier sitio.",
      dropbox: "Sincronización de ficheros pesados entre equipos.",
      onedrive: "Almacenamiento integrado en Windows y Microsoft 365.",
      box: "Almacenamiento con control de permisos de nivel empresa.",
      figma: "Diseña interfaces y colabora sobre el mismo lienzo.",
      canva: "Piezas gráficas presentables sin ser diseñador.",
      adobe: "Photoshop, Illustrator y Premiere para el trabajo fino.",
      framer: "Publica una web profesional diseñando, no programando.",
      github: "Guarda tu código, versiónalo y colabora con cualquiera.",
      gitlab: "Repositorios y despliegue continuo en una sola plataforma.",
      vscode: "El editor de código estándar, extensible hasta el infinito.",
      vercel: "Pon tu web en producción en un par de minutos.",
      supabase: "Base de datos, autenticación y API sin montar servidores.",
      hubspot: "CRM gratuito para empezar a ordenar clientes y oportunidades.",
      salesforce: "El CRM de referencia en empresas grandes.",
      apollo: "Encuentra contactos B2B y lanza secuencias de correo.",
      linkedin: "Donde te encuentran los recruiters internacionales.",
      deel: "Contratos y nóminas en regla trabajando desde otro país.",
      upwork: "Mercado global de proyectos por horas o por entrega.",
      fiverr: "Vende servicios empaquetados a precio cerrado.",
      stripe: "Cobra con tarjeta a clientes de todo el mundo.",
      wise: "Cobra y paga en varias divisas sin comisiones abusivas.",
      paypal: "El método de cobro que casi todo cliente ya tiene.",
      revolut: "Cuentas multidivisa y tarjetas para gasto internacional.",
      xero: "Contabilidad en la nube para llevar tus números al día.",
      "1password": "Guarda y comparte contraseñas sin mandarlas por chat.",
      bitwarden: "Gestor de contraseñas abierto y gratuito.",
      nordvpn: "Conexión cifrada cuando trabajas desde redes públicas.",
      cloudflare: "Protege y acelera tu web y tus dominios.",
      google: "El punto de partida: saber buscar sigue siendo una ventaja.",
      notebooklm: "Sube tus documentos y pregúntales como a un experto.",
      feedly: "Sigue a tu sector sin vivir dentro de las redes sociales.",
      googleads: "Compra tráfico de quien ya busca justo lo que ofreces.",
      metaads: "Campañas en Instagram y Facebook segmentadas por audiencia.",
      ga4: "Mide qué hacen de verdad las visitas de tu web.",
      gsc: "Descubre por qué te encuentran en Google y con qué palabras.",
      semrush: "Analiza competencia, palabras clave y contenido.",
      ahrefs: "Investiga enlaces y posicionamiento de cualquier web.",
      intercom: "Chat de soporte con respuestas automáticas por IA.",
      zendesk: "Tickets y centro de ayuda para un soporte estructurado.",
      helpscout: "Soporte por correo con tono humano, sin sensación de ticket.",
      calendly: "Que reserven contigo sin cruzar diez correos.",
      gcal: "Tu agenda y la del equipo, con husos horarios distintos.",
      calcom: "Alternativa abierta a Calendly, personalizable de arriba abajo.",
      miro: "Pizarra infinita para pensar juntos estando lejos.",
    },
  },
  en: {
    eyebrow: "The stack",
    title: "The tools you'll master.",
    lead: "75 real tools, grouped by function. Point at any of them to see what it's for.",
    all: "All",
    seeAll: "See all 75 tools, grouped by function",
    hint: "Hover a logo —or tap it— to see what it's for",
    categories: {
      ai: "AI & agents",
      comms: "Communication",
      pm: "Projects & time",
      docs: "Docs & knowledge",
      automation: "Automation",
      meetings: "Meetings & async",
      files: "Files",
      design: "Design",
      dev: "Development",
      sales: "Sales & CRM",
      hiring: "Remote hiring",
      finance: "Finance & payments",
      security: "Security",
      research: "Research",
      marketing: "Marketing",
      support: "Customer support",
      scheduling: "Scheduling",
    },
    desc: {
      chatgpt: "Drafts, summarises and analyses: the general-purpose assistant.",
      claude: "Long-form writing and document analysis with a wide context.",
      gemini: "Google's AI, built right into Gmail, Docs and Drive.",
      perplexity: "Searches the web and answers with its sources cited.",
      copilot: "Microsoft's AI inside Word, Excel and Teams.",
      cursor: "AI code editor: writes and refactors alongside you.",
      lovable: "Turns an idea into a working web app, no code.",
      replit: "Code and ship from the browser, nothing to install.",
      bolt: "Full web prototypes from a single prompt.",
      make: "Connects apps through visual flows, with or without AI.",
      n8n: "Automates processes with AI, hosted wherever you want.",
      slack: "The team's HQ: channels, threads and automated alerts.",
      teams: "Chat, meetings and files inside the Microsoft ecosystem.",
      zoom: "Reliable video calls, with recording and transcription.",
      meet: "Video calls from the calendar itself, nothing to install.",
      loom: "Record your screen: three minutes instead of three emails.",
      notion: "Wiki, notes and databases in one place.",
      asana: "Assigns tasks and deadlines with a clear owner.",
      clickup: "Tasks, docs and goals in a single tool.",
      linear: "Fast, frictionless product tracking for technical teams.",
      trello: "Visual boards: the simplest way to get organised.",
      jira: "The corporate standard for tracking development and issues.",
      workspace: "Docs, Sheets and Gmail: remote work's document layer.",
      m365: "Word, Excel and SharePoint for corporate environments.",
      confluence: "Team documentation wired into Jira.",
      zapier: "Automates repetitive tasks across thousands of apps.",
      airtable: "A database that looks like a spreadsheet.",
      granola: "Takes your meeting notes and leaves them tidy.",
      toggl: "Measures where your time goes, and turns it into an invoice.",
      clockify: "Free time tracking for teams and freelancers.",
      gdrive: "Shared files, reachable from anywhere.",
      dropbox: "Heavy-file sync between teams.",
      onedrive: "Storage built into Windows and Microsoft 365.",
      box: "Storage with enterprise-grade permission control.",
      figma: "Design interfaces and collaborate on one canvas.",
      canva: "Presentable graphics without being a designer.",
      adobe: "Photoshop, Illustrator and Premiere for the fine work.",
      framer: "Ship a professional site by designing, not coding.",
      github: "Stores your code, versions it, opens it to collaborators.",
      gitlab: "Repositories and continuous delivery on one platform.",
      vscode: "The standard code editor, endlessly extensible.",
      vercel: "Puts your site in production in a couple of minutes.",
      supabase: "Database, auth and API without running servers.",
      hubspot: "Free CRM to start ordering clients and opportunities.",
      salesforce: "The reference CRM in large companies.",
      apollo: "Finds B2B contacts and runs email sequences.",
      linkedin: "Where international recruiters find you.",
      deel: "Compliant contracts and payroll when you work from abroad.",
      upwork: "Global marketplace for hourly or fixed-scope projects.",
      fiverr: "Sell packaged services at a fixed price.",
      stripe: "Charge clients worldwide by card.",
      wise: "Get paid and pay in several currencies without abusive fees.",
      paypal: "The payment method nearly every client already has.",
      revolut: "Multi-currency accounts and cards for international spend.",
      xero: "Cloud accounting to keep your numbers current.",
      "1password": "Store and share passwords without sending them over chat.",
      bitwarden: "Open-source, free password manager.",
      nordvpn: "Encrypted connection when you work from public networks.",
      cloudflare: "Protects and speeds up your site and your domains.",
      google: "The starting point: knowing how to search is still an edge.",
      notebooklm: "Upload your documents and question them like an expert.",
      feedly: "Follow your industry without living inside social media.",
      googleads: "Buy traffic from people already searching for what you offer.",
      metaads: "Instagram and Facebook campaigns segmented by audience.",
      ga4: "Measures what visitors actually do on your site.",
      gsc: "Find out why Google surfaces you, and for which words.",
      semrush: "Analyses competitors, keywords and content.",
      ahrefs: "Research links and rankings for any site.",
      intercom: "Support chat with AI-powered automatic replies.",
      zendesk: "Tickets and help centre for structured support.",
      helpscout: "Email support with a human tone, no ticket feel.",
      calendly: "Let people book you without ten emails back and forth.",
      gcal: "Your calendar and your team's, across different time zones.",
      calcom: "Open-source Calendly alternative, customisable throughout.",
      miro: "Infinite whiteboard for thinking together from afar.",
    },
  },
};
