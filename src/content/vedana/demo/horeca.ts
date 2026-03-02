export const scenariosHoreca = [
  {
    key: "wine",
    label: "Wine pairing",
    question: "Which wine pairs best with the Chef’s special pasta?",
    reasoning: [
      "The user asks for a wine pairing recommendation and a comparison between two wines.",
      "To recommend a wine for the Chef's special pasta we need the <strong>Dish</strong> entity.",
      "To compare Pinot Noir and Merlot we need <strong>Wine</strong> entities filtered by name.",
      "Relevant entity types: <strong>Dish</strong>, <strong>Wine</strong>.",
      "Relevant relationship: <strong>Dish_pairs_with_Wine</strong>.",
      "Relevant attributes: <strong>wine_type</strong>, <strong>body</strong>, <strong>acidity</strong>, <strong>origin</strong>, <strong>flavor_profile</strong>.",
      "Synthesizing verified recommendation."
    ],
    answer: `The Chef’s special pasta pairs best with Pinot Noir due to its medium body and higher acidity.

Compared to Merlot:
- Pinot Noir: lighter body, brighter acidity
- Merlot: fuller body, softer tannins

For creamy sauces Pinot Noir is optimal.`
  }
];