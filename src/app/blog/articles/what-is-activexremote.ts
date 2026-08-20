import type { Article } from "@/app/blog/types";

// Post 1, versión inglesa. Ver la nota de que-es-activexremote.ts: es la
// misma pieza, no una traducción literal —las referencias y los ejemplos se
// ajustan al lector internacional.
export const article: Article = {
  slug: "what-is-activexremote",
  locale: "en",
  cluster: "metodo",
  funnel: "mofu",
  intent: "navegacional",
  keyword: "what is ActiveXRemote",
  secondary: [
    "international remote work school",
    "remote work manifesto",
    "borderless work training",
    "Remote Professional Remote Founder",
    "ActiveXRemote reviews",
  ],
  title: "What ActiveXRemote is, and why it exists",
  h1: "What ActiveXRemote is, and why it exists",
  metaTitle: "What is ActiveXRemote: manifesto, method and who it's for",
  metaDescription:
    "The international remote work school: why it exists, the principles behind it, what the two paths are and what you leave with. No life-changing promises.",
  ogTitle: "What ActiveXRemote is, and why it exists",
  ogDescription:
    "Manifesto, values and method of an international remote work school. Numbers and limits stated up front.",
  published: "2026-03-24",
  updated: "2026-08-18",
  readingMinutes: 9,
  author: "ActiveXRemote Team",
  terms: [
    "trabajo-remoto",
    "negocio-borderless",
    "employer-of-record",
    "residencia-fiscal",
    "trabajo-asincrono",
    "solopreneur",
  ],
  related: ["b2b-clients-without-network", "international-remote-jobs-from-europe", "productised-service-business", "digital-nomad-visa-comparison"],
  external: [
    { label: "Eurofound · Telework and hybrid work in the EU", url: "https://www.eurofound.europa.eu" },
    { label: "ILO · Teleworking and working conditions", url: "https://www.ilo.org" },
    { label: "European Commission · Digital Skills and Jobs Platform", url: "https://digital-skills-jobs.europa.eu" },
  ],
  intro: [
    "ActiveXRemote is a school for international remote work. It does not teach you to use Zoom. It teaches you to compete for a job paid in another currency, to collect that money without losing a quarter of it on the way, and to build a business that doesn't depend on where you sleep.",
    "This is the first article on the blog, and it works as the front door. It explains where the school comes from, the principles behind it, what you actually receive and — this matters — who it isn't for.",
  ],
  sections: [
    {
      id: "manifesto",
      h2: "The manifesto: remote doesn't fail because of distance",
      answer:
        "ActiveXRemote comes from one repeated observation: remote teams and remote careers don't fail because of distance, but because nobody taught anyone to work this way. The office gets moved into the house, meetings and presenteeism included, and then the model gets blamed for the result.",
      blocks: [
        {
          t: "quote",
          text: "Remote doesn't fail because of distance. It fails when we don't adapt to this way of working.",
          by: "ActiveXRemote manifesto",
        },
        {
          t: "p",
          text: "Distance is a fact, not a problem. The problem starts when you try to do remotely exactly what you did in an office: decide in meetings, measure by visible hours and communicate out loud, leaving no trace.",
        },
        {
          t: "p",
          text: "Working without borders is a craft with its own rules. You write in order to decide, you document so you don't repeat yourself, and you defend your focus because nobody else will. None of that is intuitive and almost nobody has studied it.",
        },
        {
          t: "p",
          text: "On top of that sits a layer the office never had: cross-border contracts, tax residence, getting paid in several currencies, and time zones that decide whether anyone calls you. Talent isn't enough when the system is unknown.",
        },
      ],
      takeaway: "Remote isn't the office from home. It's a different craft, and it can be learned.",
    },
    {
      id: "values",
      h2: "Four principles you can check",
      answer:
        "A value you cannot verify is a slogan. These four translate into concrete decisions in the program: deliverables instead of notes, numbers instead of adjectives, limits stated up front, and the market's real tools.",
      blocks: [
        {
          t: "steps",
          items: [
            {
              title: "You leave with deliverables, not notes",
              text: "Every module produces something that exists outside the campus: a resume that clears the filter, a published portfolio, a payment structure that works. If all you have at the end is notes, the module failed.",
            },
            {
              title: "The number replaces the adjective",
              text: "14 modules. 56 live hours. 14 weeks. Groups of 25. No «transformative learning experience»: numbers can be checked, adjectives cannot.",
            },
            {
              title: "The limits come first",
              text: "We issue the diploma ourselves and it is not an official degree. We do not guarantee employment. And the syllabus says what it does not cover. People who decide with full information complain less and get more out of it.",
            },
            {
              title: "You study with the market's own tools",
              text: "The contracts analysed are real contracts; the job posts are posts that are live. You work on the platforms actually in use, not on sample screenshots.",
            },
          ],
        },
      ],
      takeaway: "If a principle doesn't change a decision in the program, it isn't a principle.",
    },
    {
      id: "two-paths",
      h2: "Two paths, one shared core",
      answer:
        "The program has 14 modules: 7 shared core and 7 specialised. The core covers what anyone working without borders needs. Then you pick a path: Remote Professional if you want a job, Remote Founder if you're building a business. You can take both.",
      blocks: [
        {
          t: "p",
          text: "The core is not introductory filler. These are the seven modules almost nobody studies and that decide the outcome: mindset and the global market, geo-positioning and tax, relocation, the tool stack, AI productivity, energy and health, and legal fundamentals.",
        },
        {
          t: "table",
          head: ["", "Remote Professional", "Remote Founder"],
          rows: [
            ["Who it's for", "Employees and contractors", "Founders, freelancers and solopreneurs"],
            ["What it targets", "A better-paid international remote job", "A business that runs without you in front of it"],
            ["Own modules", "Sourcing, AI-assisted applications, personal brand, interview, negotiation, first 90 days, fractional roles", "Design and validation, AI in operations, B2B clients, offer and page, SOPs and systems, automation, corporate structure"],
            ["Final deliverable", "An application that competes abroad", "A sellable offer and the system behind it"],
          ],
        },
        {
          t: "note",
          text: "Both paths share the 7 core modules. Taking both does not mean repeating half the program.",
        },
      ],
      takeaway: "Everyone takes the core. You choose the specialisation.",
    },
    {
      id: "method",
      h2: "What a class actually looks like",
      answer:
        "Each module is a 4-hour live session, one a week for 14 weeks. The session has four fixed parts: context, a technical deep-dive on the real tool, a workshop on your own case, and questions with next steps.",
      blocks: [
        {
          t: "ol",
          items: [
            "Context: why this decides the outcome and what is shifting in the market.",
            "Technical deep-dive: the tool or the framework, on screen and working.",
            "Workshop: you apply it to your case, not to an invented example.",
            "Questions and next step: what you do this week before the next session.",
          ],
        },
        {
          t: "p",
          text: "Sessions are recorded and stay in the campus with narrated audio and the module materials. Support between sessions runs on Slack, which is also one of the tools studied.",
        },
        {
          t: "pros",
          pros: [
            "Live: you can ask about your specific case",
            "Groups of 25: there is time for everyone",
            "Recorded: missing a week doesn't drop you",
            "One reviewed deliverable per module",
          ],
          cons: [
            "It asks for 4 fixed hours a week for 14 weeks",
            "The workshop doesn't work if you don't bring your case",
            "It isn't self-paced: the cohort moves together",
          ],
        },
      ],
      takeaway: "One 4-hour session a week, 14 weeks, and a deliverable each time.",
    },
    {
      id: "who-its-not-for",
      h2: "Who it isn't for",
      answer:
        "It isn't for anyone looking for passive income or a fast method. Nor for anyone who needs to study at their own pace, nor for anyone expecting the diploma to replace experience. Saying so up front saves a wrong enrolment.",
      blocks: [
        {
          t: "ul",
          items: [
            "If you're after passive income or a shortcut, this program will disappoint you: everything it teaches takes work.",
            "If you need to move at your own pace, a cohort with fixed hours will get in your way.",
            "If you expect a private certification to open doors on its own, it won't. What opens doors is the deliverable you leave with.",
            "If your problem is craft rather than context — you don't yet master what you want to sell — that comes first.",
          ],
        },
        {
          t: "note",
          text: "We published an entire article with criteria for evaluating any remote work course, ours included. It's linked at the end.",
        },
      ],
      takeaway: "A program that can't say who it isn't for doesn't know who it is for.",
    },
    {
      id: "about-this-blog",
      h2: "What this blog is and how to use it",
      answer:
        "The blog publishes one guide a week on the same topics as the program: employment, tax, legal, business, method and tools. Each guide answers one concrete question and links to the dictionary terms it takes for granted.",
      blocks: [
        {
          t: "p",
          text: "It follows the same rule as the classes: the answer first, the detail after. Every section opens by resolving the question in four or five lines, so it's useful even if you read no further.",
        },
        {
          t: "p",
          text: "The dictionary is the other half. It collects the terms that show up in any international remote process — Employer of Record, tax residence, time zone overlap — with a short definition and a long one. When an article uses one, it links to it.",
        },
        {
          t: "ul",
          items: [
            "Starting out: the guide to international remote jobs from Europe.",
            "Path already clear: the articles in your cluster, employment or business.",
            "About to pay for training: the criteria for spotting real training.",
            "Lost on a term: look it up in the A-to-Z dictionary.",
          ],
        },
      ],
      takeaway: "One guide a week. The answer first, the detail after.",
    },
  ],
  faqs: [
    { q: "What exactly is ActiveXRemote?", a: "A school for international remote work. It runs a 14-module live program with two paths: Remote Professional, to land an international remote job, and Remote Founder, to build a borderless business." },
    { q: "Is it recorded or live?", a: "Live. One 4-hour session a week for 14 weeks, in groups of 25. Sessions are recorded and stay in the campus with narrated audio, but the class is delivered live and the workshop works on your own case." },
    { q: "Is the diploma an official degree?", a: "No. It is a private certification issued by ActiveXRemote: it lists the modules you completed and the teaching hours. It is not equivalent to a university or official academic degree." },
    { q: "Do I need prior knowledge?", a: "No. The 7 core modules start from scratch and the specialisation levels up progressively. What does help is bringing a case of your own to the workshop: your application, your service or your idea." },
    { q: "Can I take both paths?", a: "Yes. They share the 7 core modules, so taking both doesn't mean repeating half the program. The enrolment page has a specific option for both courses." },
    { q: "Do you guarantee I'll find work?", a: "No, and be wary of anyone who does. What is guaranteed is the deliverable: you leave with the application, the portfolio and the negotiation strategy built and reviewed. The outcome also depends on the market and on you." },
    { q: "Where is the company based?", a: "ActiveX FZC LLC is incorporated in the United Arab Emirates and directs the program at people resident in the European Union, so the GDPR applies. Full details are in the legal notice." },
    { q: "How often do you publish?", a: "One guide a week, in Spanish and English. Each version has its own address: the Spanish ones sit at the root and the English ones under /en." },
  ],
  hero: {
    file: "/blog/manifiesto.svg",
    alt: "Diagram: one origin from which two paths branch after sharing their first stretch.",
  },
};
