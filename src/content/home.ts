// Homepage copy, sourced from "PROPELGO HOMEPAGE CONTENT.docx" and the product documents.
// Shaped so each block can later be served from Payload CMS without touching layout code.

export const nav = {
  products: [
    {
      name: "Versa",
      tag: "Vendor payments",
      line: "Enterprise vendor payments on virtual cards.",
      href: "/products/versa",
    },
    {
      name: "ODCC",
      tag: "Commercial credit",
      line: "Existing OD/CC limits, as a commercial card.",
      href: "/products/odcc",
    },
    {
      name: "Orchestration Layer",
      tag: "Infrastructure",
      line: "One layer to banks, networks and providers.",
      href: "/products/orchestration-layer",
    },
  ],
  solutions: {
    useCases: [
      { name: "Vendor payments", href: "/solutions/vendor-payments" },
      { name: "Enterprise payment operations", href: "/solutions/enterprise-payment-operations" },
      { name: "Credit mobility", href: "/solutions/credit-mobility" },
    ],
    industries: [
      { name: "Travel & hospitality", href: "/solutions/travel-hospitality" },
      { name: "Embedded finance", href: "/solutions/embedded-finance" },
      { name: "Global businesses", href: "/solutions/global-businesses" },
      { name: "Banks and corporates", href: "/solutions/banks-corporates" },
    ],
  },
  resources: [
    { name: "Articles", href: "/resources/articles", line: "Insights on B2B payments" },
    { name: "Customer stories", href: "/resources/customer-stories", line: "How enterprises use PropelGo" },
    { name: "FAQs", href: "/resources/faqs", line: "Answers to common questions" },
  ],
  company: [
    { name: "About us", href: "/about", line: "Our story, vision and mission" },
    { name: "Meet the team", href: "/about#leadership", line: "The people building PropelGo" },
    { name: "Careers", href: "/careers", line: "Build infrastructure with us" },
  ],
};

export const hero = {
  eyebrow: "Enterprise payment infrastructure",
  headline: ["Powering the", "way businesses", "move and", "manage money."],
  accentWord: "move",
  copy: "From vendor payments and commercial credit to payment orchestration and cards, PropelGo helps businesses manage modern payment operations from one platform.",
  primaryCta: { label: "Talk to Us", href: "/contact" },
  secondaryCta: { label: "Explore our products", href: "#products" },
};

export const ecosystem = {
  title: "Built across the payment ecosystem.",
  caption: "Banks, networks and enterprises",
  // Rendered as wordmarks until approved logo files are supplied.
  names: [
    "Air India Express",
    "VISA",
    "Mastercard",
    "RuPay",
    "IndusInd Bank",
    "Citi",
    "IDFC FIRST",
    "SBI",
    "Axis Bank",
    "YES BANK",
    "RBL Bank",
    "Kotak",
  ],
};

export const overview = {
  eyebrow: "About PropelGo",
  title: "Building the infrastructure behind modern business payments.",
  lead: "PropelGo is an enterprise payments platform built to help businesses simplify how they move, manage, and control money.",
  body: "We connect the different parts of the business payment ecosystem, from banks, issuers and card networks to payment systems, workflows and financial operations, through technology designed for greater control, visibility, and efficiency.",
  milestone: {
    label: "Our story · First milestone",
    text: "Founded by bankers and credit specialists. First transaction enabled for Air India Express.",
  },
  cta: { label: "Discover PropelGo", href: "/about" },
  nodes: [
    { verb: "Connect", noun: "Banks" },
    { verb: "Issue", noun: "Issuers" },
    { verb: "Route", noun: "Card networks" },
    { verb: "Integrate", noun: "Payment systems" },
    { verb: "Automate", noun: "Workflows" },
    { verb: "Reconcile", noun: "Financial operations" },
  ],
};

export const stats = {
  title: "Built on experience. Growing with every milestone.",
  note: "Illustrative figures · final numbers to be supplied by PropelGo",
  items: [
    { prefix: "", value: 120, suffix: "+", label: "Enterprise customers" },
    { prefix: "", value: 25, suffix: "M+", label: "Transactions processed" },
    { prefix: "₹", value: 8500, suffix: " Cr+", label: "Payment volume" },
    { prefix: "", value: 18, suffix: "+", label: "Banking & financial ecosystem partners" },
  ],
};

export const products = {
  eyebrow: "Our products",
  title: "One platform. Multiple ways to power business payments.",
  copy: "From vendor payments and commercial credit to payment orchestration, PropelGo brings together infrastructure designed for modern enterprise payment operations.",
  versa: {
    index: "Product 01",
    flow: ["Vendor payments", "Virtual cards"],
    name: "Versa",
    tagline: "Enterprise vendor payments, simplified.",
    copy: "Manage vendor and supplier payments through virtual cards, automated workflows, payment controls, visibility, and reconciliation.",
    chips: ["Multi-bank", "ERP & API", "Reconciliation"],
    cta: { label: "Explore Versa", href: "/products/versa" },
  },
  odcc: {
    index: "Product 02",
    flow: ["Credit", "Commercial card"],
    name: "ODCC",
    tagline: "Existing credit. New possibilities.",
    copy: "Turn eligible OD/CC limits into a modern commercial-card experience for business spending.",
    chips: ["Visa", "Mastercard", "RuPay"],
    cta: { label: "Explore ODCC", href: "/products/odcc" },
  },
  orchestration: {
    index: "Product 03",
    flow: ["Many connections", "One layer"],
    name: "Orchestration Layer",
    tagline: "Orchestrate enterprise payments. From one layer.",
    copy: "Connect enterprise systems with banks, issuers, networks, and payment providers through a unified payment orchestration layer.",
    note: "The foundation beneath Versa, ODCC and any payment flow you build next.",
    chips: ["API-first", "Routing rules", "Settlement"],
    cta: { label: "Explore Orchestration", href: "/products/orchestration-layer" },
  },
};

