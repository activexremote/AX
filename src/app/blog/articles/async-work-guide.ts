import type { Article } from "@/app/blog/types";

export const article: Article = {
  slug: "async-work-guide",
  locale: "en",
  cluster: "metodo",
  funnel: "tofu",
  intent: "informacional",
  keyword: "asynchronous work",
  secondary: [
    "async communication examples",
    "how to run an async team",
    "async vs synchronous work",
    "written communication remote teams",
    "decision documentation",
  ],
  title: "Asynchronous Work: The Difference Between Being Remote and Working Remotely",
  h1: "Asynchronous Work: The Difference Between Being Remote and Working Remotely",
  metaTitle: "Asynchronous Work: How Distributed Teams Actually Operate",
  metaDescription:
    "What async work really requires beyond replying later: written context, recorded decisions, unblocking rules and the meetings worth keeping. With the failure modes that sink most teams.",
  ogTitle: "Asynchronous Work",
  ogDescription:
    "Async is not replying later. It is designing work so nobody is blocked waiting for you.",
  published: "2026-08-19",
  updated: "2026-08-19",
  readingMinutes: 11,
  author: "ActiveXRemote Team",
  terms: ["trabajo-asincrono", "documentacion-asincrona", "solapamiento-horario", "stack-remoto", "onboarding-distribuido"],
  related: ["time-zone-overlap-explained", "remote-work-stack", "first-90-days-remote-team"],
  external: [
    { label: "Eurofound · Telework and working conditions research", url: "https://www.eurofound.europa.eu" },
    { label: "ILO · Teleworking arrangements guidance", url: "https://www.ilo.org" },
  ],
  intro: [
    "Most companies that call themselves remote are simply co-located companies whose office happens to be a video call. Everyone still works the same hours, decisions still happen in meetings, and anyone outside that window is permanently behind.",
    "Async is the thing that actually makes distribution work, and it is a design discipline rather than a communication preference. This covers what it requires, what it costs, and where teams usually fail at it.",
  ],
  sections: [
    {
      id: "what-it-is",
      h2: "What async actually means",
      answer:
        "Async work means replies are not expected in real time and, crucially, that nobody is blocked while waiting for one. It relies on written context, recorded decisions and explicit deadlines, so each person can move forward within their own hours without needing anyone else awake.",
      blocks: [
        {
          t: "p",
          text: "The common misreading is that async means «I will get back to you later». That is just slow synchronous work. Real async means the request contained enough context to be actioned without a follow-up, and that the decision it produced was written down where the next person will find it.",
        },
        {
          t: "table",
          head: ["", "Synchronous by default", "Asynchronous by default"],
          rows: [
            ["Where decisions happen", "In meetings", "In documents, with a written owner"],
            ["What a question contains", "Enough to start a conversation", "Enough to be answered without one"],
            ["Who can contribute", "Whoever was in the room", "Anyone, within their own hours"],
            ["Cost of a new joiner", "Repeat the context verbally", "Point them at the record"],
            ["Failure mode", "People outside the window fall behind", "Silence gets mistaken for agreement"],
          ],
        },
      ],
      takeaway:
        "Async is not replying later. It is writing so that no reply is needed to proceed.",
    },
    {
      id: "writing",
      h2: "Writing with enough context",
      answer:
        "An async message has to survive being read eight hours later by someone who cannot ask a clarifying question. That means stating the situation, the decision needed, the options considered, your recommendation and the deadline, in that order and in one message.",
      blocks: [
        {
          t: "steps",
          items: [
            { title: "State the situation", text: "Two lines of context, assuming the reader has not been following. This is the part people skip and it is the one that costs a round trip." },
            { title: "State what you need", text: "A decision, a review, or information. Say which. «Thoughts?» is not a request." },
            { title: "Give the options", text: "What you considered and rejected, briefly. It stops the reader suggesting what you already ruled out." },
            { title: "Recommend", text: "Say what you would do. A message without a recommendation transfers the work to the reader." },
            { title: "Set the deadline", text: "«If I hear nothing by Thursday I will proceed with option B.» This is what keeps async from stalling." },
          ],
        },
        {
          t: "p",
          text: "That last line does more work than the rest combined. Without a default action, async collapses into waiting, and waiting is what makes people conclude that distributed teams are slow.",
        },
      ],
      takeaway:
        "Context, request, options, recommendation, deadline. Missing any one of them creates a round trip.",
    },
    {
      id: "decisions",
      h2: "Recording decisions, not conversations",
      answer:
        "The valuable artefact is the decision and the reasoning behind it, not the transcript of how you got there. A decision record states what was decided, what was rejected and why, so someone arriving six months later understands the constraints rather than reopening the debate.",
      blocks: [
        {
          t: "ul",
          items: [
            "Write what was decided, in one sentence, at the top.",
            "List the alternatives considered and the reason each was rejected.",
            "Name the person accountable, not the group.",
            "Date it, and note what would make you revisit it.",
          ],
        },
        {
          t: "p",
          text: "Teams without this rerun the same arguments every few months because nobody remembers what was already tried. The cost is invisible until you count the hours spent relitigating decisions that were settled a year earlier.",
        },
      ],
      takeaway:
        "Record the reasoning, not the conversation. Reasoning is what stops the debate reopening.",
    },
    {
      id: "meetings",
      h2: "Which meetings survive",
      answer:
        "Async does not mean no meetings. It means meetings are reserved for what genuinely needs simultaneity: disagreement that has stalled in writing, relationship building, and anything requiring rapid back-and-forth. Status updates and information broadcasts should never be meetings.",
      blocks: [
        {
          t: "pros",
          pros: [
            "Keep: unresolved disagreement after a written round.",
            "Keep: one-to-ones and anything relational.",
            "Keep: early exploration where the question is not yet clear.",
            "Keep: incident response and anything genuinely urgent.",
          ],
          cons: [
            "Drop: status updates, which belong in a document.",
            "Drop: information broadcasts, which belong in a recording.",
            "Drop: meetings with no written agenda and no decision required.",
            "Drop: recurring meetings nobody has questioned in six months.",
          ],
        },
        {
          t: "note",
          text: "A practical test: if the meeting could be replaced by a document plus comments without losing anything, it should be. If the honest answer is that people would not read the document, the problem is the culture, not the format.",
        },
      ],
      takeaway:
        "Meetings for disagreement and relationships. Documents for everything else.",
    },
    {
      id: "failures",
      h2: "Where async teams actually fail",
      answer:
        "Three failure modes recur. Silence gets read as agreement when it means nobody looked. Written communication becomes so voluminous that nobody reads it. And people who are good at synchronous influence keep making decisions in side channels the record never captures.",
      blocks: [
        {
          t: "ol",
          items: [
            "Silence as consent: fix it with explicit default actions and named reviewers rather than open broadcasts.",
            "Volume: fix it by making brevity a norm and by separating what must be read from what is available if needed.",
            "Side channels: fix it by requiring that any decision taken in a call gets written up before it counts.",
            "Timezone drift: fix it by rotating meeting times so the same people are not always the ones staying up.",
          ],
        },
        {
          t: "quote",
          text: "Async fails when it is only a policy. It works when the default action is written down and someone owns it.",
        },
      ],
      takeaway:
        "The three killers are assumed consent, unread volume, and decisions made off the record.",
    },
  ],
  faqs: [
    { q: "What is asynchronous work?", a: "A way of coordinating teams where replies are not expected in real time and nobody is blocked waiting for one. It relies on written context, recorded decisions and explicit deadlines so people can progress within their own hours." },
    { q: "Is async the same as remote?", a: "No. Remote is about location, async is about coordination. Plenty of remote companies run entirely synchronously, which is why people in other time zones end up permanently behind." },
    { q: "Does async mean no meetings at all?", a: "No. It means meetings are reserved for stalled disagreement, relationship building and genuinely urgent matters. Status updates and information broadcasts should be documents or recordings." },
    { q: "How do I write a good async message?", a: "Context, the specific request, the options you considered, your recommendation, and a deadline with a default action. The default action is what keeps async from stalling into waiting." },
    { q: "How do you stop silence being treated as agreement?", a: "Name specific reviewers rather than broadcasting to a group, and state what happens if nobody responds by the deadline. Open requests to everyone are answered by nobody." },
    { q: "Does async work slow decisions down?", a: "Badly implemented, yes: it becomes waiting. Well implemented it is faster, because decisions do not queue behind the next available meeting slot." },
    { q: "What tools does async need?", a: "Fewer than people assume. A place for documents, a place for discussion, a task tracker and a recording tool. What matters is having one source of truth per type of information, not the specific products." },
    { q: "How do new joiners cope without verbal context?", a: "Better than in synchronous teams, if the record is good. Written decisions with their reasoning let someone reconstruct months of context in days rather than absorbing it slowly through meetings." },
    { q: "How much overlap does an async team need?", a: "Two to four hours is common and usually enough for the meetings that genuinely require simultaneity. Teams needing more than that are typically synchronous teams that have not admitted it." },
    { q: "Can async work for creative or exploratory work?", a: "Partly. Early exploration where the question is still forming benefits from real-time conversation. Once the question is clear, written iteration usually produces better thinking than another call." },
  ],
};
