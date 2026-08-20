import type { Article } from "@/app/blog/types";

export const article: Article = {
  slug: "first-90-days-remote-team",
  locale: "en",
  cluster: "metodo",
  funnel: "tofu",
  intent: "informacional",
  keyword: "first 90 days remote job",
  secondary: [
    "remote onboarding checklist",
    "how to stand out in a distributed team",
    "starting a new remote job",
    "building relationships remotely",
    "remote onboarding mistakes",
  ],
  title: "Your First 90 Days on a Distributed Team",
  h1: "Your First 90 Days on a Distributed Team",
  metaTitle: "First 90 Days in a Remote Job: What Actually Matters",
  metaDescription:
    "Why remote onboarding fails differently, what to do in each of the first three months, how to build relationships without a corridor, and the mistakes that quietly define your reputation.",
  ogTitle: "Your First 90 Days on a Distributed Team",
  ogDescription:
    "Nobody learns by osmosis remotely. What to deliver, who to meet and what to write in each of the first three months.",
  published: "2026-07-07",
  updated: "2026-07-07",
  readingMinutes: 10,
  author: "ActiveXRemote Team",
  course: "remote-professional",
  terms: ["onboarding-distribuido", "documentacion-asincrona", "trabajo-asincrono", "burnout-remoto", "stack-remoto"],
  related: ["async-work-guide", "async-interview-and-video-screening", "remote-burnout-signals", "time-zone-overlap-explained"],
  external: [
    { label: "Eurofound · Telework and working conditions", url: "https://www.eurofound.europa.eu" },
    { label: "ILO · Practical guide on teleworking", url: "https://www.ilo.org" },
  ],
  intro: [
    "In an office, a new joiner absorbs an enormous amount by accident: who actually decides things, which projects are in trouble, what the unwritten rules are. None of that transfers by accident remotely.",
    "The consequence is that remote onboarding is not slower, it is different. What works is deliberate: small visible deliveries early, actively hunting for context nobody thought to give you, and building relationships that have no corridor to form in.",
  ],
  sections: [
    {
      id: "why-different",
      h2: "Why remote onboarding fails differently",
      answer:
        "Because the informal channel disappears. In an office, context arrives through overheard conversations and hallway questions. Remotely, if it was not written down or explicitly told to you, it does not reach you, and nobody realises you are missing it.",
      blocks: [
        {
          t: "p",
          text: "The second difference is visibility. In an office, being present reads as contributing. Remotely, only output is visible, which is harsher early on when you are still learning and have little output to show.",
        },
        {
          t: "table",
          head: ["What you get in an office", "What replaces it remotely"],
          rows: [
            ["Overheard context", "Reading the written record deliberately"],
            ["Hallway questions", "Asking explicitly, in public channels"],
            ["Visible presence", "Small, early, visible deliveries"],
            ["Informal relationships", "Scheduled one-to-ones with no agenda"],
          ],
        },
      ],
      takeaway:
        "Nothing arrives by accident. Everything you would have absorbed, you now have to go and get.",
    },
    {
      id: "month-one",
      h2: "Month one: context and one small delivery",
      answer:
        "The goal is not impact, it is orientation plus proof of life. Read the written record systematically, meet people individually, and ship one small, visible thing. That first delivery matters less for what it is than for establishing that you produce.",
      blocks: [
        {
          t: "ol",
          items: [
            "Read the last three months of decisions in the documentation, not just the onboarding pages.",
            "Book a thirty-minute call with everyone you will work with, with no agenda beyond understanding what they do and what frustrates them.",
            "Write down every question you could not answer from the record. That list is genuinely useful to whoever maintains it.",
            "Ship one small visible thing in the first three weeks, even if trivial.",
            "Ask your manager explicitly what success looks like at ninety days, and write down the answer.",
          ],
        },
        {
          t: "note",
          text: "Ask questions in public channels rather than direct messages. It feels more exposed and it is far better: the answer becomes searchable and you stop being a private drain on one person's time.",
        },
      ],
      takeaway:
        "One small shipped thing in three weeks buys you months of patience.",
    },
    {
      id: "month-two",
      h2: "Month two: from doing to owning",
      answer:
        "The shift is from completing assigned tasks to owning an area, however small. Owning means noticing problems before being told, proposing rather than asking, and being the person others route a category of question to.",
      blocks: [
        {
          t: "ul",
          items: [
            "Pick something nobody owns and start maintaining it. Unowned things are everywhere and taking one is the fastest route to being useful.",
            "Move from «what should I do?» to «I plan to do X unless you disagree». It is the async default-action habit applied to your own work.",
            "Start writing decisions down as you make them, even small ones. It builds the record and makes your thinking visible.",
            "Give feedback on something. New joiners see the things everyone else stopped noticing, and that window closes.",
          ],
        },
        {
          t: "p",
          text: "That last point has a short shelf life. The fresh-eyes observations you can make in month two are invisible to you by month six, so it is worth writing them down even if you do nothing with them yet.",
        },
      ],
      takeaway:
        "Owning one small unowned thing does more for your standing than completing ten assigned ones.",
    },
    {
      id: "relationships",
      h2: "Relationships without a corridor",
      answer:
        "They have to be deliberate, because there is no accidental contact. The mechanism that works is regular one-to-ones with no agenda, across teams rather than only within yours, accepting that some will feel awkward before they feel natural.",
      blocks: [
        {
          t: "p",
          text: "People often resist this as forced. It is forced, and it is also the only version available. The alternative is knowing only the people your work routes you through, which in a distributed company is a very small number.",
        },
        {
          t: "ul",
          items: [
            "Keep a rolling list of people you have not spoken to and work through it.",
            "Cross-team conversations pay off most: they are where you learn what is actually happening.",
            "Turn the camera on early in the relationship and stop worrying about it later.",
            "Notice who answers questions in public channels. Those are usually the people worth knowing.",
          ],
        },
      ],
      takeaway:
        "Deliberate and slightly awkward beats organic and nonexistent.",
    },
    {
      id: "mistakes",
      h2: "The mistakes that quietly set your reputation",
      answer:
        "Waiting to be given context, staying silent to avoid looking inexperienced, disappearing into a long project with nothing visible for weeks, and matching your hours to a time zone that is not yours because nobody told you not to.",
      blocks: [
        {
          t: "pros",
          pros: [
            "Asking in public and building the searchable record.",
            "Small visible deliveries while you learn.",
            "Writing down what confused you, which helps the next joiner.",
            "Setting your working hours explicitly in the first week.",
          ],
          cons: [
            "Waiting for onboarding to be done to you.",
            "Silence to avoid looking new, which reads as disengagement.",
            "Six weeks on something invisible.",
            "Drifting into permanent evening hours without ever deciding to.",
          ],
        },
        {
          t: "quote",
          text: "Remotely, nobody sees you working. They see what you finish and what you write.",
        },
      ],
      takeaway:
        "Silence and invisibility are the two failure modes. Both are avoidable in week one.",
    },
  ],
  faqs: [
    { q: "How is remote onboarding different from in-office?", a: "The informal channel disappears. Context that would arrive through overheard conversations and hallway questions has to be actively sought, and nobody notices when you are missing it." },
    { q: "What should I deliver in the first month?", a: "Something small and visible within about three weeks. Its value is not the work itself but establishing that you produce, which buys patience while you learn." },
    { q: "Should I ask questions publicly or privately?", a: "Publicly, in shared channels. It feels more exposed but the answer becomes searchable for the next person and you stop consuming one colleague's time privately." },
    { q: "How do I build relationships without an office?", a: "Deliberately: regular one-to-ones with no agenda, prioritising people outside your immediate team. It feels forced because it is, and it is the only version available." },
    { q: "How do I know if I am doing well?", a: "Ask your manager in the first month what success looks like at ninety days, and write the answer down. Without that, both of you are guessing." },
    { q: "What if the documentation is bad?", a: "Write down every question you could not answer from it. That list is valuable to whoever maintains the record and it makes your gap-finding visible rather than looking like slowness." },
    { q: "Should I turn my camera on?", a: "Early in a relationship, yes. It accelerates familiarity considerably. Once people know you, it matters much less and can be relaxed." },
    { q: "How do I avoid working other people's hours?", a: "Set and state your working hours in the first week, before habits form. Drifting into permanent evening availability happens gradually and is very hard to reverse later." },
    { q: "What if I am not given enough work?", a: "Find something unowned and start maintaining it. Unowned things exist in every team and taking one is the fastest path from new joiner to useful colleague." },
    { q: "When should I start giving feedback?", a: "In month two, while your fresh perspective still exists. The things you notice as a newcomer become invisible to you within a few months, so write them down even if you act later." },
  ],
  hero: { file: "/blog/rampa.svg", alt: "Diagram: three rising steps representing the first three months." },
};