export const capabilities = {
  eyebrow: "Platform capabilities",
  title: "Built to simplify complex payment operations.",
  cta: { label: "Talk to our team", href: "/contact" },
  items: [
    {
      title: "Payment orchestration",
      copy: "Connect and manage payment flows across a complex payment ecosystem.",
      detail: "Configured routing rules decide which bank, network or provider carries each payment.",
    },
    {
      title: "Virtual & commercial cards",
      copy: "Enable controlled, purpose-driven business spending through card-based infrastructure.",
      detail: "Issue a card per vendor, per purpose or per trip, each with its own limits and validity.",
    },
    {
      title: "Workflow automation",
      copy: "Bring approvals, controls, and operational workflows into the payment process.",
      detail: "Maker-checker and role-based approvals run inside the payment, not around it.",
    },
    {
      title: "Reconciliation & visibility",
      copy: "Bring payment data, settlement information, and operational insights into one view.",
      detail: "Payments match to the ledger automatically, so month-end is a review, not a hunt.",
    },
  ],
};

export const security = {
  eyebrow: "Security & compliance",
  title: "Built for trust. Designed for enterprise.",
  copy: "Financial infrastructure is built on trust. Compliance, security and accountability are embedded into the way we build, not added after.",
  principles: [
    { title: "Compliance first", copy: "Foundational to responsible financial infrastructure, not an afterthought." },
    { title: "Security by design", copy: "Security as a core consideration, from the ground up." },
    { title: "Transparency", copy: "Open communication and accountability on every commitment." },
  ],
  controls: [
    "Role-based access",
    "Maker-checker",
    "Velocity controls",
    "Merchant controls",
    "Spend limits",
    "IP whitelisting",
    "Audit logs",
    "Policy engine",
  ],
  badgesNote: "Certification badges to be supplied by PropelGo",
};

export const testimonials = {
  eyebrow: "Customer testimonials",
  title: "Trusted by businesses building what's next.",
  note: "Sample copy · replace with approved quotes",
  cta: { label: "Customer stories", href: "/resources/customer-stories" },
  items: [
    {
      metric: "4×",
      metricLabel: "faster vendor reconciliation",
      quote:
        "We moved our vendor payments onto virtual cards without changing how our finance team works. Approvals, controls and reconciliation now sit in one place.",
      name: "Name Surname",
      role: "Head of Finance, Customer company",
      product: "Versa",
    },
    {
      metric: "₹0",
      metricLabel: "new credit lines needed",
      quote:
        "Our existing OD/CC limit now works as a card for supplier and travel spend, with controls our treasury team actually trusts.",
      name: "Name Surname",
      role: "CFO, Customer company",
      product: "ODCC",
    },
    {
      metric: "1",
      metricLabel: "integration, multiple banks",
      quote:
        "One integration gave us multiple bank and network connections. Routing changes are now a rule update, not an engineering project.",
      name: "Name Surname",
      role: "VP Treasury, Customer company",
      product: "Orchestration Layer",
    },
  ],
};

export const resources = {
  eyebrow: "Resources",
  title: "Explore our latest insights.",
  cta: { label: "View all resources", href: "/resources" },
  items: [
    {
      type: "Article",
      read: "6 min read",
      title: "What is payment orchestration, and why are enterprises adopting it?",
      art: "rails",
      href: "/resources/articles/payment-orchestration",
    },
    {
      type: "Insight",
      read: "4 min read",
      title: "Getting more from working capital: OD/CC limits as a commercial card.",
      art: "card",
      href: "/resources/articles/od-cc-commercial-card",
    },
    {
      type: "Guide",
      read: "8 min read",
      title: "A finance team's guide to virtual cards for vendor payments.",
      art: "ledger",
      href: "/resources/articles/virtual-cards-vendor-payments",
    },
  ],
};

export const finalCta = {
  eyebrow: "Get in touch",
  title: ["Let's build better", "business"],
  accent: "payments.",
  copy: "Tell us what you're building, and let's explore how PropelGo can help simplify your payment infrastructure.",
  cta: { label: "Talk to Us", href: "/contact" },
  email: "support@propelgpayments.com",
  steps: [
    { title: "Tell us about your requirement", copy: "Share a few details about your business and what you're looking to solve." },
    { title: "We review your enquiry", copy: "Our team identifies the relevant PropelGo capability." },
    { title: "Let's talk", copy: "We connect with you to discuss requirements and next steps." },
  ],
};

export const footer = {
  blurb: "Enterprise payment infrastructure for how businesses move, manage and control money.",
  columns: [
    {
      title: "Products",
      links: nav.products.map((p) => ({ name: p.name, href: p.href })),
    },
    {
      title: "Solutions",
      links: [...nav.solutions.useCases, { name: "Industries", href: "/solutions#industries" }],
    },
    { title: "Resources", links: nav.resources.map(({ name, href }) => ({ name, href })) },
    {
      title: "Company",
      links: [...nav.company.map(({ name, href }) => ({ name, href })), { name: "Talk to us", href: "/contact" }],
    },
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Use", href: "/terms" },
    { name: "Cookie Policy", href: "/cookies" },
  ],
  social: [
    { name: "LinkedIn", href: "https://www.linkedin.com/" },
    { name: "X", href: "https://x.com/" },
    { name: "YouTube", href: "https://www.youtube.com/" },
  ],
};
