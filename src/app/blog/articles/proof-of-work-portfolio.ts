import type { Article } from "@/app/blog/types";

export const article: Article = {
  slug: "proof-of-work-portfolio",
  locale: "en",
  cluster: "empleo",
  funnel: "mofu",
  intent: "informacional",
  keyword: "portfolio for remote job",
  secondary: [
    "proof of work portfolio examples",
    "portfolio for non designers",
    "how to show work you cannot share",
    "case study format for job applications",
    "personal site for job search",
  ],
  title: "A Portfolio That Works When Nobody Knows Your Employers",
  h1: "A Portfolio That Works When Nobody Knows Your Employers",
  metaTitle: "Proof-of-Work Portfolio: How to Show Work That Travels",
  metaDescription:
    "Why local reputation does not cross borders, what a case study needs to be credible, how to show work under confidentiality, and why three good cases beat twenty links.",
  ogTitle: "A Portfolio That Works When Nobody Knows Your Employers",
  ogDescription:
    "Recruiters abroad cannot call your old manager. Evidence replaces reputation, and evidence has a format.",
  published: "2026-08-19",
  updated: "2026-08-19",
  readingMinutes: 10,
  author: "ActiveXRemote Team",
  course: "remote-professional",
  terms: ["portfolio-internacional", "marca-personal", "cv-internacional", "ats"],
  related: ["ats-friendly-resume", "international-remote-jobs-from-europe", "async-interview-and-video-screening"],
  external: [
    { label: "European Commission · Europass and skills documentation", url: "https://europa.eu/europass/en" },
    { label: "EURES · Presenting yourself to European employers", url: "https://eures.europa.eu" },
  ],
  intro: [
    "When someone hires from another continent, they cannot call your previous manager, do not know whether your former employer was a market leader or a three-person shop, and have no shared contacts to ask. Everything that vouches for you locally stops working.",
    "A portfolio is what fills that gap. Not a gallery, and not a personal website with a hero image: a small set of worked examples that let a stranger evaluate your judgement.",
  ],
  sections: [
    {
      id: "why",
      h2: "Why reputation does not cross borders",
      answer:
        "Because reputation is a network property, and networks are local. A recruiter in another country cannot verify your employer's standing, cannot reach anyone who worked with you, and cannot calibrate your job titles against theirs. Evidence is the only thing that transfers intact.",
      blocks: [
        {
          t: "p",
          text: "This also explains a common frustration: strong candidates with excellent local track records getting no traction internationally. Nothing is wrong with the track record. It simply is not legible to someone outside the market.",
        },
        {
          t: "table",
          head: ["Signal", "Works locally", "Works internationally"],
          rows: [
            ["Previous employer's name", "Strong", "Usually meaningless"],
            ["Job title", "Understood", "Calibrates differently by market"],
            ["Mutual contacts", "Decisive", "Rarely available"],
            ["Worked examples with outcomes", "Useful", "Decisive"],
          ],
        },
      ],
      takeaway:
        "Evidence is the only credential that survives crossing a border intact.",
    },
    {
      id: "format",
      h2: "What a credible case study contains",
      answer:
        "Four things: the problem with its constraints, what you specifically decided, what you rejected and why, and the measurable outcome. The rejected options matter most, because they are what distinguishes someone who exercised judgement from someone who executed instructions.",
      blocks: [
        {
          t: "steps",
          items: [
            { title: "The situation and the constraint", text: "Two or three sentences. What was broken, and what made it hard: budget, timeline, legacy system, team size." },
            { title: "Your specific role", text: "«The team migrated the platform» tells a reader nothing about you. Say what you owned." },
            { title: "The decision and the alternatives", text: "What you chose, what you rejected and the reason. This is the part that demonstrates thinking." },
            { title: "The outcome, measured", text: "A number, a timeframe, a before and after. If the outcome was mixed, say so: it reads as more credible, not less." },
          ],
        },
        {
          t: "note",
          text: "Include one case that did not go well, with what you would do differently. It is disproportionately persuasive, because almost nobody does it and everybody knows projects fail.",
        },
      ],
      takeaway:
        "Problem, constraint, your decision, what you rejected, measured outcome. In that order.",
    },
    {
      id: "confidential",
      h2: "Showing work you are not allowed to share",
      answer:
        "Most professional work is confidential, and that is not an obstacle. You can describe the shape of a problem, your reasoning and the scale of the outcome without naming the client, showing the interface or disclosing figures that identify anyone.",
      blocks: [
        {
          t: "ul",
          items: [
            "Anonymise the client and describe them by sector and size: «a logistics company of around 200 people».",
            "Use relative figures instead of absolute ones: «reduced processing time by 40%» rather than revenue numbers.",
            "Recreate the artefact rather than publishing the original: a redrawn diagram, a sanitised template.",
            "If in doubt, ask. Many former employers agree to a described case study when the alternative is nothing.",
          ],
        },
        {
          t: "p",
          text: "What you must not do is publish material you signed away, or reconstruct it closely enough that the client is identifiable. A portfolio that breaches confidentiality tells a hiring manager exactly how you will treat their information.",
        },
      ],
      takeaway:
        "Describe the reasoning, not the artefact. Confidentiality is a constraint, not a blocker.",
    },
    {
      id: "format-and-place",
      h2: "Where to put it and how much",
      answer:
        "Three cases, on a page you control, linked from the top of your CV. More than five reduces the chance any of them is read carefully. The venue matters less than permanence: it must still exist in two years and not depend on a platform's algorithm.",
      blocks: [
        {
          t: "pros",
          pros: [
            "A simple page on your own domain: permanent, controllable, loads fast.",
            "Three to five cases, each readable in two minutes.",
            "A one-line summary at the top of each so a skimmer gets the point.",
            "Plain text and diagrams over screenshots that need explaining.",
          ],
          cons: [
            "A gallery of twenty links with no context.",
            "A slide deck that must be downloaded to be read.",
            "Content only on a social platform, subject to its reach and its rules.",
            "A site so designed that the loading time exceeds the recruiter's patience.",
          ],
        },
      ],
      takeaway:
        "Three cases, two minutes each, on something you own. Volume works against you here.",
    },
    {
      id: "non-visual",
      h2: "If your work is not visual",
      answer:
        "Most work is not, and portfolios are not only for designers. An operations manager, an accountant or a project lead can all show reasoning: a process redesigned, a decision framework, a template that others adopted, a written analysis of a problem in their field.",
      blocks: [
        {
          t: "ol",
          items: [
            "Write up a decision you made and the reasoning behind it, as if explaining it to a peer.",
            "Publish a template or checklist you built, with the thinking behind each item.",
            "Analyse a public problem in your domain and show how you would approach it.",
            "Record a five-minute walkthrough of how you would tackle a typical brief.",
          ],
        },
        {
          t: "quote",
          text: "Nobody is evaluating your visuals. They are evaluating whether you would make good decisions without supervision.",
        },
      ],
      takeaway:
        "Judgement is the thing being assessed, and judgement can be written down in any field.",
    },
  ],
  faqs: [
    { q: "Do I need a portfolio if I am not a designer?", a: "Yes, though not a visual one. Any role can demonstrate judgement: a process you redesigned, a decision framework, a written analysis. What is being assessed is how you think, not what you can draw." },
    { q: "How many cases should a portfolio have?", a: "Three to five. Beyond that the chance of any single one being read carefully drops sharply. Depth in a few beats breadth across many." },
    { q: "How do I show work covered by confidentiality?", a: "Describe the problem shape, your reasoning and relative outcomes without naming the client or publishing protected material. Sector and company size are usually enough context." },
    { q: "Where should a portfolio live?", a: "On a page you control, ideally your own domain. What matters is that it still exists in two years and does not depend on a platform's reach or policies." },
    { q: "What makes a case study credible?", a: "The rejected alternatives. Stating what you considered and why you ruled it out is what separates someone exercising judgement from someone following instructions." },
    { q: "Should I include projects that failed?", a: "One, yes, with what you would do differently. It is disproportionately persuasive because almost nobody does it and every experienced person knows projects fail." },
    { q: "Is a personal website necessary?", a: "A simple page is enough. An elaborate site with slow loading and no cases performs worse than plain text with three well-explained examples." },
    { q: "Can I use side projects instead of professional work?", a: "Yes, especially early in a career. What matters is that the reasoning is real and the constraints are described honestly, not whether someone paid for it." },
    { q: "Should the portfolio be in English?", a: "If you are applying internationally, yes. Keep a version in your own language if you also apply locally, but the international one should be in the market's language." },
    { q: "How do I link it from my CV?", a: "Near the top, in the header, as a plain URL that is readable when the CV is printed. Buried at the bottom it will not be clicked." },
  ],
};
