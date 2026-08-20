import type { Article } from "@/app/blog/types";

export const article: Article = {
  slug: "remote-burnout-signals",
  locale: "en",
  cluster: "metodo",
  funnel: "tofu",
  intent: "informacional",
  keyword: "remote work burnout signs",
  secondary: [
    "setting boundaries working remotely",
    "always on culture remote",
    "remote work exhaustion",
    "how to switch off working from home",
    "burnout prevention distributed teams",
  ],
  title: "Remote Burnout: The Signals That Show Up Before Exhaustion",
  h1: "Remote Burnout: The Signals That Show Up Before Exhaustion",
  metaTitle: "Remote Work Burnout: Early Signs and What Actually Helps",
  metaDescription:
    "The early indicators that appear before tiredness, why time zone overlap is the most underestimated risk factor, and the structural changes that work better than self-discipline.",
  ogTitle: "Remote Burnout: The Signals Before Exhaustion",
  ogDescription:
    "Loss of judgement and difficulty starting tasks come before tiredness. What to change, structurally.",
  published: "2026-07-14",
  updated: "2026-07-14",
  readingMinutes: 10,
  author: "ActiveXRemote Team",
  terms: ["burnout-remoto", "solapamiento-horario", "trabajo-asincrono", "onboarding-distribuido"],
  related: ["time-zone-overlap-explained", "async-work-guide", "first-90-days-remote-team", "async-interview-and-video-screening"],
  external: [
    { label: "World Health Organization · Burn-out in ICD-11", url: "https://www.who.int" },
    { label: "EU-OSHA · Psychosocial risks and stress at work", url: "https://osha.europa.eu" },
    { label: "Eurofound · Right to disconnect", url: "https://www.eurofound.europa.eu" },
  ],
  intro: [
    "Remote burnout does not announce itself as tiredness. It shows up first as a strange difficulty starting things you know how to do, and as decisions that take three times longer than they should for no obvious reason.",
    "By the time exhaustion is the main symptom, it has usually been building for months. This covers the earlier signals, the structural causes that self-discipline cannot fix, and what actually changes the trajectory.",
  ],
  sections: [
    {
      id: "early-signals",
      h2: "The signals that come before tiredness",
      answer:
        "Three appear early and consistently: difficulty starting tasks you are perfectly capable of doing, decisions that suddenly feel disproportionately hard, and a flattening of interest where things that used to engage you now feel like admin.",
      blocks: [
        {
          t: "p",
          text: "These are easy to misread as motivation problems, which is why people respond by trying harder. That is the wrong intervention: capacity for judgement is depleting, and adding effort accelerates the depletion.",
        },
        {
          t: "ul",
          items: [
            "Opening a task, reading it, and closing it again without starting, repeatedly.",
            "Small decisions taking a long time or being deferred indefinitely.",
            "Working longer while producing less, and knowing it.",
            "Irritation at routine interruptions that never used to register.",
            "Weekends stopping being restorative even when nothing happens in them.",
          ],
        },
        {
          t: "note",
          text: "Burnout is recognised as an occupational phenomenon arising from chronic workplace stress that has not been successfully managed. It is a condition of the work situation, not a character weakness.",
        },
      ],
      takeaway:
        "Loss of judgement precedes exhaustion. If decisions feel heavy, that is the signal.",
    },
    {
      id: "causes",
      h2: "What causes it specifically in remote work",
      answer:
        "Four structural factors: no boundary between working space and living space, availability stretched across time zones, invisible work that goes unacknowledged, and the absence of the informal social contact that buffers stress in an office.",
      blocks: [
        {
          t: "table",
          head: ["Factor", "How it operates", "What actually helps"],
          rows: [
            ["No spatial boundary", "The workspace never stops being visible", "A physical or ritual end to the day"],
            ["Time zone stretch", "Availability expands to cover everyone", "Fixed hard stop, rotating meeting times"],
            ["Invisible work", "Effort that produces no visible artefact goes unrecognised", "Writing down what you did, for yourself as much as others"],
            ["Social buffer missing", "No incidental contact to discharge stress", "Deliberate non-work conversation, scheduled"],
          ],
        },
        {
          t: "p",
          text: "The time zone factor is the most underestimated. Accepting meetings at any hour so as not to be «the difficult one» fragments the day until no block of deep work survives, and it happens gradually enough that nobody notices deciding it.",
        },
      ],
      takeaway:
        "Excessive overlap is the strongest structural predictor, and it is the one nobody names.",
    },
    {
      id: "structure",
      h2: "Why structure beats discipline",
      answer:
        "Because willpower is exactly the resource being depleted. Rules that depend on you deciding correctly every evening fail precisely when you most need them. Changes that hold are the ones that do not require a decision: calendar blocks, device separation, agreed team norms.",
      blocks: [
        {
          t: "ol",
          items: [
            "Put a recurring calendar block at the end of your day and let it decline meetings automatically.",
            "Separate devices or accounts if you can. Notifications you cannot see do not require discipline to ignore.",
            "Agree a team norm rather than a personal one: «no meetings after 17:00 CET» holds better than your individual preference.",
            "Schedule the recovery, do not leave it to whatever energy remains at the end of the week.",
          ],
        },
        {
          t: "quote",
          text: "Any boundary that requires you to be disciplined at 19:00 will fail on the days you most need it.",
        },
      ],
      takeaway:
        "Design the constraint so it does not need your willpower to work.",
    },
    {
      id: "conversation",
      h2: "How to raise it at work",
      answer:
        "As a workload and structure conversation rather than a personal one. «I cannot sustain four hours of evening overlap and here is what I propose instead» is actionable. «I am burnt out» is true but leaves your manager with no lever to pull.",
      blocks: [
        {
          t: "steps",
          items: [
            { title: "Bring the specific cause", text: "Name the meetings, the hours or the workload. General exhaustion is hard for anyone to act on." },
            { title: "Bring a proposal", text: "A different window, a rotating schedule, fewer concurrent projects. Managers can accept proposals more easily than problems." },
            { title: "Give a timeframe", text: "«For the next two months» is easier to agree than an open-ended change." },
            { title: "Escalate if nothing changes", text: "Several jurisdictions recognise a right to disconnect and employers carry duties on psychosocial risk. This is not only a personal matter." },
          ],
        },
      ],
      takeaway:
        "Bring the cause and a proposal. Managers act on proposals, not on symptoms.",
    },
    {
      id: "recovery",
      h2: "What recovery actually requires",
      answer:
        "More than a holiday. Time off restores energy but not the conditions, so returning to the same structure reproduces the same result within weeks. Recovery means changing what caused it, which is usually workload volume, meeting hours or the absence of a boundary.",
      blocks: [
        {
          t: "p",
          text: "This is the most common mistake: treating rest as the intervention. Two weeks away from an unchanged situation is a pause, not a solution, and the disappointment of relapsing shortly after returning is itself demoralising.",
        },
        {
          t: "ul",
          items: [
            "Change one structural thing before you take the time off, so you return to something different.",
            "Reduce concurrent commitments rather than trying to do the same amount faster.",
            "Rebuild the non-work contact that disappeared, which is usually the first thing dropped.",
            "If the signals persist after structural change, treat it as a health matter and seek professional support.",
          ],
        },
      ],
      takeaway:
        "Rest without changing the conditions is a pause. Change one structural thing first.",
    },
  ],
  faqs: [
    { q: "What are the early signs of remote burnout?", a: "Difficulty starting tasks you can easily do, small decisions feeling disproportionately hard, and a flattening of interest. These precede tiredness, which is why they get misread as motivation problems." },
    { q: "Is remote work more likely to cause burnout than office work?", a: "Not inherently, but it removes some buffers and adds specific risks: no spatial boundary, availability stretched across time zones, and less incidental social contact to discharge stress." },
    { q: "Why does time zone overlap matter so much?", a: "Because availability expands gradually to cover everyone. Accepting meetings at any hour to avoid being difficult fragments the day until no deep work block survives, and the drift is slow enough to go unnoticed." },
    { q: "Why doesn't discipline work?", a: "Because willpower is the resource being depleted. Boundaries that require you to decide correctly every evening fail exactly on the days you most need them." },
    { q: "What structural changes actually help?", a: "Calendar blocks that decline meetings automatically, device or account separation, and team-level norms rather than personal ones. Anything that does not require a decision in the moment." },
    { q: "How do I raise this with my manager?", a: "As a workload and structure conversation with a specific cause and a concrete proposal, with a timeframe. Managers can act on proposals; general exhaustion leaves them no lever." },
    { q: "Will a holiday fix it?", a: "It restores energy but not the conditions. Returning to an unchanged structure reproduces the same state within weeks, which is why changing one structural thing before the break matters." },
    { q: "Is burnout a medical diagnosis?", a: "It is classified as an occupational phenomenon arising from chronic workplace stress that has not been successfully managed, rather than as a medical condition. Persistent symptoms still warrant professional support." },
    { q: "Do employers have obligations here?", a: "In many jurisdictions yes: duties around psychosocial risk assessment, and in several countries a recognised right to disconnect. It is not purely a personal matter." },
    { q: "How do I rebuild after taking time off?", a: "Return to something structurally different, reduce concurrent commitments rather than working faster, and deliberately rebuild the non-work contact that usually disappeared first." },
  ],
  hero: { file: "/blog/onda-decreciente.svg", alt: "Diagram: a wave losing amplitude from a marked point onwards." },
};
