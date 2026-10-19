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
  headline: "Powering the way businesses move and manage money.",
  copy: "From vendor payments and commercial credit to payment orchestration and cards, PropelGo helps businesses manage modern payment operations from one platform.",
  primaryCta: { label: "Talk to Us", href: "/contact" },
  secondaryCta: { label: "Explore our products", href: "#products" },
};

export const ecosystem = {
  caption: "Built across the payment ecosystem",
  // Placeholder logos from Wikimedia Commons; replace with client-approved files. Sizes are display px, tuned for optical balance.
  logos: [
    { name: "Air India Express", src: "/logos/air-india-express.svg", width: 106, height: 32 },
    { name: "IndusInd Bank", src: "/logos/indusind-bank.svg", width: 185, height: 20 },
    { name: "Citi", src: "/logos/citi.svg", width: 52, height: 34 },
    { name: "IDFC FIRST Bank", src: "/logos/idfc-first-bank.svg", width: 91, height: 32 },
    { name: "SBI", src: "/logos/sbi.svg", width: 88, height: 30 },
    { name: "Axis Bank", src: "/logos/axis-bank.svg", width: 101, height: 26 },
    { name: "YES BANK", src: "/logos/yes-bank.svg", width: 75, height: 28 },
  ],
  // Direction B renders these as text wordmarks.
  names: ["Air India Express", "IndusInd Bank", "Citi", "IDFC FIRST", "SBI", "Axis Bank", "YES BANK", "RBL Bank", "Kotak"],
};

export const overview = {
  eyebrow: "About PropelGo",
  title: "Building the infrastructure behind modern business payments.",
  lead: "PropelGo is an enterprise payments platform built to help businesses simplify how they move, manage, and control money.",
  body: "We connect the different parts of the business payment ecosystem, from banks, issuers and card networks to payment systems, workflows and financial operations, through technology designed for greater control, visibility, and efficiency.",
  milestone: "Founded by bankers and credit specialists. First transaction enabled for Air India Express.",
  cta: { label: "Discover PropelGo", href: "/about" },
  nodes: [
    { verb: "Connect", noun: "Banks", line: "Multiple banking and issuer relationships through one integration." },
    { verb: "Issue", noun: "Issuers", line: "Virtual and commercial cards issued with the right controls." },
    { verb: "Route", noun: "Card networks", line: "Payments flow across all major card networks." },
    { verb: "Integrate", noun: "Payment systems", line: "ERP and enterprise applications connected over APIs." },
    { verb: "Automate", noun: "Workflows", line: "Approvals and policies run inside every payment." },
    { verb: "Reconcile", noun: "Finance teams", line: "Settlement data flows straight back to the ledger." },
  ],
};

export const stats = {
  title: "Built on experience. Growing with every milestone.",
  note: "Illustrative figures. Final numbers to be supplied by PropelGo.",
  items: [
    { prefix: "", value: 120, suffix: "+", label: "Enterprise customers" },
    { prefix: "", value: 25, suffix: "M+", label: "Transactions processed" },
    { prefix: "₹", value: 8500, suffix: " Cr+", label: "Payment volume" },
    { prefix: "", value: 18, suffix: "+", label: "Banking and ecosystem partners" },
  ],
};

export type ProductKey = "versa" | "odcc" | "orchestration";

export const products = {
  eyebrow: "Our products",
  title: "One platform. Multiple ways to power business payments.",
  highlight: "power business payments.",
  copy: "From vendor payments and commercial credit to payment orchestration, PropelGo brings together infrastructure designed for modern enterprise payment operations.",
  hint: "Tap a card to see what's inside",
  items: [
    {
      key: "versa" as ProductKey,
      name: "Versa",
      category: "Vendor payments",
      tagline: "Enterprise vendor payments, simplified.",
      copy: "Manage vendor and supplier payments through virtual cards, automated workflows, payment controls, visibility, and reconciliation.",
      features: [
        "Virtual cards with controls for every payment",
        "Maker-checker approval workflows",
        "Vendor and supplier management",
        "Automated payment reconciliation",
      ],
      cta: { label: "Explore Versa", href: "/products/versa" },
    },
    {
      key: "odcc" as ProductKey,
      name: "ODCC",
      category: "Commercial credit",
      tagline: "Existing credit. New possibilities.",
      copy: "Turn eligible OD/CC limits into a modern commercial-card experience for business spending.",
      features: [
        "Use already-sanctioned OD/CC limits",
        "Supplier, vendor, travel and utility spends",
        "Spend controls set by the business",
        "Runs on all major card networks",
      ],
      cta: { label: "Explore ODCC", href: "/products/odcc" },
    },
    {
      key: "orchestration" as ProductKey,
      name: "Orchestration Layer",
      category: "Infrastructure",
      tagline: "Orchestrate enterprise payments. From one layer.",
      copy: "Connect enterprise systems with banks, issuers, networks, and payment providers through a unified payment orchestration layer.",
      features: [
        "One integration, multiple banks and issuers",
        "Configurable routing rules",
        "Settlement and reconciliation built in",
        "API-first, ERP-ready",
      ],
      cta: { label: "Explore Orchestration", href: "/products/orchestration-layer" },
    },
  ],
};

