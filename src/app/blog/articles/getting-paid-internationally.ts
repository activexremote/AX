import type { Article } from "@/app/blog/types";

export const article: Article = {
  slug: "getting-paid-internationally",
  locale: "en",
  cluster: "fiscalidad",
  funnel: "mofu",
  intent: "informacional",
  keyword: "getting paid by international clients",
  secondary: [
    "invoice a us company from europe",
    "multi currency account freelancer",
    "reverse charge vat services",
    "international transfer fees hidden",
    "payment methods for freelancers abroad",
  ],
  title: "Getting Paid by International Clients Without Losing 4% on the Way",
  h1: "Getting Paid by International Clients Without Losing 4% on the Way",
  metaTitle: "Getting Paid Internationally: Methods, Fees and Invoicing",
  metaDescription:
    "Where the real cost of an international payment hides, which method fits which client, how to choose the invoicing currency, and what an international invoice needs so it does not bounce.",
  ogTitle: "Getting Paid by International Clients",
  ogDescription:
    "The exchange rate margin costs more than the visible fees. How to pick method, currency and invoice format.",
  published: "2026-08-19",
  updated: "2026-08-19",
  readingMinutes: 11,
  author: "ActiveXRemote Team",
  course: "remote-founder",
  terms: ["facturacion-internacional", "multidivisa", "contractor-internacional", "negocio-borderless"],
  related: ["b2b-clients-without-network", "employer-of-record-vs-contractor", "productised-service-business"],
  external: [
    { label: "European Commission · VAT rules on cross-border services", url: "https://taxation-customs.ec.europa.eu" },
    { label: "European Central Bank · Euro reference exchange rates", url: "https://www.ecb.europa.eu" },
    { label: "European Commission · Cross-border payments regulation", url: "https://finance.ec.europa.eu" },
  ],
  intro: [
    "Winning a client abroad is the hard part. Getting paid properly is the part almost nobody examines, and it is where a surprising slice of annual revenue disappears without ever appearing as a line on a statement.",
    "The real cost of an international payment is rarely the advertised fee. It is the margin applied to the exchange rate. This guide separates the two, compares the methods, and covers what an invoice needs so a finance department does not send it back.",
  ],
  sections: [
    {
      id: "where-money-goes",
      h2: "Where the money actually goes",
      answer:
        "Three places: the flat transfer fee, the margin on the exchange rate, and correspondent bank charges. The second is usually the largest and the least visible, because it never appears as a charge. It is baked into a rate slightly worse than the real one.",
      blocks: [
        {
          t: "table",
          head: ["Cost", "Typical range", "Visible on the statement?"],
          rows: [
            ["Sending or receiving fee", "€0 to €30 per payment", "Yes, as a separate charge"],
            ["Exchange rate margin", "0.4% to 4% of the amount", "No: it is inside the rate applied"],
            ["Correspondent banks", "€10 to €40 per hop", "Sometimes, and sometimes only the client sees it"],
            ["Card gateway fee", "1.4% to 3.9% plus fixed", "Yes, in the payout"],
          ],
        },
        {
          t: "p",
          text: "Checking the margin takes ten seconds: compare the rate you were given against the European Central Bank reference rate for that day. The percentage difference is what you paid without seeing it.",
        },
        {
          t: "note",
          text: "On €60,000 invoiced annually in another currency, a 3% margin is €1,800. That is more than any alternative costs, and it repeats every year.",
        },
      ],
      takeaway:
        "The advertised fee is rarely the cost. The cost is in the rate.",
    },
    {
      id: "methods",
      h2: "Which method fits which client",
      answer:
        "There is no single best method. It depends on whether the client is a business or a consumer, the average invoice size, and whether payment recurs. A finance department prefers a bank transfer; a consumer abandons checkout when asked for international banking details.",
      blocks: [
        {
          t: "table",
          head: ["Method", "Best for", "Watch out for"],
          rows: [
            ["Multi-currency account transfer", "Businesses, medium and large amounts, recurring work", "Whether you have local details in the client's currency"],
            ["Card payment gateway", "Consumers and smaller amounts", "The percentage fee hurts on high-ticket invoices"],
            ["Invoicing platform with payments", "Recurring subscriptions", "Total cost once conversion and fees are combined"],
            ["Direct debit in the client's currency", "Stable long-term contracts", "Requires local details and prior agreement"],
          ],
        },
        {
          t: "p",
          text: "The practical lever is holding local banking details in the client's currency. A US client paying into US details removes correspondent banks entirely and removes the friction of persuading someone to make an international transfer at all.",
        },
      ],
      takeaway:
        "Pick by client type and invoice size, and offer local details wherever you can.",
    },
    {
      id: "currency",
      h2: "Which currency to invoice in",
      answer:
        "The one you spend, if the client accepts it. Invoicing in your own currency passes exchange rate risk to them; invoicing in theirs means you carry it. When there is no choice, what remains is controlling when and how the conversion happens.",
      blocks: [
        {
          t: "ul",
          items: [
            "Invoicing and being paid in the same currency you spend means no conversion at all: the cleanest position.",
            "If you invoice in the client's currency, hold the balance in it and convert when it suits you rather than automatically on receipt.",
            "If you also have costs in that currency, do not convert: pay from it and you skip the conversion entirely.",
            "Put in the contract who bears the fees. «Amount to be received net» prevents month-end arguments.",
          ],
        },
        {
          t: "p",
          text: "On long contracts there is also the risk of the currency drifting against you for months. On material amounts it is worth revisiting the price periodically or agreeing a review clause, rather than absorbing it silently.",
        },
      ],
      takeaway:
        "Holding the balance and converting on your own timing is the simplest lever available.",
    },
    {
      id: "invoice",
      h2: "What an international invoice needs",
      answer:
        "More than a domestic one: full tax identification for both parties, the place of supply, and the wording that explains why no tax is charged when that applies. Missing any of it and the client's finance team returns the invoice, which costs you a payment cycle.",
      blocks: [
        {
          t: "steps",
          items: [
            { title: "Identify both parties properly", text: "Full legal name, address and tax identification number of the client, not just their trading name." },
            { title: "Establish the place of supply", text: "For business-to-business services the general rule places it where the client is. That determines the treatment." },
            { title: "Apply the right treatment", text: "Between businesses in different countries the reverse charge often applies, and the invoice must say so explicitly." },
            { title: "Add complete payment details", text: "Bank details in the invoice currency, a payment reference and the due date. The less they have to ask, the sooner you are paid." },
            { title: "Number and archive", text: "Sequential series and a stored copy. It is the first thing requested in any audit." },
          ],
        },
        {
          t: "note",
          text: "Treatment varies considerably by client type and country, and selling to consumers abroad can require specific registrations. This explains what to ask; your accountant confirms your case.",
        },
      ],
      takeaway:
        "A returned invoice costs a month. Complete details are cheaper than the correction.",
    },
    {
      id: "faster",
      h2: "Getting paid faster and chasing less",
      answer:
        "Most late payments are friction, not bad faith. A client who does not know how to pay you, who needs internal approval, or who receives an invoice without a purchase order number takes weeks longer than necessary, and the problem sits in your process rather than theirs.",
      blocks: [
        {
          t: "ol",
          items: [
            "Take a deposit on the first engagement with any new client. It filters and it funds the start.",
            "Ask before invoicing what their finance team needs: purchase order number, supplier portal, specific format.",
            "Invoice the same day you deliver. Every day you delay is added to their payment cycle.",
            "Put the due date on the invoice and set an automatic reminder seven days after it.",
            "On large amounts, split into milestones. Lower risk, better cash flow.",
          ],
        },
        {
          t: "quote",
          text: "Most money that arrives late is lost in the process, not in the client's willingness to pay.",
        },
      ],
      takeaway:
        "Asking how they want to receive the invoice shortens payment more than any reminder does.",
    },
  ],
  faqs: [
    { q: "What is the cheapest way to get paid by an international client?", a: "Usually a multi-currency account with local banking details in the client's currency: it removes correspondent banks and applies a far smaller conversion margin than traditional banking. For small consumer payments a card gateway is worth its higher percentage." },
    { q: "How do I know what I am being charged for conversion?", a: "Compare the rate you received against the European Central Bank reference rate for the same day. The percentage difference is the margin, and it never appears as a fee." },
    { q: "Do I charge VAT to a client in another country?", a: "It depends on whether they are a business or a consumer and where they are. Between businesses in different countries the reverse charge often applies, with explicit wording on the invoice. Selling to consumers follows different rules and can require registration." },
    { q: "Can I invoice in dollars if my accounts are in euros?", a: "Yes. The invoice can be issued in another currency stating the exchange rate used for accounting. Agree in the contract which rate applies and on what date." },
    { q: "Who pays the transfer fees?", a: "Whatever you agree. Left unstated they are usually shared and you receive less than you invoiced. Specifying «amount to be received net» in the contract prevents that." },
    { q: "Do I need a bank account in the client's country?", a: "Not necessarily. Several multi-currency providers give you local banking details in different countries without opening an account there, which is what removes the friction for the client." },
    { q: "Should I ask for payment upfront?", a: "On the first engagement with a new client, yes: a deposit filters and funds the start. In established relationships, milestone invoicing is usually enough." },
    { q: "What if an international client does not pay?", a: "First check it is not friction: incomplete invoice, missing purchase order, an unregistered supplier portal. For genuine non-payment, cross-border recovery is slow and expensive, which is why deposits and milestones are the real defence." },
    { q: "Do payment platforms withhold tax?", a: "Some apply withholding or require tax documentation depending on your country and theirs. Check when signing up rather than when the first payout arrives smaller than expected." },
    { q: "How long does an international transfer take?", a: "One to five business days depending on route and currency. Payments made to local banking details usually settle like a domestic transfer, same day or next." },
  ],
};
