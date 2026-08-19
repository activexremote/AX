import type { Article } from "@/app/blog/types";

export const article: Article = {
  slug: "digital-nomad-visa-comparison",
  locale: "en",
  cluster: "fiscalidad",
  funnel: "tofu",
  intent: "informacional",
  keyword: "digital nomad visa comparison",
  secondary: [
    "best digital nomad visas",
    "digital nomad visa income requirement",
    "digital nomad visa vs tourist visa",
    "remote work visa requirements",
    "does a nomad visa change my taxes",
  ],
  title: "Digital Nomad Visas Compared: Income Thresholds and Hidden Catches",
  h1: "Digital Nomad Visas Compared: Income Thresholds and Hidden Catches",
  metaTitle: "Digital Nomad Visa Comparison: What They Really Require",
  metaDescription:
    "What every nomad visa asks for, how the income thresholds differ, the conditions people miss, and why a residence permit is not the same thing as a tax arrangement.",
  ogTitle: "Digital Nomad Visas Compared",
  ogDescription:
    "Income proof, insurance, local-client rules and the tax question nobody reads until later.",
  published: "2026-08-19",
  updated: "2026-08-19",
  readingMinutes: 11,
  author: "ActiveXRemote Team",
  terms: ["visado-nomada-digital", "nomada-digital", "residencia-fiscal", "regla-183-dias", "trabajo-remoto"],
  related: ["tax-residency-remote-workers", "international-remote-jobs-from-europe", "employer-of-record-vs-contractor"],
  external: [
    { label: "European Commission · Immigration portal", url: "https://immigration-portal.ec.europa.eu" },
    { label: "European Commission · Your Europe: residence rights", url: "https://europa.eu/youreurope/citizens/residence/index_en.htm" },
    { label: "OECD · International migration policy", url: "https://www.oecd.org/migration/" },
  ],
  intro: [
    "Dozens of countries now issue some form of remote work visa, and the marketing around them is considerably clearer than the paperwork. The headline is always the lifestyle. The details that decide whether you qualify, and what it costs you afterwards, are further down.",
    "Rather than listing countries whose rules change every few months, this covers what these permits have in common, where they differ in ways that matter, and the questions to answer before applying anywhere.",
  ],
  sections: [
    {
      id: "what-they-are",
      h2: "What a digital nomad visa actually is",
      answer:
        "It is a residence permit allowing you to live in a country while working remotely for employers or clients based outside it. It is immigration permission, not a tax arrangement, and it usually prohibits or restricts working for companies inside the host country.",
      blocks: [
        {
          t: "p",
          text: "That last restriction surprises people. The logic is straightforward from the country's perspective: they want your spending without you competing in their labour market. If your plan involves local clients, most of these permits are the wrong instrument.",
        },
        {
          t: "note",
          text: "A nomad visa and a tourist entry are not interchangeable. Working remotely on a tourist stamp is a grey area in many countries and explicitly prohibited in some, regardless of where your employer sits.",
        },
      ],
      takeaway:
        "It is a residence permit with a work restriction attached, not a tax status.",
    },
    {
      id: "common-requirements",
      h2: "What almost all of them require",
      answer:
        "Four things recur: proof of remote income above a threshold, private health insurance valid in the country, a clean criminal record, and evidence that your work comes from outside. The variation is in the numbers and the paperwork, not in the shape of the requirements.",
      blocks: [
        {
          t: "table",
          head: ["Requirement", "What is usually asked", "Where people get stuck"],
          rows: [
            ["Income", "Several months of bank statements plus contracts", "Irregular freelance income failing a monthly minimum"],
            ["Employment proof", "Contract or client agreements showing foreign source", "Contractors with no formal written contracts"],
            ["Health insurance", "Private cover valid locally for the permit duration", "Policies excluding the destination or expiring early"],
            ["Criminal record", "Apostilled certificate from your country of residence", "Apostille and translation timelines"],
            ["Accommodation", "Address or rental agreement", "Chicken-and-egg with needing the permit to rent"],
          ],
        },
        {
          t: "p",
          text: "The apostille and translation step is where most timelines slip. It is administrative rather than difficult, but it runs on government schedules rather than yours, and it cannot usually be started from the destination.",
        },
      ],
      takeaway:
        "Nothing here is hard. The document chain is what takes months, so start it first.",
    },
    {
      id: "differences",
      h2: "Where they differ in ways that matter",
      answer:
        "Four dimensions decide whether a permit suits you: the income threshold, the duration and renewability, whether family members can join, and whether it creates a path to longer-term residence. Two permits with similar marketing can differ enormously on all four.",
      blocks: [
        {
          t: "ul",
          items: [
            "Income threshold: ranges widely, and some are indexed to local minimum wage so they move each year.",
            "Duration: from six months to several years, with very different renewal conditions.",
            "Dependants: some include spouse and children with a higher income requirement, others exclude them entirely.",
            "Path to permanence: a few count towards long-term residence, most do not, which matters if you are considering staying.",
          ],
        },
        {
          t: "note",
          text: "Check the indexing question specifically. A threshold tied to local wages can rise between your application and your renewal, which is how people end up not qualifying for a permit they already hold.",
        },
      ],
      takeaway:
        "Compare on threshold, duration, dependants and whether it leads anywhere. The rest is marketing.",
    },
    {
      id: "tax",
      h2: "The tax question these permits do not answer",
      answer:
        "Holding a nomad visa does not determine where you pay tax. Residence permits and tax residency are separate systems with separate tests, and in most countries staying long enough to hold the permit will also make you tax resident there under the ordinary rules.",
      blocks: [
        {
          t: "p",
          text: "Some countries do pair the permit with a favourable tax regime for an initial period. Those are genuine benefits, but they are separate legal instruments with their own conditions, and they are frequently misdescribed in summaries aimed at newcomers.",
        },
        {
          t: "ol",
          items: [
            "Establish whether the permit itself carries any tax treatment, or whether ordinary residency rules apply.",
            "Check how long you can stay before becoming tax resident under local tests.",
            "Check whether your current country will consider you to have left, which depends on more than day counts.",
            "Confirm there is a double tax treaty between the two, and read its employment income article.",
          ],
        },
      ],
      takeaway:
        "The visa answers where you may live. It says nothing about who taxes you.",
    },
    {
      id: "worth-it",
      h2: "Who these permits actually suit",
      answer:
        "People with stable, documented remote income who want to stay somewhere for a year or more. They suit poorly anyone moving every few months, anyone whose income is irregular or informally contracted, and anyone whose clients are in the destination country.",
      blocks: [
        {
          t: "pros",
          pros: [
            "Legal certainty: you are not working on a tourist entry.",
            "Access to local services such as banking and long-term rental.",
            "Longer stays than ordinary visitor entry allows.",
            "Sometimes a favourable tax regime, where one is attached.",
          ],
          cons: [
            "Administrative cost and several months of lead time.",
            "Income thresholds that exclude early-career and irregular earners.",
            "Restrictions on local clients.",
            "Tax residency consequences that arrive whether you planned for them or not.",
          ],
        },
        {
          t: "quote",
          text: "These permits reward people who were going to stay anyway. They rarely reward people optimising for movement.",
        },
      ],
      takeaway:
        "If you are moving every three months, this is paperwork without benefit. If you are staying a year, it is worth it.",
    },
  ],
  faqs: [
    { q: "What is a digital nomad visa?", a: "A residence permit letting you live in a country while working remotely for employers or clients based outside it. It is immigration permission, not a tax arrangement, and it usually restricts working for local companies." },
    { q: "Can I just work remotely on a tourist visa?", a: "It is a grey area in many countries and explicitly prohibited in some. The location of your employer does not settle it: what matters is where you are physically working." },
    { q: "How much income do these visas require?", a: "It varies widely and several thresholds are indexed to local wages, so they move annually. Check whether the figure is indexed before applying, because it can rise before your renewal." },
    { q: "Does a nomad visa change where I pay tax?", a: "Not by itself. Residence permits and tax residency are separate systems. Staying long enough to use the permit will usually make you tax resident there under ordinary rules." },
    { q: "Can I bring my family?", a: "Some permits include dependants with a higher income requirement, others exclude them entirely. It is one of the four dimensions worth checking before comparing anything else." },
    { q: "Can I work for clients in the country that issued the visa?", a: "Usually not, or only in limited circumstances. These permits are designed to attract foreign income without competing in the local labour market." },
    { q: "How long does the application take?", a: "Typically two to four months, and the bottleneck is document preparation: apostilles, translations and criminal record certificates run on government timelines rather than yours." },
    { q: "Does time on a nomad visa count towards permanent residence?", a: "In a few countries yes, in most no. If staying long term is a possibility, this is the question that matters most and it is rarely prominent in the marketing." },
    { q: "What happens when the visa expires?", a: "It depends on renewability, which varies. Some renew straightforwardly if you still meet the conditions, others are single-term and require leaving or switching to a different permit." },
    { q: "Do I need health insurance even with public coverage at home?", a: "Almost always yes. These permits require private cover valid locally for the full duration, and policies that exclude the destination or expire mid-term are a common rejection reason." },
  ],
};
