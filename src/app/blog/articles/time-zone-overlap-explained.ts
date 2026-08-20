import type { Article } from "@/app/blog/types";

export const article: Article = {
  slug: "time-zone-overlap-explained",
  locale: "en",
  cluster: "empleo",
  funnel: "tofu",
  intent: "informacional",
  keyword: "time zone overlap remote job",
  secondary: [
    "what does overlap hours mean",
    "working us hours from europe",
    "core hours remote team",
    "remote jobs with flexible hours",
    "how much overlap do remote jobs require",
  ],
  title: "Time Zone Overlap: The Requirement That Filters You Out Silently",
  h1: "Time Zone Overlap: The Requirement That Filters You Out Silently",
  metaTitle: "Time Zone Overlap in Remote Jobs: What It Means for You",
  metaDescription:
    "What overlap requirements actually mean in practice, how many hours different team hubs ask for, when the requirement is negotiable, and how to propose an alternative that gets accepted.",
  ogTitle: "Time Zone Overlap Explained",
  ogDescription:
    "One line in the job post decides which countries can apply. Here is how to read it and when to push back.",
  published: "2026-04-14",
  updated: "2026-04-14",
  readingMinutes: 10,
  author: "ActiveXRemote Team",
  course: "remote-professional",
  terms: ["solapamiento-horario", "trabajo-asincrono", "burnout-remoto", "onboarding-distribuido"],
  related: ["remote-burnout-signals", "async-interview-and-video-screening", "first-90-days-remote-team", "async-work-guide"],
  external: [
    { label: "Eurofound · Working time and telework research", url: "https://www.eurofound.europa.eu" },
    { label: "ILO · Working time arrangements", url: "https://www.ilo.org" },
  ],
  intro: [
    "Job posts are read for the salary, the stack and the title. The line that most often decides whether you can take the role at all sits three paragraphs down and reads something like «must have 4 hours of overlap with PST».",
    "That sentence is the real geographic filter. This explains what it means in practice, when it is genuinely non-negotiable, and how to propose an alternative that a hiring manager can actually accept.",
  ],
  sections: [
    {
      id: "what-it-means",
      h2: "What an overlap requirement actually asks for",
      answer:
        "It asks you to be working at the same time as the core team for a stated number of hours each day. It is not about total hours worked or availability for emergencies. It is about a predictable window when synchronous collaboration can happen without anyone scheduling around midnight.",
      blocks: [
        {
          t: "table",
          head: ["Team hub", "Typical ask", "What that means from Central Europe"],
          rows: [
            ["Europe (CET/GMT)", "4-6 hours", "An ordinary working day."],
            ["US East Coast", "3-4 hours", "Roughly 15:00 to 19:00."],
            ["US West Coast", "3-4 hours", "From about 18:00 onwards."],
            ["APAC (Singapore, Sydney)", "2-3 hours", "Early mornings, before 10:00."],
            ["«Fully async»", "0-2 hours", "Rare, and worth verifying in interview."],
          ],
        },
        {
          t: "p",
          text: "Note the asymmetry. A four-hour overlap with the US west coast means evening work indefinitely, not occasionally. A four-hour overlap with the east coast fits inside a normal afternoon. Same number, entirely different life.",
        },
      ],
      takeaway:
        "The number matters less than which hours it lands on. Convert it before deciding.",
    },
    {
      id: "why-companies-ask",
      h2: "Why companies ask for it",
      answer:
        "Usually because their processes are synchronous. A team that makes decisions in meetings needs everyone present for those meetings. The requirement is real, but it describes how the company currently works rather than a permanent property of the role.",
      blocks: [
        {
          t: "ul",
          items: [
            "Decision-making happens in calls, so absence from calls means absence from decisions.",
            "Onboarding relies on informal availability rather than documentation.",
            "Client-facing roles genuinely need to be reachable when clients are.",
            "Incident response requires coverage, which is a rota question rather than an overlap question.",
          ],
        },
        {
          t: "p",
          text: "The first two are cultural and therefore negotiable in principle. The last two are structural: if customers are in a given time zone, someone has to be awake for them. Knowing which category you are arguing with determines whether pushing back is realistic.",
        },
      ],
      takeaway:
        "Cultural overlap requirements can move. Structural ones, driven by customers or on-call, cannot.",
    },
    {
      id: "reading-posts",
      h2: "Reading job posts for the real constraint",
      answer:
        "Look for three things beyond the overlap number: which countries are listed as eligible, whether the role is client-facing, and whether the company documents decisions publicly. Together they tell you more about your actual working hours than the overlap line alone.",
      blocks: [
        {
          t: "ol",
          items: [
            "Find the eligible countries list. Its absence usually means the company has not solved cross-border hiring, not that anywhere is fine.",
            "Check whether they mention a public handbook or written decision process. That signals genuine async capability.",
            "Look at where the leadership team sits. Decisions gravitate to the timezone of whoever decides.",
            "Check whether on-call or client coverage is mentioned anywhere, which changes the picture entirely.",
          ],
        },
        {
          t: "note",
          text: "«Fully remote, work from anywhere» plus a four-hour overlap with a single time zone is a contradiction worth raising in the first call. It usually resolves into «anywhere within these five countries».",
        },
      ],
      takeaway:
        "Eligible countries and where leadership sits tell you more than the stated overlap.",
    },
    {
      id: "negotiating",
      h2: "How to negotiate it without sounding difficult",
      answer:
        "Not by asking for an exception, but by proposing a working arrangement. Name the window you will cover, explain how decisions get unblocked outside it, and offer a review point. A hiring manager can accept a proposal; they cannot easily accept a request for less.",
      blocks: [
        {
          t: "steps",
          items: [
            { title: "Name your window precisely", text: "«I can reliably cover 15:00 to 19:00 CET, which is 09:00 to 13:00 ET» is concrete. «I am flexible» is not." },
            { title: "Say how you unblock people", text: "Written handovers at end of day, decisions documented with default actions, and a named fallback for urgent items." },
            { title: "Offer a trial period", text: "«Let's review after ninety days» reduces the perceived risk of saying yes." },
            { title: "Be honest about the limit", text: "If you cannot work evenings long term, say so now. Discovering it at month four is worse for both sides." },
          ],
        },
        {
          t: "p",
          text: "The proposal works because it addresses the manager's actual fear, which is not your hours but being blocked waiting on you. Solve that explicitly and the number of hours becomes secondary.",
        },
      ],
      takeaway:
        "Managers fear being blocked, not your schedule. Address the blocking and the hours become negotiable.",
    },
    {
      id: "cost",
      h2: "The cost of accepting a bad overlap",
      answer:
        "Sustained evening work fragments the day, erodes the boundary between work and life, and is one of the strongest predictors of remote burnout. It is also invisible in the first months, which is why people accept it and only reassess a year in.",
      blocks: [
        {
          t: "p",
          text: "The pattern is consistent: the early enthusiasm covers the cost, then meetings creep later, then the evenings stop being yours. The people who sustain large overlaps long term almost always have either a fixed hard stop or a rotating arrangement with colleagues.",
        },
        {
          t: "ul",
          items: [
            "Set the hard stop before you start, not once it is already a problem.",
            "Ask whether meeting times rotate or whether the same people always adjust.",
            "Count the actual recurring meetings in that window, not the theoretical overlap.",
            "Revisit it at ninety days deliberately rather than drifting.",
          ],
        },
      ],
      takeaway:
        "A bad overlap does not feel expensive for three months. Decide before then, not after.",
    },
  ],
  faqs: [
    { q: "What does «4 hours overlap» mean in a job post?", a: "You must be working at the same time as the core team for at least four hours each day. It is about predictable synchronous availability, not total hours worked." },
    { q: "Which time zones are realistic from Europe?", a: "European hubs fit an ordinary day. US east coast means afternoons. US west coast means evenings from around 18:00. APAC means early mornings. The same overlap number produces very different lives." },
    { q: "Is the overlap requirement negotiable?", a: "Often, when it is cultural rather than structural. If it exists because decisions happen in meetings, a concrete async proposal can move it. If customers or on-call drive it, it usually cannot." },
    { q: "How do I propose an alternative?", a: "Name the exact window you will cover, explain how you unblock people outside it through written handovers and default actions, and offer a ninety-day review. A proposal is easier to accept than a request." },
    { q: "Why do posts say «work from anywhere» and then require overlap?", a: "Because the two statements come from different people. In practice it usually means anywhere within a small list of eligible countries that also satisfies the overlap." },
    { q: "Does a large overlap requirement mean the company is not really remote?", a: "It usually means they are distributed but synchronous. That is a legitimate way to operate, but it is worth knowing before you join rather than after." },
    { q: "Can I work evenings long term?", a: "Some people do sustainably, most with either a firm hard stop or a rotating arrangement. Sustained evening work with creeping meeting times is one of the clearest predictors of remote burnout." },
    { q: "Should I ask about overlap in the first call?", a: "Yes, and early. It costs nothing and it prevents investing weeks in a process that cannot work for your life." },
    { q: "What if the post does not mention overlap at all?", a: "Ask. Its absence more often means nobody wrote it down than that no expectation exists. The answer will also tell you how much the company has thought about distribution." },
    { q: "Do overlap requirements change once you are hired?", a: "They can drift, usually upwards, as meetings accumulate. Agreeing a review point at ninety days gives you a legitimate moment to reset it before it becomes the norm." },
  ],
  hero: { file: "/blog/solapamiento.svg", alt: "Diagram: two working days and the narrow band where they actually overlap." },
};
