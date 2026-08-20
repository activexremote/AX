import type { Article } from "@/app/blog/types";

export const article: Article = {
  slug: "ai-for-job-search",
  locale: "en",
  cluster: "herramientas",
  funnel: "mofu",
  intent: "comercial",
  keyword: "ai for job search",
  secondary: [
    "chatgpt resume tailoring",
    "ai interview preparation prompts",
    "does ai generated cover letter get detected",
    "using ai to apply for jobs",
    "ai job application tools",
  ],
  title: "AI for the Job Search: What Helps and What Gets You Caught",
  h1: "AI for the Job Search: What Helps and What Gets You Caught",
  metaTitle: "AI for Job Search: Useful Prompts and What Gives You Away",
  metaDescription:
    "Where AI genuinely speeds up an international application, where it damages it, how generated text is recognised, and concrete prompts for each task worth using it on.",
  ogTitle: "AI for the Job Search",
  ogDescription:
    "It accelerates preparation, it does not replace judgement. The uses that work and the tells that give generated text away.",
  published: "2026-06-30",
  updated: "2026-06-30",
  readingMinutes: 11,
  author: "ActiveXRemote Team",
  course: "remote-professional",
  terms: ["prompt-engineering", "agente-ia", "ats", "cv-internacional", "portfolio-internacional"],
  related: ["ats-friendly-resume", "proof-of-work-portfolio", "no-code-automation-for-solopreneurs", "async-interview-and-video-screening"],
  external: [
    { label: "European Commission · Artificial Intelligence Act", url: "https://digital-strategy.ec.europa.eu" },
    { label: "European Data Protection Board · Guidance on personal data", url: "https://www.edpb.europa.eu" },
  ],
  intro: [
    "AI does not get you hired. What it does is remove hours of mechanical work — adapting, summarising, ordering, rehearsing — and hand them back for the parts that actually decide: understanding the posting, preparing your own examples, and talking to people.",
    "Most people use it the other way round: to write what should be personal, and to skip the preparation that matters. This separates the two, with concrete prompts for each task.",
  ],
  sections: [
    {
      id: "where-it-helps",
      h2: "Where it genuinely speeds things up",
      answer:
        "Four tasks: working out what a posting actually asks for, adapting your resume's structure to that posting's vocabulary, generating likely interview questions to answer yourself, and rehearsing a negotiation. All four share one thing: you supply the raw material.",
      blocks: [
        {
          t: "table",
          head: ["Task", "What you ask it for", "What still comes from you"],
          rows: [
            ["Analysing a posting", "Explicit and implicit requirements, overlap and eligibility signals", "The decision on whether it fits"],
            ["Adapting the resume", "Reordering and vocabulary from your real text", "The achievements, the numbers, the truth"],
            ["Interview prep", "The fifteen most likely questions for that role", "The answers, with your examples"],
            ["Negotiation rehearsal", "Recruiter objections to push back with", "Your figure and your limits"],
          ],
        },
        {
          t: "p",
          text: "The pattern holds throughout: AI accelerates the structural, repetitive layer while verifiable content still comes from your experience. Invert that relationship and the result shows, working against you.",
        },
      ],
      takeaway:
        "Use it to organise and rehearse, not to invent. The material has to be yours.",
    },
    {
      id: "posting",
      h2: "Analysing a posting before you apply",
      answer:
        "This is the highest-return use and almost nobody does it. Before touching the resume, extract from the posting the real requirements, its exact vocabulary, and the conditions that are rarely highlighted: overlap hours, eligible countries and the engagement model implied.",
      blocks: [
        {
          t: "note",
          text: "Prompt: «Analyse this job posting. Return: 1) must-have requirements, 2) nice-to-haves, 3) the exact terms my application should mirror, 4) overlap hours and eligible countries if mentioned, 5) what engagement model the wording implies, 6) three questions I should ask on the first call.»",
        },
        {
          t: "p",
          text: "Point four saves the most applications. Discovering that a role wants four hours of overlap with the US west coast before spending an afternoon tailoring your resume is the difference between applying deliberately and applying by volume.",
        },
      ],
      takeaway:
        "Analyse the posting before writing anything. It is the step that returns the most time.",
    },
    {
      id: "resume",
      h2: "Tailoring a resume without it sounding generated",
      answer:
        "Start from your real text and ask for reordering and vocabulary alignment, never drafting from scratch. A resume written entirely by a model is recognisable the same way every time: evenly balanced sentences, abundant adjectives and not a single concrete number.",
      blocks: [
        {
          t: "ul",
          items: [
            "Give it your current resume plus the posting, and ask it to adjust the headline, summary and order of the tools list.",
            "Forbid invention explicitly: «do not add any experience, tool or figure that is not in my text».",
            "Ask it to flag gaps rather than fill them: «mark where a number is missing so I can add it».",
            "Review line by line. Anything you could not defend in an interview comes out.",
          ],
        },
        {
          t: "p",
          text: "And do not ask it to «improve the style». The output tends to be longer, more adjectival and less concrete, which is precisely the opposite of what works in an international application.",
        },
      ],
      takeaway:
        "Reorder and align vocabulary, yes. Draft from nothing, no.",
    },
    {
      id: "tells",
      h2: "What gives generated text away",
      answer:
        "It is not a detection tool that catches you: it is the pattern. Uniform sentence lengths, the same three-item structure repeated throughout, abundant empty adjectives, a total absence of figures, and an upbeat tone that no working professional uses when writing about their own work.",
      blocks: [
        {
          t: "pros",
          pros: [
            "Uneven sentence lengths, the way anyone actually writes.",
            "Concrete detail: tool names, numbers, timeframes.",
            "An opinion or a debatable decision, which is what demonstrates judgement.",
            "Sector vocabulary rather than brochure vocabulary.",
          ],
          cons: [
            "«Passionate about excellence and continuous improvement.»",
            "Triads everywhere: «fast, efficient and scalable».",
            "Not a single number in the whole letter.",
            "A closing paragraph that restates what was already said.",
          ],
        },
        {
          t: "p",
          text: "Many employers no longer penalise AI use as such. They penalise an application indistinguishable from a hundred others. If the text contains nothing only you could have written, the problem is not the tool but the absence of your own content.",
        },
      ],
      takeaway:
        "What gives it away is not the AI. It is the absence of any detail only you could supply.",
    },
    {
      id: "limits",
      h2: "Two limits worth respecting",
      answer:
        "Two limits matter. First, data: pasting contracts, confidential postings or other people's information into a third-party tool carries real privacy implications you cannot undo. Second, honesty: embellished experience survives exactly until the first technical question, and from that point it destroys the entire application rather than just one answer.",
      blocks: [
        {
          t: "ol",
          items: [
            "Do not paste third-party personal data, contracts or anything under confidentiality.",
            "Check what the tool does with your inputs and whether it trains on them; paid tiers usually let you disable that.",
            "Do not claim experience, tools or certifications you lack: a technical interview surfaces it in two questions.",
            "If a company asks directly whether you used AI on an exercise, answer honestly. Lying about it weighs more than the use itself.",
          ],
        },
      ],
      takeaway:
        "Accelerate the preparation, do not fabricate the substance. The second always surfaces.",
    },
  ],
  faqs: [
    { q: "Is it wrong to use AI when preparing an application?", a: "No. What employers penalise is an application indistinguishable from any other, with no specific detail or figures. Using it to analyse postings, reorder your resume and rehearse interviews is legitimate and useful." },
    { q: "Can employers detect an AI-written cover letter?", a: "Automated detectors are unreliable, but the pattern is visible: uniform sentences, abundant adjectives, no numbers. What gives it away is not the tool, it is the lack of your own content." },
    { q: "Can I ask it to write my resume from scratch?", a: "You can, but it will be generic and risks inventing things. Far better to give it your real text and ask for reordering and vocabulary alignment, explicitly forbidding additions." },
    { q: "What prompt works best for analysing a posting?", a: "Ask separately for must-haves and nice-to-haves, the exact terms to mirror, overlap hours and eligible countries, the engagement model implied, and three questions for the first call." },
    { q: "Is it safe to paste a job posting or a contract into an AI tool?", a: "A public posting is fine. A contract, third-party data or confidential material is not: check what the provider does with your inputs and whether they are used for training." },
    { q: "Is AI useful for interview preparation?", a: "Very, when used to generate likely questions and rehearse aloud. The answers have to come from your own examples: memorising generated answers shows on the first follow-up question." },
    { q: "What about salary negotiation?", a: "As an objection simulator it works well: ask it to act as a recruiter and push back on your figure. What it cannot give you is reliable market data or your own walk-away point." },
    { q: "Should I disclose AI use if asked?", a: "Yes. Lying about it weighs far more than the use itself, and in a technical exercise it surfaces within two follow-up questions." },
    { q: "Can AI fill in application forms for me?", a: "Tools exist, but review every submission. Mass-submitted forms produce errors that do get you rejected, and some employers detect the pattern." },
    { q: "Is a paid AI tool worth it for job hunting?", a: "It depends on volume. If you are preparing many applications, paid tiers usually let you disable training on your data, which is the meaningful difference beyond model quality." },
  ],
  hero: { file: "/blog/amplificador.svg", alt: "Diagram: one signal enters a triangular amplifier and five come out." },
};
