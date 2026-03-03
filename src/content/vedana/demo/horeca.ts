// src/content/vedana/demo/horeca.ts

/* =====================================================
   CARD REGISTRY (Graph Nodes for Demo)
===================================================== */

export const cardRegistry = {
  dish_chefs_special_pasta: {
    entity: "Dish",
    name: "Chef’s Special Pasta",
    category: "Main Course",
    prep_style: "Pan-seared + reduction",
    sauce_base: "Cream",
    contains: [
      { id: "ingredient_atlantic_salmon", amount: "100g" },
      { id: "ingredient_cream", amount: "50g" },
      { id: "ingredient_pasta", amount: "150g" }
    ]
  },

  ingredient_atlantic_salmon: {
    entity: "Ingredient",
    name: "Atlantic Salmon",
    protein: 20,
    fat: 13,
    carbs: 0
  },

  ingredient_cream: {
    entity: "Ingredient",
    name: "Cream",
    protein: 2,
    fat: 35,
    carbs: 3
  },

  ingredient_pasta: {
    entity: "Ingredient",
    name: "Pasta",
    protein: 5,
    fat: 1,
    carbs: 25
  },

  wine_pinot_noir: {
    entity: "Wine",
    name: "Pinot Noir",
    type: "Red",
    body: "Medium",
    acidity: "High",
    origin: "Burgundy",
    flavor_profile: ["Cherry", "Earth", "Light spice"]
  },

  wine_merlot: {
    entity: "Wine",
    name: "Merlot",
    type: "Red",
    body: "Medium-Full",
    acidity: "Medium",
    origin: "Bordeaux",
    flavor_profile: ["Plum", "Chocolate", "Soft tannins"]
  }
} as const;

/* =====================================================
   TYPE DERIVATION
===================================================== */

export type CardId = keyof typeof cardRegistry;
export type CardNode = (typeof cardRegistry)[CardId];

/* =====================================================
   SCENARIOS (STRICT, CONST-BASED)
===================================================== */

export const scenarios = [
  {
    key: "wine",
    label: "Wine pairing",

    question:
      "Which wine pairs best with the Chef’s special pasta? What’s the difference between a Pinot Noir and a Merlot from the menu?",

    reasoning: [
      {
        narration:
          "User requests wine pairing recommendation and wine comparison."
      },

      {
        title: "Step 1 - Retrieve dish entity",
        cards: [
          "dish_chefs_special_pasta"
        ]
      },

      {
        title: "Step 2 - Retrieve ingredients via Dish - has - Ingredient",
        cards: [
          "ingredient_atlantic_salmon",
          "ingredient_cream",
          "ingredient_pasta"
        ]
      },

      {
        title: "Step 3 - Retrieve candidate wines",
        cards: [
          "wine_pinot_noir",
          "wine_merlot"
        ]
      },

      {
        title: "Structural evaluation",
        logic: [
          "High-fat ingredients require balancing acidity.",
          "Pinot Noir acidity = High.",
          "Merlot acidity = Medium.",
          "Higher acidity structurally balances cream-based sauces.",
          "Pinot Noir provides better balance for this dish."
        ]
      }
    ],

    answer: `
<strong>Recommendation:</strong>

The Chef’s special pasta pairs best with <strong>Pinot Noir</strong> due to its medium body and higher acidity, which balances the richness of cream and salmon.

<strong>Comparison:</strong>

• Pinot Noir — medium body, high acidity, bright red fruit profile  
• Merlot — medium-full body, softer tannins, lower acidity  

For creamy sauces, higher acidity provides better structural balance.
`
  }
] as const;