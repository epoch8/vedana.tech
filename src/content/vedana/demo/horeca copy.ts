export const scenariosHoreca = [
  {
    key: "wine",
    label: "Wine pairing",
    question: "Which wine pairs best with the Chef’s special pasta? What’s the difference between a Pinot Noir and a Merlot from the menu?",
    reasoning: [
      "The user asks for a wine pairing recommendation and a comparison between two wines.<br/>",
      `To recommend a wine for the Chef's special pasta we need:<br/>`,
      `- <strong>Dish</strong> entity (Chef’s special pasta).<br/>
      - <strong>Dish → has → Ingredient</strong> relationship.<br/>
      - <strong>Ingredient → pairs_with → Wine</strong> relationship.<br/>
      - <strong>Wine</strong> attributes such as <strong>type</strong>, <strong>body</strong>, <strong>acidity</strong>, <strong>origin</strong>.<br/>`,
      "To compare Pinot Noir and Merlot:",
      `- We need <strong>Wine</strong> entities filtered by name.<br/>
      - We need attributes: type, body, acidity, flavor profile.<br/>
      - We may also use pairing compatibility to contextualize recommendation.`,
      "Therefore:",
      `1) Retrieve Chef’s special pasta.<br/>
      2) Retrieve associated ingredients.<br/>
      3) Retrieve wines associated with ingredients.<br/>
      4) Retrieve Pinot Noir and Merlot details.<br/>
      5) Compare based on structural attributes.`,
    ],
    answer: `The Chef’s special pasta pairs best with Pinot Noir due to its medium body and higher acidity.

Compared to Merlot:
- Pinot Noir: lighter body, brighter acidity
- Merlot: fuller body, softer tannins

For creamy sauces Pinot Noir is optimal.`
  },

  {
    key: "allergens",
    label: "Allergen risk check",
    question: "Does the seafood risotto contain any high-risk allergens?",
    reasoning: [
      "The user is asking for allergen risk validation.",
      "We need the <strong>Dish</strong> entity and its linked <strong>Ingredient</strong> nodes.",
      "Relevant relationship: <strong>Dish_contains_Ingredient</strong>.",
      "We check each ingredient for the attribute <strong>allergen_category</strong>.",
      "Flagging ingredients classified under <strong>EU High-Risk Allergens</strong>.",
      "Generating structured allergen exposure summary."
    ],
    answer: `
<strong>Allergen Risk Summary:</strong>

<ul>
  <li><strong>Shellfish</strong> — Present (shrimp stock)</li>
  <li><strong>Dairy</strong> — Present (parmesan)</li>
  <li><strong>Gluten</strong> — Not detected</li>
  <li><strong>Nuts</strong> — Not detected</li>
</ul>

<table border="1" cellpadding="4">
  <tr>
    <th>Ingredient</th>
    <th>Allergen Category</th>
    <th>Risk Level</th>
  </tr>
  <tr>
    <td>Shrimp Stock</td>
    <td>Shellfish</td>
    <td>High</td>
  </tr>
  <tr>
    <td>Parmesan</td>
    <td>Dairy</td>
    <td>Medium</td>
  </tr>
</table>

<strong>Conclusion:</strong>
The dish contains high-risk allergens and must be labeled accordingly.
`
  },

  {
    key: "margin",
    label: "Menu margin optimization",
    question: "Which dishes have margins below 60% and should be repriced?",
    reasoning: [
      "The user asks for profitability analysis.",
      "We need the <strong>Dish</strong> entity with attributes <strong>cost_price</strong> and <strong>menu_price</strong>.",
      "Margin formula applied: <code>(menu_price - cost_price) / menu_price</code>.",
      "Filtering dishes where computed margin &lt; <strong>0.60</strong>.",
      "Sorting by lowest margin first.",
      "Producing repricing recommendations."
    ],
    answer: `
<strong>Margin Analysis Result:</strong>

<ol>
  <li>
    <strong>Grilled Salmon</strong><br/>
    Cost: $14<br/>
    Price: $22<br/>
    Margin: <strong>36%</strong>
  </li>
  <li>
    <strong>Truffle Pasta</strong><br/>
    Cost: $11<br/>
    Price: $18<br/>
    Margin: <strong>39%</strong>
  </li>
</ol>

<strong>Recommendation:</strong>

Increase pricing by 12–18% or renegotiate supplier contracts.

<em>Target margin:</em> <strong>65%+</strong> for premium positioning.
`
  }
];