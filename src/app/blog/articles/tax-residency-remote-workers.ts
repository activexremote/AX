import type { Article } from "@/app/blog/types";

export const article: Article = {
  slug: "tax-residency-remote-workers",
  locale: "en",
  cluster: "fiscalidad",
  funnel: "mofu",
  intent: "informacional",
  keyword: "tax residency for remote workers",
  secondary: [
    "183 day rule explained",
    "where do i pay tax if i work remotely",
    "digital nomad tax residency",
    "tax residency certificate",
    "double taxation treaty tie breaker",
  ],
  title: "Tax Residency for Remote Workers: The 183-Day Rule Is a Trap",
  h1: "Tax Residency for Remote Workers: The 183-Day Rule Is a Trap",
  metaTitle: "Tax Residency for Remote Workers: Beyond the 183-Day Rule",
  metaDescription:
    "Why counting days is not enough, how the centre of economic interests test works, what happens when two countries both claim you, and what to document from day one.",
  ogTitle: "Tax Residency for Remote Workers",
  ogDescription:
    "The rule everyone quotes, the one that actually decides, and the treaty tie-breakers that resolve a dual claim.",
  published: "2026-06-02",
  updated: "2026-08-18",
  readingMinutes: 12,
  author: "ActiveXRemote Team",
  terms: ["residencia-fiscal", "regla-183-dias", "doble-imposicion", "nomada-digital", "establecimiento-permanente"],
  related: ["digital-nomad-visa-comparison", "employer-of-record-vs-contractor", "what-is-activexremote", "getting-paid-internationally"],
  external: [
    { label: "OECD · Model Tax Convention on Income and Capital", url: "https://www.oecd.org/tax/treaties/" },
    { label: "European Commission · Taxes when moving within the EU", url: "https://europa.eu/youreurope/citizens/work/taxes/index_en.htm" },
    { label: "OECD · Automatic Exchange of Information", url: "https://www.oecd.org/tax/automatic-exchange/" },
  ],
  intro: [
    "«Stay under 183 days and you are fine» is the single most repeated claim in remote work forums, and the one that generates the most expensive surprises. It is not wrong so much as incomplete, and the missing half is the part that costs money.",
    "This guide covers how tax residency is actually determined, why you can remain resident somewhere you barely visited, and what happens when two tax authorities reach the same conclusion about you in the same year.",
  ],
  sections: [
    {
      id: "what-it-means",
      h2: "What tax residency means",
      answer:
        "Being tax resident in a country means that country can tax your worldwide income, wherever it arises. It is not something you elect by declaring it, and it rarely follows your nationality. Each jurisdiction determines it through objective tests that are assessed after the fact.",
      blocks: [
        {
          t: "p",
          text: "Three things get conflated constantly. Nationality, which almost never decides where you pay. Registered address, which is administrative. And tax residency, which is what determines who taxes your income. All three can point to different countries at once.",
        },
        {
          t: "note",
          text: "The United States is the notable exception: it taxes citizens on worldwide income regardless of residence. Almost every other country uses residence-based taxation.",
        },
      ],
      takeaway:
        "You do not choose tax residency. It is established, and the authority does the establishing.",
    },
    {
      id: "183-days",
      h2: "The 183-day rule and its small print",
      answer:
        "Spending more than 183 days in a country during a tax year usually makes you resident there. It is the best-known test but neither the only one nor always decisive, and how days are counted varies enough between jurisdictions to catch people out.",
      blocks: [
        {
          t: "ul",
          items: [
            "Many countries count any day of physical presence, including partial arrival and departure days.",
            "Some treat short absences as continued presence unless you can prove residency elsewhere.",
            "The reference period is not always the calendar year: several jurisdictions use their own fiscal year.",
            "Exceeding the threshold in two countries at once is entirely possible when each counts differently.",
          ],
        },
        {
          t: "p",
          text: "The expensive mistake is treating 183 days as a safe boundary and organising the year around that number. It works only if no other test is met, and there is usually another test.",
        },
      ],
      takeaway:
        "183 days is a threshold, not a shield. Clearing it does not settle the question.",
    },
    {
      id: "centre-of-interests",
      h2: "The test nobody mentions: centre of interests",
      answer:
        "Many countries treat you as resident when the core of your economic or personal interests sits in their territory, regardless of how many days you spent there. A permanent home available to you, family in the country, or the bulk of your income arising there can each be enough.",
      blocks: [
        {
          t: "table",
          head: ["Indicator", "Weight"],
          rows: [
            ["Permanent home available to you", "High: an apartment kept at your disposal counts even when unused."],
            ["Spouse or dependent children resident", "High: in several countries this creates a presumption."],
            ["Where most of your income arises", "High: clients or an employer based there pulls strongly."],
            ["Bank accounts and investments", "Medium: contextual, meaningful in combination."],
            ["Registration and health cover", "Low alone, relevant alongside the rest."],
          ],
        },
        {
          t: "p",
          text: "This is why leaving a country is not the same as ceasing to be its tax resident. What actually severs the link is establishing residency somewhere else and being able to evidence it.",
        },
      ],
      takeaway:
        "You can leave a country and remain its tax resident. Exit requires an entry somewhere else.",
    },
    {
      id: "dual-claim",
      h2: "When two countries both claim you",
      answer:
        "It happens more than people expect and does not mean paying twice on the same income. Double tax treaties contain tie-breaker rules applied in strict order: permanent home, centre of vital interests, habitual abode and, failing all else, nationality.",
      blocks: [
        {
          t: "steps",
          items: [
            { title: "Permanent home", text: "Which country has a home permanently available to you. If only one does, the test ends there." },
            { title: "Centre of vital interests", text: "If both do, compare where your personal and economic ties are closest." },
            { title: "Habitual abode", text: "If that is inconclusive, where you actually live most, looked at over several years rather than one." },
            { title: "Nationality", text: "Only if all three tie. If you hold both nationalities, the two authorities resolve it by mutual agreement." },
          ],
        },
        {
          t: "p",
          text: "The practical instrument here is a tax residency certificate: the country that considers you resident issues it, and the other applies the treaty instead of taxing you as a non-resident by default.",
        },
      ],
      takeaway:
        "Dual claims are resolved by written rules, but you have to invoke and evidence them.",
    },
    {
      id: "practical",
      h2: "What to actually do if you move",
      answer:
        "Document from day one and decide before moving rather than after. Almost no remote worker gets into tax trouble through a bad decision. They get into it by making no decision and discovering two years later that one was required.",
      blocks: [
        {
          t: "ol",
          items: [
            "Keep a day log per country with boarding passes and stamps. Reconstructing it later is expensive and weak as evidence.",
            "Decide which country you intend to be resident in and align the facts: home, invoicing, insurance, family.",
            "When leaving a country, establish residency in another. Leaving without a destination is what keeps the old claim alive.",
            "Request a tax residency certificate each year from wherever you are resident.",
            "Check how any digital nomad visa interacts with your current residency before applying. It is an immigration permit, not a tax regime.",
          ],
        },
        {
          t: "note",
          text: "This explains the framework so you know what to ask. The specific answer depends on the treaty in play and your own history, and that part belongs to a qualified adviser in both jurisdictions.",
        },
      ],
      takeaway:
        "Build the evidence while it is happening. Nobody can reconstruct a year of movements convincingly afterwards.",
    },
  ],
  faqs: [
    { q: "Do I stop being tax resident if I spend under 183 days in a country?", a: "Not automatically. Most countries also apply a centre-of-interests test, and some presume residency when your spouse and dependent children live there. Breaking the day count alone is rarely enough." },
    { q: "How are the 183 days counted exactly?", a: "It varies. Many jurisdictions count any day of physical presence including partial arrival and departure days, and some add short absences back in when you cannot prove residency elsewhere." },
    { q: "Does a digital nomad visa change my tax residency?", a: "Not by itself. It is an immigration permit. Some countries pair it with a favourable tax regime, but those are separate decisions and need to be checked separately." },
    { q: "What is a tax residency certificate for?", a: "It is the document by which a tax authority states it considers you resident. Other countries use it to apply the double tax treaty instead of taxing you as a non-resident." },
    { q: "Can I be tax resident nowhere?", a: "In practice it is very hard to sustain and usually ends badly. Without residency somewhere you cannot invoke any treaty, and the country you left tends to keep claiming you." },
    { q: "Do I pay tax where my employer is or where I live?", a: "Generally where you live, because employment income is taxed where the work is physically performed. That is why a foreign employer does not withhold your local income tax." },
    { q: "What if I work from three countries in one year?", a: "Each applies its own residency tests and more than one may claim you. It is resolved through treaties and through your day log, which is the evidence you will be asked for." },
    { q: "Does owning property make me tax resident?", a: "Not on its own, but it weighs heavily. A permanent home available to you is the first treaty tie-breaker and a strong indicator of your centre of interests." },
    { q: "Can tax authorities find out where I have been?", a: "Yes. Financial account information is exchanged automatically between many jurisdictions, and flights, accounts and contributions all leave records. Your own documentation exists to explain, not to conceal." },
    { q: "When should I speak to a tax adviser?", a: "Before moving, not after. The decisions that can still be optimised are the ones you have not yet taken; once a tax year has closed, the room to manoeuvre is minimal." },
  ],
  hero: { file: "/blog/umbral-dias.svg", alt: "Diagram: a grid of days in the year with a threshold line separating those that count from those that don't." },
};
