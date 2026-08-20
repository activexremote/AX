import type { Article } from "@/app/blog/types";

export const article: Article = {
  slug: "ats-friendly-resume",
  locale: "en",
  cluster: "empleo",
  funnel: "mofu",
  intent: "informacional",
  keyword: "ats friendly resume",
  secondary: [
    "how to beat applicant tracking systems",
    "resume format that passes ats",
    "why am i not getting interviews",
    "ats resume checker",
    "resume keywords from job description",
  ],
  title: "The ATS-Friendly Resume: What Machines Read Before Humans Do",
  h1: "The ATS-Friendly Resume: What Machines Read Before Humans Do",
  metaTitle: "ATS-Friendly Resume: Format, Keywords and What Breaks Parsing",
  metaDescription:
    "What an applicant tracking system extracts from your resume, which formatting choices break it, and how to write achievements that survive both the parser and the recruiter.",
  ogTitle: "The ATS-Friendly Resume",
  ogDescription:
    "Columns, tables and image PDFs quietly destroy applications. Here is the format that gets through and the wording that gets read.",
  published: "2026-04-21",
  updated: "2026-04-21",
  readingMinutes: 11,
  author: "ActiveXRemote Team",
  course: "remote-professional",
  terms: ["ats", "cv-internacional", "portfolio-internacional", "marca-personal"],
  related: ["proof-of-work-portfolio", "ai-for-job-search", "async-interview-and-video-screening", "negotiating-remote-salary"],
  external: [
    { label: "W3C · Structured document accessibility", url: "https://www.w3.org/WAI/" },
    { label: "European Commission · Europass CV guidance", url: "https://europa.eu/europass/en" },
    { label: "EURES · Applying for jobs across Europe", url: "https://eures.europa.eu" },
  ],
  intro: [
    "You apply to twenty roles and hear nothing. The comfortable explanation is that the market is brutal. The likelier one is that a parser read your resume, could not work out where you worked or when, and ranked you below people it could read.",
    "This is not about tricking software. It is about not handing it a document it cannot process, and then writing the content so a human who does open it stays for more than eight seconds.",
  ],
  sections: [
    {
      id: "what-ats-does",
      h2: "What an applicant tracking system actually does",
      answer:
        "An ATS ingests your file, parses it into structured fields such as employer, title, dates, skills and education, and ranks candidates so recruiters can filter. In most configurations it does not auto-reject. It sorts. Anything it fails to extract simply does not exist for the filter.",
      blocks: [
        {
          t: "p",
          text: "The «robots reject you» framing is mostly folklore. What actually happens is quieter: your five years at a company become a blank field because the dates sat in a sidebar, and you get ranked as a candidate with unclear experience against candidates whose experience parsed cleanly.",
        },
        {
          t: "table",
          head: ["Parses reliably", "Parses badly", "Breaks parsing"],
          rows: [
            ["Single-column text", "Icons with adjacent text", "Merged table cells"],
            ["Standard section headings", "Invented headings", "Text inside images"],
            ["Month and year dates", "Year-only dates", "Graphic timelines"],
            ["Text-based PDF or DOCX", "Unusual embedded fonts", "Scanned or image-exported PDF"],
          ],
        },
      ],
      takeaway:
        "Anything the parser cannot extract is, for practical purposes, unwritten.",
    },
    {
      id: "format",
      h2: "The format that survives",
      answer:
        "One column, standard headings, reverse chronological order. Name and target title at the top, a three-line summary, then experience with quantified achievements, tools by their exact names, and education last. No sidebars, no rating bars, no tables.",
      blocks: [
        {
          t: "steps",
          items: [
            { title: "Header", text: "Name, target job title, city and country, email, phone with country code, and links to portfolio and professional profile. Nothing else." },
            { title: "Summary", text: "Three lines: what you do, for which kind of company, with what measurable result. It is the one part always read." },
            { title: "Experience", text: "Company, title, month and year range. Then three to five bullets that open with a verb and close with a number." },
            { title: "Tools", text: "The exact names used in the job post. No percentages, no star ratings: either you list it or you do not." },
            { title: "Education", text: "Last, unless you graduated recently. Degree, institution, year." },
          ],
        },
        {
          t: "note",
          text: "Two pages maximum, one if you have under ten years of experience. Anything that does not fit belongs in the portfolio, not in a smaller font size.",
        },
      ],
      takeaway:
        "Boring, standard headings. Save the creativity for the content.",
    },
    {
      id: "keywords",
      h2: "Keywords: match the posting, do not stuff it",
      answer:
        "Use the exact vocabulary of the job description where it is genuinely true of you. If they write «Employer of Record», write that, not «international hiring». Parsers match strings; recruiters skim for the same words. Stuffing hidden text is detected and treated as manipulation.",
      blocks: [
        {
          t: "ul",
          items: [
            "Pull ten to fifteen terms from the posting: tools, methodologies, domain nouns, seniority markers.",
            "Place them where they belong: in achievements and in the tools section, not in a keyword dump at the bottom.",
            "Match the form used in the post. «CI/CD» and «continuous delivery» are not the same string.",
            "Never use white text or zero-width characters. Modern systems flag it and many employers treat it as fraud.",
          ],
        },
        {
          t: "p",
          text: "Tailoring does not mean rewriting the document for every application. Change the target title, the three-line summary and the order of the tools list. That takes ten minutes and moves you materially up the ranking.",
        },
      ],
      takeaway:
        "Mirror the posting's exact words where they are true. That is the whole technique.",
    },
    {
      id: "achievements",
      h2: "From duties to achievements",
      answer:
        "Most resumes list responsibilities, which read identically across every candidate. Achievements carry a number: how much, over what period, compared to what. Without the number, a recruiter has no way to distinguish you from the next application.",
      blocks: [
        {
          t: "table",
          head: ["Usually written as", "Reads far better as"],
          rows: [
            ["Responsible for client account management", "Managed 40 accounts and lifted renewal from 71% to 84% in a year"],
            ["Tasked with improving internal processes", "Documented six recurring processes, cutting delivery time from 9 to 5 days"],
            ["Involved in platform development", "Led the checkout migration, reducing payment errors by 30%"],
          ],
        },
        {
          t: "p",
          text: "If you genuinely have no numbers, use scale instead: team size, volume handled, geographic scope, budget. What does not work is the empty verb. «Collaborated», «participated» and «supported» sink more applications than any formatting problem.",
        },
      ],
      takeaway:
        "Verb first, number last. If there is no number, give the scale.",
    },
    {
      id: "mistakes",
      h2: "The mistakes that quietly cost you interviews",
      answer:
        "In order of frequency: exporting the file as an image, which strips every extractable field; using a two-column template that interleaves your sections; ignoring the posting's exact vocabulary; sending one identical document to every opening; and naming the file something nobody reviewing fifty applications can identify.",
      blocks: [
        {
          t: "ol",
          items: [
            "A PDF exported from a design tool as an image: nothing is extracted and you are eliminated before anyone reads a word.",
            "Sidebar templates: skills and experience get interleaved into nonsense.",
            "Using synonyms instead of the posting's terms, so the match score drops for no reason.",
            "One file for every application, when adapting the title and summary takes ten minutes.",
            "Filenames like «resume_final_v3.pdf». Use name, surname and role." ,
          ],
        },
        {
          t: "quote",
          text: "A resume is not a biography. Its only job is to make someone decide to spend fifteen minutes on you.",
        },
      ],
      takeaway:
        "Most silent rejections are formatting failures, not capability failures.",
    },
  ],
  faqs: [
    { q: "Do applicant tracking systems automatically reject resumes?", a: "Rarely. Most configurations rank and filter rather than auto-rejecting. The practical effect is the same though: if the parser cannot extract your experience, you rank below candidates it could read." },
    { q: "Should I include a photo on my resume?", a: "Not for English-speaking markets. Many companies strip or discard photos under anti-discrimination policies. Continental Europe still expects one in some countries, so keep two versions if you apply across markets." },
    { q: "PDF or Word?", a: "A text-based PDF unless the posting asks otherwise. Avoid PDFs exported as images from design tools, which are unreadable to parsers." },
    { q: "How long should a resume be?", a: "One page under ten years of experience, two at most beyond that. Anything that does not fit belongs in a portfolio rather than in smaller type." },
    { q: "Does putting white keywords on a white background work?", a: "No, and it backfires. Modern systems detect it and many employers treat it as an attempt to manipulate the process." },
    { q: "How do I tailor my resume without rewriting it every time?", a: "Change only the target title, the three-line summary and the order of the tools list so they mirror the posting. The rest stays as it is." },
    { q: "What do I do about employment gaps?", a: "State them with one line of context rather than hiding them. Unexplained gaps generate more questions than explained ones." },
    { q: "Should I translate my previous employers' names?", a: "No. Keep proper names as they are, and add a short line describing the sector and company size, which nobody outside your country will recognise." },
    { q: "Are skill rating bars useful?", a: "No. «85% Python» communicates nothing verifiable and the graphic often breaks parsing. List the tool or leave it out." },
    { q: "Is a cover letter still worth writing?", a: "Only when specific. Three lines connecting your experience to that role's actual problem outperform a long generic letter, which is usually skipped." },
  ],
  hero: { file: "/blog/criba-candidatura.svg", alt: "Diagram: a resume passes through a filter slot and comes out as what the machine can read." },
};
