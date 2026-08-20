import type { Article } from "@/app/blog/types";

export const article: Article = {
  slug: "no-code-automation-for-solopreneurs",
  locale: "en",
  cluster: "herramientas",
  funnel: "mofu",
  intent: "informacional",
  keyword: "no code automation for business",
  secondary: [
    "make vs zapier vs n8n",
    "automations for freelancers",
    "what to automate in a small business",
    "automate client onboarding",
    "ai agents for small business",
  ],
  title: "No-Code Automation: What to Automate, and in Which Order",
  h1: "No-Code Automation: What to Automate, and in Which Order",
  metaTitle: "No-Code Automation for Small Businesses: Where to Start",
  metaDescription:
    "Why automating an undefined process makes things worse, which tasks pay back first, how to choose between the main platforms, and where AI agents genuinely fit.",
  ogTitle: "No-Code Automation: What to Automate First",
  ogDescription:
    "Document, stabilise, then automate. The order matters more than the tool.",
  published: "2026-08-11",
  updated: "2026-08-11",
  readingMinutes: 11,
  author: "ActiveXRemote Team",
  course: "remote-founder",
  terms: ["automatizacion-no-code", "sop", "agente-ia", "solopreneur", "stack-remoto"],
  related: ["productised-service-business", "remote-work-stack", "writing-sops-to-delegate", "b2b-clients-without-network"],
  external: [
    { label: "European Commission · Digitalisation support for SMEs", url: "https://single-market-economy.ec.europa.eu" },
    { label: "European Data Protection Board · Automated processing guidance", url: "https://www.edpb.europa.eu" },
  ],
  intro: [
    "Automation gets sold as a way to do more. In a one-person business it is more useful as a way to stop doing things: the repetitive steps requiring no judgement that fill a week without producing anything a client would pay for.",
    "The mistake is starting with the tool. Automating a process you have not defined only means making the same errors faster and at greater volume, which is a genuinely worse outcome than doing it by hand.",
  ],
  sections: [
    {
      id: "order",
      h2: "The order that works: document, stabilise, automate",
      answer:
        "Write down the process while doing it, run it manually until it stops changing, and only then automate the steps requiring no judgement. Skipping straight to automation encodes whatever was wrong with the process into a system that now repeats it reliably.",
      blocks: [
        {
          t: "steps",
          items: [
            { title: "Document while executing", text: "Write each step during the next real run, not afterwards from memory. Memory smooths over the exceptions, and the exceptions are what break automations." },
            { title: "Run it manually until stable", text: "If the steps changed on the last three runs, the process is not ready. Automating a moving target guarantees rework." },
            { title: "Mark which steps need judgement", text: "Those stay human. Everything else is a candidate." },
            { title: "Automate one step at a time", text: "Whole-process automations fail opaquely. Single steps fail visibly, which is what you want while learning." },
          ],
        },
        {
          t: "note",
          text: "A useful test: if you cannot hand the written process to someone else and have them produce the same result, it is not ready to hand to a machine either.",
        },
      ],
      takeaway:
        "Automation encodes the process you have, not the one you meant to have.",
    },
    {
      id: "what-first",
      h2: "What pays back first",
      answer:
        "The boring middle: moving information between tools, creating records, sending predictable messages and collecting things people forget to send. These are low-risk, high-frequency and require no judgement, which is exactly the profile that automates well.",
      blocks: [
        {
          t: "table",
          head: ["Task", "Why it pays back", "Risk if it fails"],
          rows: [
            ["Intake form to record creation", "Happens on every enquiry, zero judgement", "Low: visible immediately"],
            ["Client onboarding sequence", "Same steps every time, easy to forget one", "Low: recoverable"],
            ["Invoice reminders", "Recurring, and chasing is uncomfortable to do manually", "Low, but check the tone"],
            ["Document collection", "Clients forget, and following up costs you time", "Low"],
            ["Proposal follow-up", "Frequently forgotten, directly affects revenue", "Medium: personalisation matters"],
            ["Anything client-facing and unreviewed", "—", "High: do not automate the last mile blindly"],
          ],
        },
        {
          t: "p",
          text: "Notice what is absent: nothing requiring a judgement call about a specific client. Those steps look automatable and are where automated systems produce the messages that damage relationships.",
        },
      ],
      takeaway:
        "Automate the plumbing, keep the judgement. The plumbing is most of the week anyway.",
    },
    {
      id: "choosing",
      h2: "Choosing between the main platforms",
      answer:
        "The practical differences are pricing model, how much logic you can express, and whether you can host it yourself. For most one-person businesses any of the main options works, so the deciding factor is usually which one connects to the tools you already use.",
      blocks: [
        {
          t: "table",
          head: ["", "Best suited to", "Trade-off"],
          rows: [
            ["Zapier", "Simple linear flows, widest app coverage", "Cost rises quickly with volume"],
            ["Make", "Visual multi-step flows with branching", "Steeper initial learning curve"],
            ["n8n", "Complex logic, self-hosting, data control", "You maintain it, including updates"],
          ],
        },
        {
          t: "p",
          text: "If you handle client personal data, self-hosting becomes a genuine consideration rather than a preference: it changes where the data sits and what you have to declare in your processor arrangements.",
        },
      ],
      takeaway:
        "Pick by integrations and pricing model. All three do the basics adequately.",
    },
    {
      id: "ai-agents",
      h2: "Where AI agents genuinely fit",
      answer:
        "In the steps that need interpretation but not final judgement: classifying incoming requests, drafting responses for review, extracting data from unstructured documents, and summarising. What they should not do is take irreversible action without a human checkpoint.",
      blocks: [
        {
          t: "ul",
          items: [
            "Triage: classify incoming enquiries by type and urgency, then route them.",
            "Draft: prepare a first version of a recurring reply for you to review and send.",
            "Extract: pull structured data out of documents that arrive in inconsistent formats.",
            "Summarise: condense long threads or calls into the decision and the next step.",
          ],
        },
        {
          t: "note",
          text: "Give every agent explicit limits on what it may touch and a review point before anything irreversible: sending to a client, moving money, deleting data. The failure mode is not a bad draft, it is a confident action taken on a misread input.",
        },
      ],
      takeaway:
        "Interpretation yes, irreversible action no. The checkpoint is the whole design.",
    },
    {
      id: "mistakes",
      h2: "The mistakes that cost most",
      answer:
        "Four recur. Automating an unstable process. Building flows nobody documented, so they cannot be fixed later. Chaining so many steps together that failures become invisible. And automating the client-facing last mile, where the personalisation is the entire value being sold.",
      blocks: [
        {
          t: "pros",
          pros: [
            "One automation per step, each independently testable.",
            "Failure notifications that reach you, not a log nobody reads.",
            "A written note of what each flow does and why.",
            "A manual fallback for anything a client depends on.",
          ],
          cons: [
            "A twenty-step flow that fails silently in the middle.",
            "Automations built by past-you with no documentation.",
            "Automated client messages that never get reviewed.",
            "Automating before the third manual run.",
          ],
        },
        {
          t: "quote",
          text: "An automation you cannot debug is a liability that used to be a task.",
        },
      ],
      takeaway:
        "Small, documented, and loud when they fail. Silent automations are the dangerous ones.",
    },
  ],
  faqs: [
    { q: "What should I automate first in a small business?", a: "The repetitive plumbing: moving information between tools, creating records from intake forms, onboarding sequences, invoice reminders and document collection. High frequency, no judgement, low risk if it fails." },
    { q: "Should I automate before or after documenting the process?", a: "After. Automating an undefined process encodes whatever is wrong with it and repeats it reliably, which is worse than doing it manually." },
    { q: "Which is better, Zapier, Make or n8n?", a: "For most one-person businesses any works. Zapier has the widest app coverage and rising costs at volume, Make handles branching well with a steeper curve, and n8n allows self-hosting if data control matters." },
    { q: "When is a process ready to automate?", a: "When the steps have not changed across the last three runs and you could hand the written version to someone else and get the same result." },
    { q: "What should AI agents do in a small business?", a: "Interpretation without final authority: triaging enquiries, drafting replies for review, extracting data from inconsistent documents, and summarising. Not irreversible actions without a human checkpoint." },
    { q: "Is it worth automating client communication?", a: "Partially. Reminders and document requests, yes. Anything where personalisation is the value should be drafted automatically and sent manually after review." },
    { q: "How do I stop automations failing silently?", a: "Configure failure notifications that reach you directly rather than a log, and keep flows short enough that a failure points clearly at one step." },
    { q: "Do I need to document my automations?", a: "Yes, briefly: what each one does and why it exists. Automations built without notes become undebuggable within months, and then you cannot safely change anything they touch." },
    { q: "Are there data protection implications?", a: "Yes, if the flows handle personal data. Where the data is processed and who has access are matters you may need to declare, which is one reason self-hosting is sometimes worth the maintenance." },
    { q: "How much time does this actually save?", a: "It depends entirely on frequency. A step taking five minutes ten times a week returns real hours; the same step done monthly rarely repays the build and maintenance cost." },
  ],
  hero: { file: "/blog/automatismo.svg", alt: "Diagram: a trigger chaining one task, which in turn branches into two more." },
};