export type CapabilityKey = "routing" | "cards" | "workflow" | "reconcile";

export const capabilities = {
  eyebrow: "Platform capabilities",
  title: "Built to simplify complex payment operations.",
  highlight: "complex payment operations.",
  cta: { label: "Talk to our team", href: "/contact" },
  items: [
    {
      key: "routing" as CapabilityKey,
      title: "Payment orchestration",
      copy: "Connect and manage payment flows across a complex payment ecosystem.",
      detail: "Configured routing rules decide which bank, network or provider carries each payment.",
    },
    {
      key: "cards" as CapabilityKey,
      title: "Virtual & commercial cards",
      copy: "Enable controlled, purpose-driven business spending through card-based infrastructure.",
      detail: "Issue a card per vendor, per purpose or per trip, each with its own limits and validity.",
    },
    {
      key: "workflow" as CapabilityKey,
      title: "Workflow automation",
      copy: "Bring approvals, controls, and operational workflows into the payment process.",
      detail: "Maker-checker and role-based approvals run inside the payment, not around it.",
    },
    {
      key: "reconcile" as CapabilityKey,
      title: "Reconciliation & visibility",
      copy: "Bring payment data, settlement information, and operational insights into one view.",
      detail: "Payments match to the ledger automatically, so month-end is a review, not a hunt.",
    },
  ],
};

export const security = {
  eyebrow: "Security & compliance",
  title: "Built for trust. Designed for enterprise.",
  highlight: "Designed for enterprise.",
  copy: "Compliance, security and accountability are embedded into the way we build, not added after.",
  // Placeholder labels until PropelGo confirms certifications and supplies badge artwork.
  badges: [
    { name: "PCI DSS", line: "Card data security" },
    { name: "ISO 27001", line: "Information security" },
    { name: "SOC 2", line: "Service controls" },
    { name: "RBI aligned", line: "Regulatory guidelines" },
  ],
  note: "Badges to be confirmed by PropelGo",
  // Artwork taken from propelgo.in. Width/height are the source pixel sizes.
  certifications: [
    { name: "DPIIT recognised", line: "Startup India", src: "/certifications/dpiit-startup-india.png", width: 222, height: 82 },
    { name: "Visa Global Registry", line: "Service provider, 2025", src: "/certifications/service-provider-badge-2025.png", width: 320, height: 304 },
    { name: "PCI DSS certified", line: "Panacea InfoSec audit", src: "/certifications/pci-dss.png", width: 321, height: 140 },
    { name: "SOC 2 Type 2", line: "AICPA standard", src: "/certifications/soc2-type2.jpg", width: 199, height: 253 },
    { name: "ISO 27001", line: "Information security", src: "/certifications/iso-27001.jpg", width: 215, height: 215 },
    { name: "SSL secured", line: "Encrypted in transit", src: "/certifications/ssl-secure.jpg", width: 318, height: 159 },
  ],
};

export const network = {
  eyebrow: "Payment network",
  title: "Every rail. One connection.",
  highlight: "One connection.",
  copy: "Banks, card networks and national payment systems connect through PropelGo, so money reaches the right destination over the right rail, without a new integration for every route.",
  rails: ["UPI", "NEFT", "RTGS", "IMPS", "Cards", "Bank APIs"],
  points: [
    { title: "Routed by rules", line: "Each payment takes the rail your policy picks, by amount, urgency or cost." },
    { title: "Tracked end to end", line: "Status and settlement data come back to one view for every route." },
    { title: "Built to extend", line: "New banks and networks plug into the same layer as you grow." },
  ],
};

export const testimonials = {
  eyebrow: "Customer stories",
  title: "Trusted by businesses building what's next.",
  highlight: "what's next.",
  note: "Sample copy. Replace with approved quotes.",
  cta: { label: "Read customer stories", href: "/resources/customer-stories" },
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
  highlight: "latest insights.",
  cta: { label: "View all resources", href: "/resources" },
  items: [
    {
      type: "Article",
      read: "6 min read",
      title: "What is payment orchestration, and why are enterprises adopting it?",
      art: "orchestration" as const,
      href: "/resources/articles/payment-orchestration",
    },
    {
      type: "Insight",
      read: "4 min read",
      title: "Getting more from working capital: OD/CC limits as a commercial card.",
      art: "credit" as const,
      href: "/resources/articles/od-cc-commercial-card",
    },
    {
      type: "Guide",
      read: "8 min read",
      title: "A finance team's guide to virtual cards for vendor payments.",
      art: "vendors" as const,
      href: "/resources/articles/virtual-cards-vendor-payments",
    },
  ],
};

export const finalCta = {
  eyebrow: "Get in touch",
  title: "Let's build better business payments.",
  highlight: "better business payments.",
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
