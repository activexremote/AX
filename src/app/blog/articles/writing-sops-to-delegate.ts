import type { Article } from "@/app/blog/types";

export const article: Article = {
  slug: "writing-sops-to-delegate",
  locale: "en",
  cluster: "negocio",
  funnel: "tofu",
  intent: "informacional",
  keyword: "how to write sops",
  secondary: [
    "sop template small business",
    "documenting processes to delegate",
    "standard operating procedure example",
    "process documentation for freelancers",
    "how to delegate work effectively",
  ],
  title: "Writing SOPs You Can Actually Hand Over",
  h1: "Writing SOPs You Can Actually Hand Over",
  metaTitle: "How to Write SOPs That Someone Else Can Follow",
  metaDescription:
    "Why most process documents fail the moment someone else uses them, what a usable SOP contains, how to write one while working, and how to keep them from going stale.",
  ogTitle: "Writing SOPs You Can Actually Hand Over",
  ogDescription:
    "The test is simple: can an outsider follow it and get the same result without asking anything?",
  published: "2026-08-04",
  updated: "2026-08-04",
  readingMinutes: 10,
  author: "ActiveXRemote Team",
  course: "remote-founder",
  terms: ["sop", "documentacion-asincrona", "automatizacion-no-code", "oferta-productizada", "solopreneur"],
  related: ["productised-service-business", "no-code-automation-for-solopreneurs", "b2b-clients-without-network", "remote-work-stack"],
  external: [
    { label: "ISO · Quality management principles", url: "https://www.iso.org" },
    { label: "European Commission · SME digitalisation resources", url: "https://single-market-economy.ec.europa.eu" },
  ],
  intro: [
    "Almost everyone who has tried to delegate has had the same experience: you write down how to do something, hand it over, and spend more time answering questions than the task would have taken you.",
    "The document was not the problem. It was written from memory, in the order you happened to remember, missing the decisions you make without noticing you make them. This covers what a usable SOP contains and how to produce one that survives contact with somebody else.",
  ],
  sections: [
    {
      id: "why-fail",
      h2: "Why most process documents fail",
      answer:
        "Because they are written afterwards, from memory, by the person who already knows the answers. Memory smooths over the exceptions, skips the judgement calls made automatically, and describes the happy path as though it were the only path.",
      blocks: [
        {
          t: "p",
          text: "There is a name for the underlying problem: once you are competent at something, the decisions you make become invisible to you. You genuinely cannot recall choosing, because it no longer feels like a choice. Those invisible decisions are exactly what the next person gets stuck on.",
        },
        {
          t: "table",
          head: ["What the document says", "What the reader hits"],
          rows: [
            ["«Check the file is correct»", "Correct according to what?"],
            ["«Send it to the client»", "Which channel, which template, copying whom?"],
            ["«Use the standard settings»", "Where are they, and standard for which case?"],
            ["«If there is a problem, escalate»", "What counts as a problem?"],
          ],
        },
      ],
      takeaway:
        "Competence hides decisions. Writing from memory documents the steps and loses the judgement.",
    },
    {
      id: "what-contains",
      h2: "What a usable SOP contains",
      answer:
        "Five things: the trigger that starts it, the ordered steps in enough detail to follow without prior knowledge, the decisions with their criteria, what typically goes wrong and what to do about it, and how you know the result is correct.",
      blocks: [
        {
          t: "steps",
          items: [
            { title: "The trigger", text: "What causes this process to start. «When a signed contract arrives» is a trigger; «onboarding» is a title." },
            { title: "The ordered steps", text: "Numbered, each one action. If a step contains «and», it is probably two steps." },
            { title: "The decision points", text: "Where the reader has to choose, with the criteria you use. This is the part memory omits." },
            { title: "The known failures", text: "What goes wrong most often and what to do. It turns a stuck reader into an unstuck one." },
            { title: "The definition of done", text: "How anyone can verify the output is right without asking you." },
          ],
        },
        {
          t: "note",
          text: "The decision criteria matter more than the steps. Steps can be inferred from watching; criteria cannot, and they are what separates a document that works from one that generates questions.",
        },
      ],
      takeaway:
        "Trigger, steps, decisions with criteria, known failures, definition of done.",
    },
    {
      id: "how-write",
      h2: "How to write one without it taking a week",
      answer:
        "Write it during the next real execution, not as a separate project. Keep a document open and record each action as you take it, including the moments you paused to decide. It adds perhaps twenty per cent to that one run and produces something usable.",
      blocks: [
        {
          t: "ol",
          items: [
            "Open a blank document before starting the task, not after finishing it.",
            "Record every action as you take it, in plain language, including the obvious ones.",
            "Every time you pause to think, write down what you were deciding and what tipped it.",
            "At the end, add the definition of done and anything that went wrong this time.",
            "On the next run, follow your own document and fix what does not work.",
          ],
        },
        {
          t: "p",
          text: "That fifth step is not optional. The first version always contains gaps invisible to its author, and following it yourself is the cheapest way to find them before someone else does.",
        },
      ],
      takeaway:
        "Write while doing, then follow your own document once. Two runs produce something handoverable.",
    },
    {
      id: "test",
      h2: "The test that tells you it works",
      answer:
        "Hand it to someone who has never done the task and watch without helping. Every question they ask marks a gap. If they finish and produce the same result without asking anything, the document is done. Until then, each question is your next edit.",
      blocks: [
        {
          t: "p",
          text: "Resisting the urge to help during this test is the hard part, and it is where the value is. Answering verbally repairs that one instance and leaves the document exactly as broken as it was.",
        },
        {
          t: "pros",
          pros: [
            "Watch silently and write down every question asked.",
            "Test with someone genuinely unfamiliar with the task.",
            "Fix the document rather than explaining the answer.",
            "Retest after editing, at least once.",
          ],
          cons: [
            "Testing with someone who already knows the process.",
            "Answering questions instead of noting them.",
            "Assuming a document you wrote is clear because it is clear to you.",
            "Declaring it finished after the first pass.",
          ],
        },
      ],
      takeaway:
        "Every question is a gap. Fix the document, not the moment.",
    },
    {
      id: "maintenance",
      h2: "Keeping them from going stale",
      answer:
        "Stale documentation is worse than none, because people follow it and get wrong results. The practical defence is small: an owner named on each document, a last-reviewed date, and a rule that whoever hits an error fixes the document as part of fixing the problem.",
      blocks: [
        {
          t: "ul",
          items: [
            "Put a named owner on every document. Shared ownership means nobody updates it.",
            "Date every review, so readers can judge how much to trust it.",
            "Make correcting the document part of resolving any error, not a separate task for later.",
            "Delete documents for processes you no longer run. A wrong document is worse than a missing one.",
          ],
        },
        {
          t: "quote",
          text: "A document nobody trusts costs more than no document, because people follow it before discovering it is wrong.",
        },
      ],
      takeaway:
        "Named owner, review date, and fixing the doc as part of fixing the error.",
    },
  ],
  faqs: [
    { q: "What is an SOP?", a: "A written, step-by-step description of how a recurring task is performed, detailed enough that another person or an automation produces the same result without depending on whoever usually does it." },
    { q: "Why do my process documents not work when I hand them over?", a: "Because they were written from memory. Once you are competent, the decisions you make become invisible to you, and those invisible judgement calls are exactly where the next person gets stuck." },
    { q: "How long should an SOP be?", a: "As long as it needs, but each step should be one action. If a step contains «and», it is usually two steps, and that is where readers lose the thread." },
    { q: "When should I write one?", a: "While executing the task, not afterwards. Recording actions as you take them adds about twenty per cent to that run and produces something usable immediately." },
    { q: "How do I know if my SOP is good enough?", a: "Give it to someone unfamiliar with the task and watch without helping. If they produce the same result without asking anything, it works. Every question they ask is your next edit." },
    { q: "Should I include screenshots?", a: "Sparingly, for interfaces that are hard to describe. Screenshots go stale faster than text and updating them is what usually stops documents being maintained." },
    { q: "Who should own an SOP?", a: "One named person. Shared ownership reliably results in nobody updating it, and an unmaintained document eventually becomes misleading rather than merely incomplete." },
    { q: "How often should they be reviewed?", a: "Whenever the process changes, plus a light periodic check. The more practical rule is that whoever hits an error fixes the document as part of fixing the problem." },
    { q: "Are SOPs only useful if I have employees?", a: "No. They are what makes delegation, automation and selling a productised service possible, and they are also what lets you return to an infrequent task without relearning it." },
    { q: "What is the difference between an SOP and a checklist?", a: "A checklist confirms steps were done by someone who already knows how. An SOP teaches someone who does not, which is why it needs decision criteria and failure handling." },
  ],
  hero: { file: "/blog/procedimiento.svg", alt: "Diagram: three numbered steps turning into a handover document." },
};
