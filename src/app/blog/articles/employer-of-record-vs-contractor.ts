import type { Article } from "@/app/blog/types";

export const article: Article = {
  slug: "employer-of-record-vs-contractor",
  locale: "en",
  cluster: "legal",
  funnel: "mofu",
  intent: "comercial",
  keyword: "employer of record vs contractor",
  secondary: [
    "what is an employer of record",
    "eor vs peo difference",
    "should i be a contractor or an employee",
    "contractor agreement red flags",
    "global payroll for remote workers",
  ],
  title: "Employer of Record vs Contractor: Which One Should You Sign?",
  h1: "Employer of Record vs Contractor: Which One Should You Sign?",
  metaTitle: "Employer of Record vs Contractor: The Real Differences",
  metaDescription:
    "What an EOR actually does, how it differs from a PEO and from contracting, what each costs you in rights and admin, and the contract clauses worth arguing about before you sign.",
  ogTitle: "Employer of Record vs Contractor",
  ogDescription:
    "Rights, tax, admin and risk compared side by side, plus the clauses that decide how bad a contractor agreement can get.",
  published: "2026-05-19",
  updated: "2026-08-18",
  readingMinutes: 12,
  author: "ActiveXRemote Team",
  course: "remote-professional",
  terms: ["employer-of-record", "contractor-internacional", "falso-autonomo", "nomina-internacional", "establecimiento-permanente"],
  related: ["worker-misclassification-risk", "negotiating-remote-salary", "international-remote-jobs-from-europe", "getting-paid-internationally"],
  external: [
    { label: "European Commission · Employment rights across the EU", url: "https://europa.eu/youreurope/citizens/work/index_en.htm" },
    { label: "ILO · Employment Relationship Recommendation", url: "https://www.ilo.org" },
    { label: "OECD · Permanent establishment guidance", url: "https://www.oecd.org/tax/treaties/" },
  ],
  intro: [
    "The offer is good, the team looks right, and then someone asks whether you would rather go through their Employer of Record or invoice as a contractor. Most people pick based on the headline number, which is the one variable that is not comparable between the two.",
    "This guide sets out what each structure actually gives you, what it takes away, and which clauses decide how exposed you end up.",
  ],
  sections: [
    {
      id: "what-is-eor",
      h2: "What an Employer of Record actually is",
      answer:
        "An Employer of Record is a company that legally employs you in your own country on behalf of a foreign business. It runs payroll, withholds tax, pays social contributions and carries local employment compliance. Your day-to-day work is still directed by the client company, which never becomes your legal employer.",
      blocks: [
        {
          t: "p",
          text: "The structure exists to solve one problem: hiring one person in a country where you have no legal entity. Incorporating a subsidiary for a single engineer is disproportionate, so the EOR rents you its entity and its payroll infrastructure.",
        },
        {
          t: "table",
          head: ["", "EOR", "PEO", "Staffing agency"],
          rows: [
            ["Who employs you", "The EOR, in your country", "You are co-employed with the client", "The agency"],
            ["Client needs a local entity", "No", "Yes", "No"],
            ["Typical duration", "Ongoing", "Ongoing", "Temporary assignment"],
            ["Who directs your work", "The client company", "The client company", "The client company"],
          ],
        },
      ],
      takeaway:
        "An EOR is the client renting a compliant employment relationship. You get a real local contract out of it.",
    },
    {
      id: "comparison",
      h2: "EOR and contractor compared where it matters",
      answer:
        "The differences that change your life are rights, tax admin and termination. Under an EOR you get paid leave, sick pay and statutory severance. As a contractor you get a higher rate, more autonomy and none of the safety net, plus the filing work.",
      blocks: [
        {
          t: "table",
          head: ["", "Employer of Record", "Contractor"],
          rows: [
            ["Paid leave", "Statutory minimum applies", "Unpaid: every day off costs you"],
            ["Sick pay", "Covered by local rules", "Your own problem"],
            ["Severance", "Statutory entitlement", "Whatever notice the contract gives"],
            ["Tax admin", "Withheld for you", "Filings and prepayments are yours"],
            ["Social contributions", "Employer and employee share", "Fully yours"],
            ["Autonomy", "Employee obligations apply", "You choose how and when, in principle"],
            ["Headline rate", "Lower", "Higher, and it has to be"],
          ],
        },
        {
          t: "p",
          text: "A contractor rate that merely matches an employee's gross salary is a pay cut. Before comparing, add up contributions, unpaid time off, the absence of severance and the cost of your own insurance. In most European markets that lands somewhere between 25% and 40% on top.",
        },
      ],
      takeaway:
        "Compare annual net after all of it, not the headline. They are different currencies.",
    },
    {
      id: "clauses",
      h2: "The contractor clauses worth arguing about",
      answer:
        "Four clauses decide how exposed a contractor agreement leaves you: notice period, intellectual property scope, liability cap and exclusivity. They are routinely drafted in the client's favour and are routinely negotiable, because most clients have never been challenged on them.",
      blocks: [
        {
          t: "steps",
          items: [
            { title: "Notice period", text: "Fifteen days gives you no runway to replace the income. Thirty to sixty is normal in ongoing engagements." },
            { title: "Intellectual property", text: "Assign what you produce for that client, not everything you create professionally. Broad assignment clauses are usually boilerplate and can be narrowed." },
            { title: "Liability cap", text: "Uncapped liability means you personally carry unlimited exposure. A cap tied to fees paid over the last twelve months is the common landing point." },
            { title: "Exclusivity", text: "If they want exclusivity and set your hours, they are describing employment. Say so, and ask why an employment contract is not on the table." },
          ],
        },
        {
          t: "note",
          text: "Insurance is the fifth item people forget. Professional indemnity cover is cheap relative to a single dispute, and some clients require it anyway.",
        },
      ],
      takeaway:
        "Notice, IP, liability and exclusivity. Read those four before the rate.",
    },
    {
      id: "misclassification",
      h2: "When a contractor is really an employee",
      answer:
        "Misclassification happens when the paperwork says services but the reality says employment: fixed hours, company equipment, exclusivity and a line manager. Authorities look at the substance, not the label, and the consequences land on both sides of the relationship.",
      blocks: [
        {
          t: "ul",
          items: [
            "You are given fixed working hours and asked to justify absences.",
            "You work exclusively with the company's tools, accounts and equipment.",
            "A manager directs your day-to-day work rather than agreeing outcomes.",
            "You have invoiced the same single client for years with no others.",
            "You appear on the org chart and in team rituals like any employee.",
          ],
        },
        {
          t: "p",
          text: "None of these alone is decisive. Together they describe an employment relationship, and reclassification can mean back contributions and penalties for the company and lost expense deductions for you.",
        },
      ],
      takeaway:
        "The form has to match the substance. If your week looks like an employee's, the services contract protects nobody.",
    },
    {
      id: "why-company-cares",
      h2: "Why the company cares where you sit",
      answer:
        "Because your sustained presence in a country can create a taxable presence for them, called a permanent establishment. It can arise without an office: an employee habitually concluding contracts from another country on the company's behalf is enough. That is why work-from-anywhere policies cap days, countries and roles.",
      blocks: [
        {
          t: "p",
          text: "Engineers rarely trigger it. Sales roles that negotiate and sign from abroad can. Knowing this changes the conversation: instead of arguing against an arbitrary rule, you can propose an arrangement that keeps them out of the risk.",
        },
        {
          t: "p",
          text: "It also explains why some companies pay for an EOR even though it costs more. They are outsourcing a risk they cannot quantify.",
        },
      ],
      takeaway:
        "Country restrictions are risk management, not bureaucracy. Understanding them gives you leverage.",
    },
  ],
  faqs: [
    { q: "What does an Employer of Record actually do?", a: "It legally employs you in your country on behalf of a foreign company, running payroll, tax withholding, social contributions and local employment compliance, while the client company directs your work." },
    { q: "Is an EOR the same as a PEO?", a: "No. A PEO co-employs alongside a client that already has a local entity. An EOR becomes the sole legal employer, which is what allows a company with no local presence to hire you." },
    { q: "How much more should I charge as a contractor?", a: "Enough to absorb social contributions, unpaid leave and sick days, your own insurance and the absence of severance. In most European markets that means 25% to 40% above the employee equivalent." },
    { q: "Can I be an employee of a company that has no entity in my country?", a: "Not directly. That is precisely the gap an Employer of Record fills: you get a local employment contract with a third party acting on the company's behalf." },
    { q: "Does an EOR contract give me the same rights as a direct hire?", a: "In employment terms, yes: it is a local contract under your country's law. What can differ are matters like equity or bonus schemes that sit with the parent company." },
    { q: "What happens if I am misclassified?", a: "The company can face back contributions and penalties, and you may lose deductions claimed as self-employed. In some jurisdictions your service years get recognised as employment, which can work in your favour." },
    { q: "Who pays for my health insurance?", a: "Under an EOR, local contributions give you statutory cover and private insurance is sometimes added. As a contractor it is yours to arrange unless the contract says otherwise." },
    { q: "Can the client company fire me if I am on an EOR contract?", a: "They can end the engagement, but termination has to follow your country's employment law, including notice and statutory severance. That is the practical protection an EOR gives you." },
    { q: "Should I set up a limited company instead of invoicing personally?", a: "It depends on volume, liability exposure and your country's tax treatment. It adds administration, so it usually makes sense above a certain revenue level rather than from day one." },
    { q: "Is an uncapped liability clause normal?", a: "It is common in first drafts and rarely defended when challenged. A cap tied to fees paid in the preceding twelve months is a standard and reasonable counter-proposal." },
  ],
  hero: { file: "/blog/intermediario-legal.svg", alt: "Diagram: two companies in different countries and the contract bridging them." },
};
