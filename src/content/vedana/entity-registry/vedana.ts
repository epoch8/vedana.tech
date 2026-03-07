/* =====================================================
   ENTITY REGISTRY — VEDANA DOMAIN
===================================================== */
export type EntityAttribute = {
  key: string
  value: string
  href?: string
  external?: boolean
}

export type EntityRelationTarget = {
  id: string
  title: string
  entityType: string
  color?: string
}

export type EntityRelation = {
  label: string
  targets: EntityRelationTarget[]
}

export type Entity = {
  id: string
  title: string
  entityType: string
  color?: string
  attributes?: EntityAttribute[]
  relations?: EntityRelation[]
}

export const Entities: Record<string, Entity> = {

  /* =====================================================
     PLATFORM
  ===================================================== */

  platform_vedana: {
    id: "platform_vedana",
    title: "Vedana Platform",
    entityType: "platform",
    color: "var(--entity-platform)",

    attributes: [
      { key: "what it does", value: "Controlled AI data layer for enterprise decision support" },

      { key: "main use case", value: "Helps teams answer operational questions when the answer depends on multiple documents, datasets, and internal policies" },

      { key: "input data", value: "PDF, DOCX, XLSX, internal databases" },

      { key: "license model", value: "Open-core platform deployable on your own infrastructure" },
      {
          key: "GitHub",
          value: "epoch8/vedana",
          href: "https://github.com/epoch8/vedana",
          external: true
        },
        {
          key: "website",
          value: "vedana.tech",
          href: "https://vedana.tech",
          external: true
        }
    ],

    relations: [
      {
        label: "Serves industries",
        targets: [
          {
            id: "industry_automotive",
            title: "Automotive",
            entityType: "industry",
            color: "var(--entity-industry)"
          },
          {
            id: "industry_legal",
            title: "Legal",
            entityType: "industry",
            color: "var(--entity-industry)"
          },
          {
            id: "industry_horeca",
            title: "HoReCa",
            entityType: "industry",
            color: "var(--entity-industry)"
          }
        ]
      },

      {
        label: "Uses concepts",
        targets: [
          {
            id: "concept_minimal_modeling",
            title: "Minimal Modeling",
            entityType: "concept",
            color: "var(--entity-concept)"
          },
          {
            id: "concept_idp",
            title: "Intelligent Document Processing",
            entityType: "concept",
            color: "var(--entity-concept)"
          }
        ]
      },

      {
        label: "Includes components",
        targets: [
          {
            id: "component_memgraph",
            title: "Memgraph",
            entityType: "component",
            color: "var(--entity-component)"
          },
          {
            id: "component_grist",
            title: "Grist",
            entityType: "component",
            color: "var(--entity-component)"
          }
        ]
      },      
      {
        label: "Built by",
        targets: [
          {
            id: "company_epoch8",
            title: "Epoch8",
            entityType: "company",
            color: "var(--entity-company)"
          }
        ]
      },
    ]
  },

  /* =====================================================
     INDUSTRIES
  ===================================================== */

  industry_automotive: {
    id: "industry_automotive",
    title: "Automotive",
    entityType: "industry",
    color: "var(--entity-industry)",

    attributes: [
      { key: "focus", value: "Compliance and homologation data" },
      { key: "documents", value: "Technical specifications, regulations" }
    ]
  },

  industry_legal: {
    id: "industry_legal",
    title: "Legal",
    entityType: "industry",
    color: "var(--entity-industry)",

    attributes: [
      { key: "focus", value: "Regulatory document analysis" },
      { key: "documents", value: "Legal acts, contracts, compliance rules" }
    ]
  },

  industry_horeca: {
    id: "industry_horeca",
    title: "HoReCa",
    entityType: "industry",
    color: "var(--entity-industry)",

    attributes: [
      { key: "focus", value: "Operational knowledge graphs" },
      { key: "documents", value: "Menus, recipes, supplier contracts" }
    ]
  },

  /* =====================================================
     CONCEPTS
  ===================================================== */

  concept_minimal_modeling: {
    id: "concept_minimal_modeling",
    title: "Minimal Modeling",
    entityType: "concept",
    color: "var(--entity-concept)",

    attributes: [
      { key: "type", value: "Knowledge modeling methodology" },
      { key: "idea", value: "Represent domain knowledge using anchors, attributes, and links" },
      { key: "benefit", value: "Fast schema evolution for enterprise data" }
    ]
  },

  concept_idp: {
    id: "concept_idp",
    title: "Intelligent Document Processing",
    entityType: "concept",
    color: "var(--entity-concept)",

    attributes: [
      { key: "type", value: "AI document analysis" },
      { key: "goal", value: "Extract structured knowledge from documents" },
      { key: "inputs", value: "PDF, DOCX, XLSX" }
    ]
  },

  /* =====================================================
     COMPONENTS
  ===================================================== */

  component_memgraph: {
    id: "component_memgraph",
    title: "Memgraph",
    entityType: "component",
    color: "var(--entity-component)",

    attributes: [
      { key: "type", value: "Graph database" },
      { key: "query language", value: "Cypher" },
      { key: "role", value: "Knowledge graph storage" }
    ]
  },

  component_grist: {
    id: "component_grist",
    title: "Grist",
    entityType: "component",
    color: "var(--entity-component)",

    attributes: [
      { key: "type", value: "Collaborative data platform" },
      { key: "role", value: "Structured data interface" },
      { key: "usage", value: "Domain data editing & management" }
    ]
  },
  /* =====================================================
     COMPANY
  ===================================================== */

  company_epoch8: {
    id: "company_epoch8",
    title: "Epoch8",
    entityType: "company",
    color: "var(--entity-company)",

    attributes: [
      { key: "type", value: "AI & Machine Learning Agency" },
      { key: "founded", value: "2017" },
      { key: "specialization", value: "AI systems & knowledge graphs" },
      {
        key: "website",
        value: "epoch8.co",
        href: "https://epoch8.co",
        external: true
      }
    ],

    relations: [
      {
        label: "Develops platform",
        targets: [
          {
            id: "platform_vedana",
            title: "Vedana Platform",
            entityType: "platform",
            color: "var(--entity-platform)"
          }
        ]
      }
    ]
  }


}


/* =====================================================
   DERIVED EXPORTS
===================================================== */

export const EntityList = Object.values(Entities)

export function getEntity(id: string): Entity | undefined {
  return Entities[id]
}