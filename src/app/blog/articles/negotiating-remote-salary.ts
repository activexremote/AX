import type { Article } from "@/app/blog/types";

export const article: Article = {
  slug: "negotiating-remote-salary",
  locale: "en",
  cluster: "empleo",
  funnel: "bofu",
  intent: "comercial",
  keyword: "negotiating remote salary",
  secondary: [
    "location based pay explained",
    "how to negotiate total compensation",
    "remote salary bands",
    "salary expectations question answer",
    "counter offer remote job",
  ],
  title: "Negotiating a Remote Salary When the Company Pays by Location",
  h1: "Negotiating a Remote Salary When the Company Pays by Location",
  metaTitle: "Negotiating Remote Salary: Bands, Location Pay and Total Comp",
  metaDescription:
    "How remote companies set bands, what to ask before naming a number, how to price a full package into one comparable figure, and what actually moves a location-adjusted offer.",
  ogTitle: "Negotiating a Remote Salary",
  ogDescription:
    "Role-based or location-based pay changes the entire argument. Here is how to find out and what to do with the answer.",
  published: "2026-08-19",
  updated: "2026-08-19",
  readingMinutes: 11,
  author: "ActiveXRemote Team",
  course: "remote-professional",
  terms: ["compensacion-global", "geo-pay", "multidivisa", "contractor-internacional", "employer-of-record"],
  related: ["international-remote-jobs-from-europe", "ats-friendly-resume", "employer-of-record-vs-contractor"],
  external: [
    { label: "European Commission · Pay Transparency Directive", url: "https://ec.europa.eu/social" },
    { label: "OECD · Average wages statistics", url: "https://data.oecd.org" },
    { label: "Eurostat · Labour cost and earnings data", url: "https://ec.europa.eu/eurostat" },
  ],
  intro: [
    "In remote negotiations, people rarely lose money by asking for too much. They lose it by answering too early, anchoring on what they earned in a different market, and never finding out how the company sets its bands in the first place.",
    "This guide puts the conversation in order: what to establish beforehand, what to ask in the first call, how to convert a package into one comparable number, and what to do when the answer is «we pay according to your location».",
  ],
  sections: [
    {
      id: "two-models",
      h2: "The two compensation models",
      answer:
        "Remote companies pay one of two ways. Either the band is set by the role's market and applies to everyone, or it is adjusted against the cost of living where you live. The gap can exceed 40% for identical work, and the policy was written long before your application arrived.",
      blocks: [
        {
          t: "table",
          head: ["", "Role-based pay", "Location-based pay"],
          rows: [
            ["How it is set", "One global band per role and level", "A base band adjusted by a geographic index"],
            ["What you negotiate", "Where in the band you land", "The band position, and sometimes the index applied"],
            ["If you relocate", "Nothing changes", "Your pay may be recalculated"],
            ["Typical of", "Companies with documented, sometimes public bands", "Companies operating across many countries"],
          ],
        },
        {
          t: "p",
          text: "Neither is illegitimate. What does not work is negotiating without knowing which one you are in: the arguments that move a global band are useless against a geographic index, and the reverse is also true.",
        },
      ],
      takeaway:
        "«How do you set bands?» beats «what does it pay?» as an opening question.",
    },
    {
      id: "before",
      h2: "What to establish before the first call",
      answer:
        "Three things: how they will engage you, which compensation model they run, and the market range for the role at your level. All three can be found without asking anything awkward, and together they determine what number is even sensible to name.",
      blocks: [
        {
          t: "ol",
          items: [
            "Engagement model: employee via an Employer of Record, or contractor. A contractor gross and an employee gross are not comparable numbers.",
            "Compensation model: check whether they publish bands, keep a public handbook, or list different ranges per eligible country.",
            "Market range: benchmark against the company's market, not yours. Two independent sources minimum.",
            "Currency: being paid in a currency you do not spend adds conversion cost unless you plan for it.",
          ],
        },
        {
          t: "note",
          text: "As a contractor, the figure has to absorb social contributions, tax that an employer would otherwise withhold, unpaid days off and the absence of severance. In most European markets that lands between 25% and 40% above the employee equivalent.",
        },
      ],
      takeaway:
        "Arriving with the engagement model and the market range settled is half the negotiation.",
    },
    {
      id: "first-number",
      h2: "Who names the first number",
      answer:
        "Ideally the company. If they insist you go first, the useful answer is not a single figure but a justified range anchored explicitly in the role's market. Anchoring on your previous salary imports another country's conditions into a job that no longer has them.",
      blocks: [
        {
          t: "p",
          text: "When «what are your expectations?» arrives, three answers work better than a number: ask for the band, ask which model they use, or give a range and state where it comes from. All three keep the conversation about the role rather than your history.",
        },
        {
          t: "quote",
          text: "Your previous salary is information about your previous market, not about the value of this role.",
        },
        {
          t: "p",
          text: "Salary history questions are already restricted in several jurisdictions, and pay transparency rules are pushing companies to publish ranges in postings. Asking for the band is now an ordinary question, not a bold one.",
        },
      ],
      takeaway:
        "If you must go first, give a range and say where it comes from. Never from your old payslip.",
    },
    {
      id: "package",
      h2: "Turning the package into one comparable number",
      answer:
        "Two offers with the same headline can differ by 30% in real value. Before comparing, convert every component into an annual net figure: employer contributions included or not, health cover, equity, equipment and learning budgets, actual time off, and currency conversion cost.",
      blocks: [
        {
          t: "table",
          head: ["Component", "What to ask", "Why it matters"],
          rows: [
            ["Annual gross", "Does it include employer contributions?", "Shifts net by 20% to 35%."],
            ["Variable", "Guaranteed, target-based or discretionary?", "Discretionary variable cannot be budgeted."],
            ["Equity", "Instrument, vesting schedule, current valuation", "Its real value depends on terms rarely volunteered."],
            ["Health cover", "Company-provided or your own?", "As a contractor this is a significant annual line."],
            ["Time off", "Actual days, and is there a minimum?", "Unlimited policies without a floor usually mean fewer days."],
            ["Currency", "Which currency, and who absorbs conversion?", "The FX margin can take several points of income."],
          ],
        },
      ],
      takeaway:
        "Compare annual net, not gross. Gross is the number they advertise; net is the number you live on.",
    },
    {
      id: "location-pay",
      h2: "What to do when pay is location-adjusted",
      answer:
        "Ask about the index itself and when it was last revised. A location adjustment rests on external data, and that data is arguable: which city it references, which basket it compares, and how often it updates. That is where the room sits, not in «I am worth more».",
      blocks: [
        {
          t: "ul",
          items: [
            "Ask which geography they reference. A national index and a city index produce very different numbers.",
            "Ask when it was last revised. Stale indices work against you in inflationary periods.",
            "Ask what happens if you move within the same country. If nothing changes, the index is national and there is less room.",
            "Negotiate the components outside the adjustment: variable, learning budget, equipment, time off and equity usually sit outside it.",
          ],
        },
        {
          t: "p",
          text: "If the adjusted band still sits far below the role's market, that is useful information rather than an insult. It tells you the company optimises cost by geography. You can accept that knowingly, or prioritise companies running the other model.",
        },
      ],
      takeaway:
        "You cannot argue against an index with merit. You argue with the index.",
    },
  ],
  faqs: [
    { q: "Will I be paid less for living outside the US?", a: "Only if the company adjusts pay by location. Companies paying for the role's market offer the same band everywhere. Establishing which model applies before naming a figure changes the whole conversation." },
    { q: "Can I refuse to share my current salary?", a: "Yes, and in several jurisdictions employers can no longer ask. Redirect to the band for the role: your history reflects a different market's conditions." },
    { q: "How much more should I ask for as a contractor?", a: "Enough to absorb contributions, unwithheld tax, unpaid time off and the absence of severance. In practice that usually means 25% to 40% above the employee equivalent." },
    { q: "When should salary come up, early or late?", a: "The range as early as possible, so you do not spend weeks on a process that cannot work. The specific figure once there is intent to offer and you have the full package details." },
    { q: "What if the offer is below my minimum?", a: "Say so with a figure and a reason rather than a flat refusal. Many offers move within the band when there is a concrete argument and genuine willingness to accept." },
    { q: "Is anything other than salary negotiable?", a: "Almost always. Time off, learning and equipment budgets, start date, a six-month review, or health cover typically have more room than the base figure." },
    { q: "Which currency should I be paid in?", a: "The one you spend, where possible. Otherwise negotiate who absorbs conversion and use a multi-currency account: the FX margin can take several points of annual income." },
    { q: "Does equity count as salary?", a: "Not for paying rent. It counts once you understand the instrument, the vesting schedule and the valuation. If you cannot explain those three, value it at zero when comparing offers." },
    { q: "Should I mention competing offers?", a: "Only if they are real and you would accept them. As an objective data point it works; as a bluff it is easy to detect and damages the relationship." },
    { q: "How often are salaries reviewed at remote companies?", a: "Usually annually, often tied to a performance cycle. Asking during the negotiation avoids discovering two years later that no mechanism exists." },
  ],
};
