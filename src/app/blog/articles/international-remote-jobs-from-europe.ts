import type { Article } from "@/app/blog/types";

// Par en español: trabajo-remoto-internacional-desde-espana. No es una
// traducción: el mercado angloparlante busca por "remote jobs that hire
// internationally" y por "EOR", no por trámites de un país concreto.
export const article: Article = {
  slug: "international-remote-jobs-from-europe",
  locale: "en",
  cluster: "empleo",
  funnel: "mofu",
  intent: "comercial",
  keyword: "international remote jobs from europe",
  secondary: [
    "remote jobs that hire internationally",
    "how to get a us remote job from europe",
    "work for a us company from abroad",
    "remote jobs no location restriction",
    "employer of record hiring",
  ],
  title: "International Remote Jobs From Europe: What Actually Gets You Hired",
  h1: "International Remote Jobs From Europe: What Actually Gets You Hired",
  metaTitle: "International Remote Jobs From Europe: The Practical Guide",
  metaDescription:
    "How companies abroad actually hire someone living in Europe, what the overlap requirement really filters, how pay is set, and the four points where applications quietly die.",
  ogTitle: "International Remote Jobs From Europe",
  ogDescription:
    "Contract structure, tax, overlap hours and pay bands: the four decisions behind every international remote hire.",
  published: "2026-08-19",
  updated: "2026-08-19",
  readingMinutes: 13,
  author: "ActiveXRemote Team",
  course: "remote-professional",
  terms: ["trabajo-remoto", "solapamiento-horario", "employer-of-record", "contractor-internacional", "compensacion-global", "geo-pay"],
  related: ["employer-of-record-vs-contractor", "ats-friendly-resume", "negotiating-remote-salary"],
  external: [
    { label: "European Commission · Working in another EU country", url: "https://europa.eu/youreurope/citizens/work/index_en.htm" },
    { label: "OECD · Model Tax Convention", url: "https://www.oecd.org/tax/treaties/" },
    { label: "EURES · European job mobility portal", url: "https://eures.europa.eu" },
  ],
  intro: [
    "Plenty of companies will hire someone who lives in Europe. Far fewer will explain how they do it, and that gap is where most applications go wrong: the candidate optimises the CV and ignores the four decisions that actually determine whether the hire happens at all.",
    "Those four are: how they can legally engage you, where you owe tax, how many hours you must overlap with the team, and how they set the band. This guide takes them in the order they show up.",
  ],
  sections: [
    {
      id: "how-hiring-works",
      h2: "How a company abroad can actually hire you",
      answer:
        "Three routes exist. The company incorporates a local entity, which is rare for one hire. It uses an Employer of Record that employs you locally on its behalf. Or it engages you as a contractor and you invoice. Each changes your rights, your tax position and who carries the risk.",
      blocks: [
        {
          t: "table",
          head: ["Route", "Your status", "When companies pick it"],
          rows: [
            ["Local entity", "Employee of a local subsidiary", "Only when hiring several people in the same country."],
            ["Employer of Record", "Employee of a third party acting for the company", "The default today: a real local contract without incorporating."],
            ["Contractor", "Self-employed, invoicing for services", "Project work, or when the company won't take on structure."],
          ],
        },
        {
          t: "p",
          text: "Ask this in the first call, not in the offer stage: «how do you engage people based in Europe?». A company that answers instantly has done this before. One that improvises is going to improvise with your contract too.",
        },
        {
          t: "note",
          text: "If the answer is «we'll just wire you a monthly amount», there is no legal structure behind it. That arrangement pushes the entire compliance risk onto you.",
        },
      ],
      takeaway:
        "The engagement model determines everything downstream. Establish it before discussing money.",
    },
    {
      id: "overlap",
      h2: "The overlap requirement is the real geographic filter",
      answer:
        "Almost every international remote role requires a minimum number of hours overlapping with the team, usually two to four. That single line decides which countries can realistically apply, and it is often buried far below the salary in the job post.",
      blocks: [
        {
          t: "table",
          head: ["Team hub", "Typical overlap asked", "What it means from Europe"],
          rows: [
            ["Europe (CET/GMT)", "4-6 hours", "A normal working day."],
            ["US East Coast", "3-4 hours", "Afternoons, roughly 15:00-19:00 CET."],
            ["US West Coast", "3-4 hours", "Evenings, from 18:00 CET onwards."],
            ["APAC", "2-3 hours", "Early mornings."],
          ],
        },
        {
          t: "p",
          text: "Read that line before the salary. If the overlap is incompatible with your life, there is room to negotiate only when you arrive with a concrete alternative: which window you cover, how you document decisions outside it, and how work gets unblocked without you.",
        },
      ],
      takeaway:
        "Overlap hours filter more candidates than skills do, and nobody mentions it.",
    },
    {
      id: "tax",
      h2: "Where you owe tax when the company is elsewhere",
      answer:
        "As a rule, employment income is taxed where the work is physically performed. Working remotely, that is your country of residence, not the company's. This is why a foreign employer withholds nothing locally and why understanding your own filing obligations matters from month one.",
      blocks: [
        {
          t: "p",
          text: "Tax residence is not a choice you declare. Each jurisdiction determines it with objective tests: days of presence, where your permanent home is, where your economic interests sit. Two countries can reach the same conclusion about you, and then the double tax treaty's tie-breaker rules apply.",
        },
        {
          t: "ul",
          items: [
            "As an employee via an Employer of Record, local withholding and contributions are handled for you.",
            "As a contractor, filings, prepayments and social contributions are yours to manage.",
            "Either way, keep a record of days spent in each country from the start. Reconstructing it later is expensive.",
          ],
        },
        {
          t: "note",
          text: "This section explains the framework so you know what to ask. Your specific position depends on the treaty in play and your own residence history, and that part belongs to a tax adviser.",
        },
      ],
      takeaway:
        "The country paying you and the country taxing you rarely match. Assuming the employer handles it is the costliest mistake here.",
    },
    {
      id: "pay",
      h2: "How remote companies set your band",
      answer:
        "Two models dominate. Some pay for the role's market, with one global band regardless of where you live. Others adjust by location, recalculating against a cost-of-living index. The gap between them can exceed 40% for identical work, and the policy predates your application.",
      blocks: [
        {
          t: "pros",
          pros: [
            "Role-based pay: one band for everyone, negotiation focuses on your level.",
            "Usually comes with documented, sometimes public, salary bands.",
            "Moving cities does not change what you earn.",
          ],
          cons: [
            "Location-based pay: the band is recalculated against where you live.",
            "Relocating can change your salary without changing your job.",
            "Negotiation shifts from your value to their index, which is harder to move.",
          ],
        },
        {
          t: "p",
          text: "Ask which model applies before naming a number. If it is location-based, the productive questions are about the index itself: which geography it references, when it was last revised, and which components sit outside the adjustment.",
        },
      ],
      takeaway:
        "«How do you set bands?» is a better opening question than «what does it pay?».",
    },
    {
      id: "where-to-start",
      h2: "Where to start if you are beginning from zero",
      answer:
        "Fix the application before increasing volume. Sending a hundred applications with a CV the parser cannot read produces a hundred silences, and then the wrong conclusion: that no opportunities exist. The order that works is counter-intuitive, because it front-loads the unglamorous work of rebuilding the document.",
      blocks: [
        {
          t: "ol",
          items: [
            "Rebuild the CV in a single column, no photo, no personal details, achievements with figures, and the exact vocabulary of the posts you target.",
            "Publish two or three worked examples: problem, constraint, your decision, measurable outcome. This replaces the local reputation that does not cross borders.",
            "Filter openings by overlap and eligible countries before reading anything else.",
            "Establish the engagement model in the first conversation.",
            "Prepare the negotiation with the full package translated into a comparable annual net figure.",
          ],
        },
        {
          t: "quote",
          text: "The international remote market does not reward whoever applies most. It rewards whoever arrives early with the least ambiguous application.",
        },
      ],
      takeaway:
        "Volume multiplies whatever you already have. If the starting point is weak, it multiplies silence.",
    },
  ],
  faqs: [
    { q: "Can a US company hire me if I live in Europe?", a: "Yes, usually through an Employer of Record that employs you locally on their behalf, or by engaging you as a contractor. Incorporating a local entity only makes sense when they hire several people in the same country." },
    { q: "What is an Employer of Record?", a: "A company that legally employs you in your own country on behalf of a foreign business. It runs payroll, contributions and local employment compliance, while your day-to-day work is directed by the client company." },
    { q: "Do I pay tax where I live or where the company is?", a: "Generally where you live, because employment income is taxed where the work is physically performed. A foreign employer will not withhold your local income tax, so the filing obligation is yours to understand." },
    { q: "What does «4 hours overlap» mean in a job post?", a: "You must be working at the same time as the team for at least four hours a day. It effectively determines which time zones can apply, even when the post lists no countries." },
    { q: "Will I be paid less because I live in Europe?", a: "Only if the company adjusts pay by location. Companies paying for the role's market offer the same band everywhere. Establish which model applies before naming a figure." },
    { q: "Is contractor or employee better?", a: "Employee via an Employer of Record gives you paid leave, sick pay and severance. Contractor usually pays a higher headline rate but you absorb contributions, unpaid time off and the absence of severance. Compare net, not gross." },
    { q: "How good does my English need to be?", a: "Good enough to write clearly. In async teams most communication is written, and a well-structured message counts for more than fluent conversation." },
    { q: "Do I need a visa to work remotely for a foreign company?", a: "Not if you are working from a country where you already have the right to reside and work. A visa question arises when you want to live somewhere new, which is what digital nomad visas address." },
    { q: "Which job boards actually list international remote roles?", a: "Specialist remote boards and company career pages both work, but the first forty-eight hours of a posting absorb most of the applications that get read carefully. Speed matters more than the source." },
    { q: "Can I keep the job if I move to another country?", a: "Sometimes, but check first. Many companies cap days and countries in their work-from-anywhere policy, because your prolonged presence elsewhere can create tax obligations for them." },
  ],
};
