import type { Article } from "@/app/blog/types";

export const article: Article = {
  slug: "async-interview-and-video-screening",
  locale: "en",
  cluster: "empleo",
  funnel: "mofu",
  intent: "informacional",
  keyword: "async interview remote job",
  secondary: [
    "one way video interview tips",
    "take home assignment remote job",
    "asynchronous hiring process",
    "recorded video interview preparation",
    "written interview questions remote",
  ],
  title: "Async Interviews and Video Screens: How Remote Hiring Really Filters",
  h1: "Async Interviews and Video Screens: How Remote Hiring Really Filters",
  metaTitle: "Async Interviews and Video Screening: How to Prepare",
  metaDescription:
    "Why remote hiring uses recorded videos, written questions and take-home assignments, what each stage is really testing, and how to prepare for formats almost nobody has practised.",
  ogTitle: "Async Interviews and Video Screens",
  ogDescription:
    "Recorded answers, written rounds and take-homes test different things than a conversation. Prepare accordingly.",
  published: "2026-05-05",
  updated: "2026-05-05",
  readingMinutes: 11,
  author: "ActiveXRemote Team",
  course: "remote-professional",
  terms: ["trabajo-asincrono", "onboarding-distribuido", "portfolio-internacional", "documentacion-asincrona"],
  related: ["first-90-days-remote-team", "time-zone-overlap-explained", "async-work-guide", "ats-friendly-resume"],
  external: [
    { label: "European Commission · Artificial Intelligence Act and recruitment", url: "https://digital-strategy.ec.europa.eu" },
    { label: "European Data Protection Board · Automated decision-making guidance", url: "https://www.edpb.europa.eu" },
  ],
  intro: [
    "Remote hiring processes look strange the first time. Instead of a conversation, you get a link asking you to record ninety-second answers to three questions, or a document with five written prompts, or a take-home exercise with a deadline.",
    "None of this is a hurdle for its own sake. Each format tests something a live conversation does not, and knowing which is which changes how you prepare.",
  ],
  sections: [
    {
      id: "why",
      h2: "Why remote companies use these formats",
      answer:
        "Three reasons: volume, time zones and fairness. An international opening attracts far more applicants than a local one, candidates cannot all be scheduled into overlapping hours, and structured formats let different reviewers assess the same answers rather than different conversations.",
      blocks: [
        {
          t: "p",
          text: "There is also a practical signal being tested. In a distributed team, most of your communication will be written or recorded rather than live. A process that assesses those skills is assessing the actual job, not a proxy for it.",
        },
        {
          t: "note",
          text: "Where automated scoring is involved, EU rules on automated decision-making give you the right to information about it and, in significant decisions, to human review. Asking how your submission is assessed is a legitimate question.",
        },
      ],
      takeaway:
        "These formats test the medium you will actually work in. Treat them as the job, not as an obstacle.",
    },
    {
      id: "one-way-video",
      h2: "The recorded video screen",
      answer:
        "You get a set of questions, a time limit per answer and usually one or two takes. It tests whether you can be clear and structured without the interviewer's help, which is exactly what an async team needs. Rambling is the failure mode, not nervousness.",
      blocks: [
        {
          t: "steps",
          items: [
            { title: "Prepare a structure, not a script", text: "Situation, what you did, result, in about sixty seconds. Memorised scripts sound memorised and collapse when the question shifts." },
            { title: "Fix the technical basics once", text: "Camera at eye level, light in front of you rather than behind, and the microphone closer than the laptop's. This costs ten minutes and is visible in every answer." },
            { title: "Answer the question first", text: "Lead with the answer, then the context. The reviewer may be watching at double speed and skipping the preamble." },
            { title: "Practise out loud, timed", text: "The gap between thinking an answer and saying it in sixty seconds is larger than anyone expects until they try." },
          ],
        },
        {
          t: "p",
          text: "Do not aim for polish. Reviewers are not comparing you to a presenter; they are comparing you to other candidates who mostly ramble. Clear and structured beats smooth.",
        },
      ],
      takeaway:
        "Answer first, context second, sixty seconds. Structure beats polish every time.",
    },
    {
      id: "written",
      h2: "The written round",
      answer:
        "Some companies replace the first call entirely with written questions. It is the most predictive stage for async roles and the one candidates most often underestimate, treating it as a form to fill rather than as a work sample being assessed on its own merits.",
      blocks: [
        {
          t: "ul",
          items: [
            "Write as you would to a colleague: context first, then the point, then the detail.",
            "Answer what was asked. Long answers that drift signal exactly the problem async teams fear.",
            "Use structure, headings and short paragraphs. How you organise a written answer is part of what is being read.",
            "Do not pad. A precise three-paragraph answer beats a thorough page every time.",
          ],
        },
        {
          t: "p",
          text: "If you use AI to help, use it to check structure rather than to generate the substance. Written rounds are where generated text is most visible, because the reviewer is reading closely and comparing several answers side by side.",
        },
      ],
      takeaway:
        "The written round is a work sample. Being organised counts as much as being right.",
    },
    {
      id: "take-home",
      h2: "The take-home assignment",
      answer:
        "A scoped exercise, usually with a stated time budget, testing how you approach a realistic problem. What is being assessed is rarely the answer alone: it is your assumptions, your prioritisation under a constraint, and how clearly you explain what you did and did not do.",
      blocks: [
        {
          t: "ol",
          items: [
            "Respect the stated time budget and say what you would have done with more. Overdelivering signals poor prioritisation, not enthusiasm.",
            "Write down your assumptions explicitly. Real briefs are ambiguous and how you handle ambiguity is the point.",
            "Include a short note explaining your reasoning and your trade-offs. Many candidates submit only the artefact.",
            "Say what you deliberately left out and why. It reads as judgement, not as gaps.",
          ],
        },
        {
          t: "note",
          text: "If the exercise looks like unpaid production work rather than an assessment, it is reasonable to ask. A scoped exercise of a few hours is normal; a full deliverable for their real client is not.",
        },
      ],
      takeaway:
        "The reasoning note matters more than the artefact. Most candidates omit it entirely.",
    },
    {
      id: "mistakes",
      h2: "What actually sinks candidates",
      answer:
        "Not nerves and not technical glitches. It is answering a different question than the one asked, exceeding the stated constraints, submitting without explaining any reasoning, and treating async stages as paperwork before the real interview rather than as the assessment itself.",
      blocks: [
        {
          t: "pros",
          pros: [
            "Answers that open with the answer.",
            "Explicit assumptions and stated trade-offs.",
            "Respecting time limits and scope.",
            "A short note explaining what you would do next.",
          ],
          cons: [
            "Ninety-second answers that spend fifty seconds on background.",
            "Take-homes three times the stated budget.",
            "Written answers with no structure and no paragraph breaks.",
            "Treating the async stage as a formality before the real conversation.",
          ],
        },
      ],
      takeaway:
        "The async stage is the assessment. Candidates who treat it as a formality are the ones filtered out.",
    },
  ],
  faqs: [
    { q: "Why do remote companies use recorded video interviews?", a: "Volume, time zones and consistency. International openings attract far more applicants, candidates cannot all be scheduled into overlapping hours, and structured formats let multiple reviewers assess the same answers." },
    { q: "How long should a recorded answer be?", a: "Around sixty seconds unless stated otherwise, structured as situation, what you did, result. Lead with the answer, because reviewers often watch at speed and skip preambles." },
    { q: "Can I redo a recorded answer?", a: "Usually once or twice, and the platform tells you. Do not aim for a perfect take: clear and structured outperforms smooth, and reviewers are comparing you to other candidates, not to presenters." },
    { q: "How much time should I spend on a take-home?", a: "The stated budget, and no more. Then note what you would do with additional time. Substantially overdelivering signals poor prioritisation rather than commitment." },
    { q: "Is it acceptable to ask whether the take-home is paid?", a: "Yes, particularly if it resembles production work for a real client rather than a scoped assessment. A few hours is normal; a complete deliverable is not." },
    { q: "Can I use AI in an async interview stage?", a: "Check whether the company states a policy. Using it to check structure is generally fine; generating the substance is highly visible in written rounds and undermines the sample being assessed." },
    { q: "What do written rounds test that a call does not?", a: "How you organise thinking without an interviewer helping you. In async teams most communication is written, so the written round is closer to the real job than a conversation is." },
    { q: "Do these processes use automated scoring?", a: "Some do. Under EU rules you have rights to information about automated decision-making and, in significant decisions, to human review. Asking how submissions are assessed is legitimate." },
    { q: "What technical setup do I need?", a: "Camera at eye level, light in front of you rather than behind, and a microphone closer than your laptop's. Ten minutes of setup improves every answer you record." },
    { q: "Should I follow up after an async stage?", a: "A short message confirming submission and offering to expand on anything is fine. Long follow-ups restating your answers do not help and can read as not trusting the process." },
  ],
  hero: { file: "/blog/pantalla-voz.svg", alt: "Diagram: a video screen beside the waveform of a recorded answer." },
};
