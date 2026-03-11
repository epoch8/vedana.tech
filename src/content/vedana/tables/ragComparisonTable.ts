export const ragComparisonTable = {
  columns: [
    {
      key: "scenario",
      title: "Business Scenario"
    },
    {
      key: "classic",
      title: "Classic RAG",
      badge: "Similarity-based",
      variant: "classic"
    },
    {
      key: "semantic",
      title: "Semantic RAG (Vedana)",
      badge: "Rule-based",
      variant: "semantic"
    }
  ],

  rows: [
    {
      id: "filters",

      scenario: {
        title: "Complete list with filters",
        example: "Which products can be sold in the EU?"
      },

      classic: {
        icon: "bad",
        text: "Returns a few similar products. May miss others that also qualify."
      },

      semantic: {
        icon: "good",
        html: "Checks all required conditions before answering.<br/><strong>Returns the full validated list.</strong>"
      }
    },

    {
      id: "sku",

      scenario: {
        title: "Exact product codes / SKUs",
        example: "Show details for SKU B49-6"
      },

      classic: {
        icon: "bad",
        text: "May surface similar-looking codes because they appear in related documents."
      },

      semantic: {
        icon: "good",
        html: "<strong>Exact identifier match.</strong><br/>Only the requested SKU is returned."
      }
    }
  ]
}