import type { Article } from "@/app/blog/types";

export const article: Article = {
  slug: "remote-work-stack",
  locale: "en",
  cluster: "herramientas",
  funnel: "tofu",
  intent: "informacional",
  keyword: "remote work tools",
  secondary: [
    "best tools for distributed teams",
    "remote work tech stack",
    "async collaboration tools",
    "tool sprawl problem",
    "single source of truth documentation",
  ],
  title: "The Minimum Remote Stack: 12 Tools and Not One More",
  h1: "The Minimum Remote Stack: 12 Tools and Not One More",
  metaTitle: "Remote Work Stack: The Minimum Set of Tools That Works",
  metaDescription:
    "Which categories a distributed team genuinely needs, why tool sprawl destroys more productivity than missing features, and how to decide what lives where so information stays findable.",
  ogTitle: "The Minimum Remote Stack",
  ogDescription:
    "Fewer, well-connected tools beat many half-used ones. The categories that matter and the rules that keep them useful.",
  published: "2026-06-23",
  updated: "2026-06-23",
  readingMinutes: 11,
  author: "ActiveXRemote Team",
  terms: ["stack-remoto", "documentacion-asincrona", "automatizacion-no-code", "trabajo-asincrono", "agente-ia"],
  related: ["no-code-automation-for-solopreneurs", "first-90-days-remote-team", "async-work-guide", "async-interview-and-video-screening"],
  external: [
    { label: "European Union Agency for Cybersecurity · Secure remote working", url: "https://www.enisa.europa.eu" },
    { label: "European Data Protection Board · Processor guidance", url: "https://www.edpb.europa.eu" },
  ],
  intro: [
    "Every remote team eventually has the same problem, and it is never a missing feature. It is that the answer to a question exists in four places, three of them stale, and nobody is sure which one is current.",
    "A stack is not a list of products. It is a set of decisions about what lives where and who is responsible for keeping it true. This covers the categories that genuinely matter and the rules that keep them from collapsing into sprawl.",
  ],
  sections: [
    {
      id: "categories",
      h2: "The categories a distributed team actually needs",
      answer:
        "Six: real-time communication, documentation, task tracking, file storage, meetings with recording, and automation. Everything else is either a specialisation of one of these or an optional extra. Most teams have twenty tools covering six categories, which is the problem rather than the solution.",
      blocks: [
        {
          t: "table",
          head: ["Category", "What it must do", "What breaks without it"],
          rows: [
            ["Communication", "Channels by topic, threaded, searchable", "Decisions live in direct messages and vanish"],
            ["Documentation", "One source of truth, versioned, linkable", "The same question gets answered four times"],
            ["Task tracking", "Owner, state and deadline visible", "Work stalls invisibly between people"],
            ["Storage", "Shared, permissioned, findable", "Files live on individual laptops"],
            ["Meetings", "Recording and transcript by default", "Absence from a call means absence from context"],
            ["Automation", "Connects the other five", "People become the integration layer"],
          ],
        },
        {
          t: "p",
          text: "Note that none of these rows names a product. Which tool fills a row matters far less than the row having exactly one occupant. Two documentation tools is worse than a mediocre single one.",
        },
      ],
      takeaway:
        "Six categories, one occupant each. That constraint matters more than which products you pick.",
    },
    {
      id: "sprawl",
      h2: "Why tool sprawl costs more than missing features",
      answer:
        "Because every additional tool multiplies the places information could be, and the cost is paid on every search by every person forever. A team with four overlapping tools does not have four times the capability. It has four times the ambiguity about where things belong.",
      blocks: [
        {
          t: "ul",
          items: [
            "Onboarding time rises: a new joiner has to learn not just the tools but the unwritten conventions about which is used for what.",
            "Search fails: the answer exists but in the tool nobody thought to check.",
            "Trust erodes: once one source is known to be stale, all of them get treated as suspect.",
            "Cost accumulates quietly: per-seat pricing across many tools adds up while each individually looks cheap.",
          ],
        },
        {
          t: "note",
          text: "The signal to watch for is people asking «where should I put this?». When that question has no obvious answer, you have sprawl regardless of how many tools there are.",
        },
      ],
      takeaway:
        "The cost of an extra tool is not its price. It is one more place to look and one more thing to doubt.",
    },
    {
      id: "rules",
      h2: "The rules that keep a stack usable",
      answer:
        "Three: one source of truth per type of information, an explicit convention for what gets discussed where, and a rule that anything decided in a call gets written up before it counts. Without the third, the documentation quietly becomes fiction.",
      blocks: [
        {
          t: "steps",
          items: [
            { title: "Assign each information type one home", text: "Decisions here, project status there, files in one place. Write the mapping down and put it where new joiners land." },
            { title: "Define channel conventions", text: "What belongs in a channel versus a document versus a direct message. Ambiguity here is what pushes decisions into private conversations." },
            { title: "Require write-up after calls", text: "A decision that only exists in a recording does not exist for anyone who was not there. Someone owns writing it down." },
            { title: "Prune quarterly", text: "Ask which tools nobody has opened in a month. There is usually at least one, and removing it costs nothing." },
          ],
        },
      ],
      takeaway:
        "Write down where things live. Unwritten conventions are the ones new joiners cannot follow.",
    },
    {
      id: "solo",
      h2: "If you work alone, the stack is smaller",
      answer:
        "A solo operator needs four things, not six: somewhere to write, somewhere to track work, somewhere to keep files, and something to automate the repetitive parts. Communication is your clients' tools, and meeting recording matters mainly for your own recall.",
      blocks: [
        {
          t: "p",
          text: "The temptation when working alone is to adopt the tooling of a company you are not. A solo consultant running a project management system designed for forty people spends more time maintaining it than the visibility is worth.",
        },
        {
          t: "pros",
          pros: [
            "One writing tool that handles notes, documents and client-facing pages.",
            "One task list you actually open daily.",
            "One storage location, with a naming convention you keep.",
            "One automation tool connecting the intake of work to the tracking of it.",
          ],
          cons: [
            "A separate tool for notes, docs, wiki and knowledge base.",
            "Project management built for teams you do not have.",
            "Three storage locations because each client uses a different one.",
            "Automations built before the process is stable.",
          ],
        },
      ],
      takeaway:
        "Alone, four categories are enough. Adopting team tooling creates maintenance without benefit.",
    },
    {
      id: "security",
      h2: "The part everyone skips",
      answer:
        "Access management. Working remotely means credentials travel, devices are personal, and offboarding is nobody's visible responsibility. A password manager and a documented list of who has access to what solve most of the risk at a trivial cost.",
      blocks: [
        {
          t: "ol",
          items: [
            "Use a password manager for anything shared. Credentials sent over chat outlive the conversation and the person.",
            "Turn on two-factor authentication everywhere it is offered, especially email, which is the recovery route for everything else.",
            "Keep a written list of which accounts exist and who administers them.",
            "Have an offboarding checklist before you need one. Reconstructing access after someone leaves is far harder." ,
          ],
        },
        {
          t: "p",
          text: "For anyone handling client data, this stops being hygiene and becomes an obligation: processor agreements and access controls are what those contracts assume you already have.",
        },
      ],
      takeaway:
        "A password manager and a written access list cover most of the real risk.",
    },
  ],
  faqs: [
    { q: "What tools does a remote team actually need?", a: "Six categories: real-time communication, documentation, task tracking, file storage, meetings with recording, and automation. Which products fill them matters far less than each category having exactly one occupant." },
    { q: "Why is having many tools a problem?", a: "Because each one multiplies the places information could be, and that cost is paid on every search by every person. Four overlapping tools give four times the ambiguity, not four times the capability." },
    { q: "How do I know if my team has tool sprawl?", a: "Listen for «where should I put this?». When that question has no obvious answer, you have sprawl regardless of the tool count." },
    { q: "What is a single source of truth?", a: "One agreed location per type of information, so there is never a question about which copy is current. Without it, stale copies erode trust in all copies." },
    { q: "Do I need project management software if I work alone?", a: "Rarely the kind built for teams. A solo operator needs a task list they actually open, not a system whose maintenance costs more than the visibility it provides." },
    { q: "Should meetings be recorded by default?", a: "In distributed teams, yes. Without recordings and transcripts, being absent from a call means being absent from the context, which is what excludes people in other time zones." },
    { q: "How often should we review the stack?", a: "Quarterly is enough. The useful question is which tools nobody has opened in a month, and removing those costs nothing." },
    { q: "What is the minimum security setup for remote work?", a: "A password manager for shared credentials, two-factor authentication everywhere, a written list of accounts and administrators, and an offboarding checklist prepared before it is needed." },
    { q: "Is it worth paying for tools or using the cheapest options?", a: "Judge by whether the tool holds a category well and integrates with the others. The expensive mistake is not the subscription, it is adopting a second tool because the first was never properly configured." },
    { q: "How do I migrate without losing information?", a: "Move one category at a time, keep the old system readable but read-only for a period, and redirect people explicitly. Parallel writable systems are how sprawl starts." },
  ],
  hero: { file: "/blog/pila.svg", alt: "Diagram: four stacked layers, each narrower than the one beneath it." },
};
