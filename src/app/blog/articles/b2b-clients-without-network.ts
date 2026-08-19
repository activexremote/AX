import type { Article } from "@/app/blog/types";

export const article: Article = {
  slug: "b2b-clients-without-network",
  locale: "en",
  cluster: "negocio",
  funnel: "bofu",
  intent: "comercial",
  keyword: "get b2b clients internationally",
  secondary: [
    "cold email b2b that works",
    "finding international clients as a freelancer",
    "outbound prospecting for consultants",
    "how to find decision makers",
    "sales proposal for services",
  ],
  title: "Landing International B2B Clients With No Network",
  h1: "Landing International B2B Clients With No Network",
  metaTitle: "Getting B2B Clients Internationally Without a Network",
  metaDescription:
    "How to choose a narrow enough niche, build a list of people who actually decide, write a first message that gets answered, and keep prospecting running without it eating the week.",
  ogTitle: "Landing International B2B Clients With No Network",
  ogDescription:
    "Niche, list, message, follow-up. The four decisions behind outbound that actually converts.",
  published: "2026-08-19",
  updated: "2026-08-19",
  readingMinutes: 12,
  author: "ActiveXRemote Team",
  course: "remote-founder",
  terms: ["negocio-borderless", "oferta-productizada", "marca-personal", "solopreneur"],
  related: ["productised-service-business", "getting-paid-internationally", "no-code-automation-for-solopreneurs"],
  external: [
    { label: "European Data Protection Board · Direct marketing guidance", url: "https://www.edpb.europa.eu" },
    { label: "European Commission · Commercial communications rules", url: "https://commission.europa.eu" },
    { label: "Enterprise Europe Network · Internationalisation support", url: "https://een.ec.europa.eu" },
  ],
  intro: [
    "With no network in a market, referrals do not happen and content takes months to pay off. What is left is direct outbound, which has a poor reputation mostly because almost everyone does it badly.",
    "The channel is rarely the problem. Writing to the wrong person, about a problem they do not have, with an offer that needs a half-hour call to understand, is the problem. This covers the four decisions underneath it.",
  ],
  sections: [
    {
      id: "niche",
      h2: "The niche first, and narrower than feels sensible",
      answer:
        "Without a network, specificity is the only advantage available. A message naming the sector, the company size and the exact problem gets read. One offering general services to any business competes with the rest of the day's inbox and loses.",
      blocks: [
        {
          t: "p",
          text: "A useful niche is not «SMEs» or «startups». It is a sentence the reader recognises as their own situation: «marketing agencies of 10 to 40 people who bill hourly and are trying to close the scope on their projects».",
        },
        {
          t: "steps",
          items: [
            { title: "Review your last ten engagements", text: "Find the pattern: company type, size, problem. The niche is usually already in your history, not in your ambition." },
            { title: "Write the problem in their words", text: "Not «process optimisation» but what they would actually say: «every project starts from scratch and we lose margin»." },
            { title: "Check there is volume", text: "If a search turns up fifteen companies, the niche is too narrow to sustain prospecting." },
            { title: "Check they can pay", text: "A niche with the problem but no budget produces pleasant conversations and no contracts." },
          ],
        },
      ],
      takeaway:
        "Specificity substitutes for reputation. It is the only thing that offsets knowing nobody.",
    },
    {
      id: "list",
      h2: "Building the list and finding who decides",
      answer:
        "The right recipient is whoever feels the problem and holds budget, which in mid-sized companies is almost never the chief executive. Writing to the head of the function rather than the top of the org chart multiplies reply rates, because the problem belongs to them.",
      blocks: [
        {
          t: "ul",
          items: [
            "Define the target role before searching for names: head of operations, marketing, engineering, depending on who hurts.",
            "Prioritise companies showing a signal that the problem is live: an open vacancy for that function, a recent leadership change, a launch.",
            "Verify addresses before sending. A list full of bounces damages your domain reputation and lands you in spam.",
            "Work in small batches of twenty to forty and review results before scaling.",
          ],
        },
        {
          t: "note",
          text: "Business-to-business outreach is permitted in most European jurisdictions, but with conditions: identify yourself clearly, be able to explain where the contact came from, and offer a working opt-out. Writing to individuals' personal addresses follows stricter rules.",
        },
      ],
      takeaway:
        "Fewer contacts, better chosen, with a signal the problem is alive right now.",
    },
    {
      id: "message",
      h2: "The first message: short, specific, no meeting request",
      answer:
        "An effective first message fits in a phone preview, references something specific about that company, states the problem in their terms and ends with a question answerable in one word. Asking for thirty minutes upfront is what sinks most sequences.",
      blocks: [
        {
          t: "table",
          head: ["What does not work", "What does"],
          rows: [
            ["«We are a leading consultancy in...»", "One line proving you looked at their specific situation"],
            ["Three paragraphs explaining your method", "One line on the problem, one on the typical outcome"],
            ["«Do you have 30 minutes this week?»", "«Is this something happening for you right now?»"],
            ["A twelve-page deck attached", "A link to a two-minute case, at most"],
            ["Five identical automated follow-ups", "Two follow-ups that each add something new"],
          ],
        },
        {
          t: "p",
          text: "Follow-up is where most conversations actually close, but only when it adds. «Just following up» adds nothing; a concrete example of how a comparable company solved it does.",
        },
      ],
      takeaway:
        "Make the reply cost one word. Ask for the meeting once interest exists, not before.",
    },
    {
      id: "proposal",
      h2: "From conversation to proposal",
      answer:
        "With a fixed-scope offer, the proposal stops being a bespoke document and becomes a confirmation: the problem identified, what the package includes, what it excludes, timeline and price. It fits on one page and gets decided in days rather than weeks.",
      blocks: [
        {
          t: "ol",
          items: [
            "Restate the problem using the words the client used on the call. If they do not recognise it, you misunderstood the brief.",
            "List the concrete deliverable, not the methodology.",
            "Write the exclusions explicitly. That is what prevents the month-three argument.",
            "Give a fixed timeline and price, no ranges.",
            "Add a validity date and the next step in one line.",
          ],
        },
        {
          t: "quote",
          text: "A long proposal does not signal rigour. It signals that you still do not know what you are going to deliver.",
        },
      ],
      takeaway:
        "If explaining the offer takes twelve pages, the problem is the offer.",
    },
    {
      id: "sustain",
      h2: "Keeping it running without losing the week",
      answer:
        "Prospecting fails through intermittency: done intensely when work is scarce, abandoned when it is not, so the cycle repeats every few months. A small, constant rhythm of two or three blocked hours a week outperforms panic campaigns.",
      blocks: [
        {
          t: "ul",
          items: [
            "Block two fixed weekly slots and treat them like a client deliverable.",
            "Keep a live pipeline: contacted, replied, in conversation, proposal sent, closed.",
            "Review the numbers monthly: contacts, replies, calls, closes. Without them you cannot tell what to fix.",
            "Automate only the mechanical parts: reminders, base templates, logging. Personalisation is what makes it work.",
          ],
        },
        {
          t: "p",
          text: "And keep the conversations that do not close now. A meaningful share of contracts come from people who said «not right now» months earlier and were followed up by someone who remembered.",
        },
      ],
      takeaway:
        "Small and constant beats intense and intermittent. Every time.",
    },
  ],
  faqs: [
    { q: "Does cold email still work for international B2B?", a: "Yes, when it is specific. A short message aimed at the person who feels the problem, referencing their company concretely and ending with a one-word question, gets replies. Generic mass sends do not." },
    { q: "Is it legal to email businesses that never asked to hear from me?", a: "In most European jurisdictions business-to-business outreach is permitted with conditions: identify yourself clearly, be able to explain the source of the contact, and provide a working opt-out. Personal addresses of individuals follow stricter rules." },
    { q: "How many contacts does it take to close one client?", a: "It varies by niche and deal size, so measure your own ratios from the start: contacts, replies, calls, closes. Working without those numbers makes it impossible to know which step to fix." },
    { q: "Who should I write to inside the company?", a: "Whoever feels the problem and holds budget, which in mid-sized companies is the head of the function rather than the chief executive. The problem has to be theirs for the message to matter." },
    { q: "How many follow-ups should I send?", a: "Two usually suffice, provided each adds something new: an example, a data point, an observation about their situation. Resending the same message reduces replies and damages your brand." },
    { q: "Do I need a website before prospecting?", a: "You need somewhere people can verify who you are and what you have done. A plain page with two explained cases is enough; an elaborate site with no cases adds nothing." },
    { q: "How do I compete when nobody knows me in that market?", a: "With specificity and proof. One well-explained case in the client's exact sector replaces local reputation better than any corporate deck." },
    { q: "Should I lower my price to enter a new market?", a: "Reduce scope before price. A small, fixed first package opens the relationship without setting a low reference point that is very hard to raise later." },
    { q: "Which language should I write in?", a: "The one of the market you are targeting, written well. A message in English with obvious errors costs more credibility than a simple, correct one." },
    { q: "Is LinkedIn useful for international prospecting?", a: "It is useful for verifying roles, spotting signals that a problem is live and warming a contact. As a direct-message channel its reply rate is more erratic than well-targeted email." },
  ],
};
