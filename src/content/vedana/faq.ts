// /content/vedana/faq.ts

export interface FAQItem {
  label: string;
  content: string;
}

export const vedanaFaq: FAQItem[] = [
  {
    label: "Is Vedana just another RAG chatbot?",
    content:
      "No. Vedana is graph-first reasoning infrastructure. It does not rely on similarity search alone. It builds and queries structured knowledge graphs to answer questions under explicit constraints.",
  },
  {
    label: "How is this different from vector search?",
    content:
      "Vector search retrieves similar text fragments. Vedana evaluates entities, attributes, and relationships before answering. This reduces hallucinations and ensures answers follow business rules.",
  },
  {
    label: "Do I need a knowledge graph beforehand?",
    content:
      "No. Vedana extracts entities and relations from your documents, normalizes them, and builds a structured graph layer on top of your existing data sources.",
  },
  {
    label: "What kind of companies is Vedana built for?",
    content:
      "Enterprises where answers must follow constraints: healthcare compliance, product eligibility, logistics rules, regulatory environments, complex catalogs, and operational playbooks.",
  },
  {
    label: "How long does a pilot take?",
    content:
      "A structured pilot can be delivered in 4 weeks. It includes data extraction, graph modeling, reasoning setup, and measurable validation.",
  },
  {
    label: "Is this SaaS or on-premise?",
    content:
      "Both. Vedana can run in a managed cloud environment or be deployed inside your infrastructure, depending on security and compliance requirements.",
  },
];