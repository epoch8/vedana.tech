/* =====================================================
   VEDANA ENTITY REGISTRY — LEGAL DOMAIN
   Single source of truth for entities, attributes, relations
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

/* =====================================================
   ENTITY REGISTRY
===================================================== */

export const Entities: Record<string, Entity> = {

  /* =====================================================
     LEGAL AREAS
  ===================================================== */

  area_labour: {
    id: "area_labour",
    title: "Labour Law",
    entityType: "legal_area",
    color: "var(--entity-legal-area)",

    attributes: [
      { key: "scope", value: "Employment, working time, termination, leave, employee rights" },
      { key: "primary audience", value: "HR, Legal, People Ops, Founders" }
    ],

    relations: [
      {
        label: "Includes topics",
        targets: [
          { id: "topic_probation", title: "Probation", entityType: "legal_topic", color: "var(--entity-topic)" },
          { id: "topic_working_time", title: "Working Time", entityType: "legal_topic", color: "var(--entity-topic)" },
          { id: "topic_termination", title: "Termination", entityType: "legal_topic", color: "var(--entity-topic)" },
          { id: "topic_leave", title: "Leave Entitlements", entityType: "legal_topic", color: "var(--entity-topic)" },
          { id: "topic_representation", title: "Employee Representation", entityType: "legal_topic", color: "var(--entity-topic)" },
          { id: "topic_contracts", title: "Employment Contracts", entityType: "legal_topic", color: "var(--entity-topic)" },
          { id: "topic_health_safety", title: "Occupational Health & Safety", entityType: "legal_topic", color: "var(--entity-topic)" },
          { id: "topic_remote_work", title: "Remote Work", entityType: "legal_topic", color: "var(--entity-topic)" },
          { id: "topic_benefits", title: "Mandatory Benefits", entityType: "legal_topic", color: "var(--entity-topic)" },
          { id: "topic_data_protection", title: "Employee Data Protection", entityType: "legal_topic", color: "var(--entity-topic)" }
        ]
      }
    ]
  },

  area_immigration: {
    id: "area_immigration",
    title: "Immigration Law",
    entityType: "legal_area",
    color: "var(--entity-legal-area)",

    attributes: [
      { key: "scope", value: "Work permits, residence permits, foreign workers, employer sponsorship" },
      { key: "primary audience", value: "HR, Mobility, Legal, Hiring Managers" }
    ],

    relations: [
      {
        label: "Includes topics",
        targets: [
          { id: "topic_work_authorization", title: "Work Authorization", entityType: "legal_topic", color: "var(--entity-topic)" },
          { id: "topic_blue_card", title: "EU Blue Card", entityType: "legal_topic", color: "var(--entity-topic)" },
          { id: "topic_employer_sponsorship", title: "Employer Sponsorship", entityType: "legal_topic", color: "var(--entity-topic)" },
          { id: "topic_reporting_obligations", title: "Reporting Obligations", entityType: "legal_topic", color: "var(--entity-topic)" },
          { id: "topic_right_to_work", title: "Right-to-Work Verification", entityType: "legal_topic", color: "var(--entity-topic)" },
          { id: "topic_posted_workers", title: "Posted Workers", entityType: "legal_topic", color: "var(--entity-topic)" }
        ]
      }
    ]
  },

  /* =====================================================
     TOPICS
  ===================================================== */

  topic_probation: {
    id: "topic_probation",
    title: "Probation",
    entityType: "legal_topic",
    color: "var(--entity-topic)",
    attributes: [
      { key: "question patterns", value: "probation period, probation dismissal, statutory limit" }
    ]
  },

  topic_working_time: {
    id: "topic_working_time",
    title: "Working Time",
    entityType: "legal_topic",
    color: "var(--entity-topic)",
    attributes: [
      { key: "question patterns", value: "working hours, overtime, rest periods, Sunday work, time tracking" }
    ]
  },

  topic_termination: {
    id: "topic_termination",
    title: "Termination",
    entityType: "legal_topic",
    color: "var(--entity-topic)",
    attributes: [
      { key: "question patterns", value: "notice period, severance, dismissal protection, redundancy, garden leave" }
    ]
  },

  topic_leave: {
    id: "topic_leave",
    title: "Leave Entitlements",
    entityType: "legal_topic",
    color: "var(--entity-topic)",
    attributes: [
      { key: "question patterns", value: "vacation, sick leave, maternity, paternity, parental leave" }
    ]
  },

  topic_representation: {
    id: "topic_representation",
    title: "Employee Representation",
    entityType: "legal_topic",
    color: "var(--entity-topic)",
    attributes: [
      { key: "question patterns", value: "works council, trade unions, co-determination, consultation" }
    ]
  },

  topic_contracts: {
    id: "topic_contracts",
    title: "Employment Contracts",
    entityType: "legal_topic",
    color: "var(--entity-topic)",
    attributes: [
      { key: "question patterns", value: "mandatory clauses, fixed-term contracts, templates, non-compete" }
    ]
  },

  topic_health_safety: {
    id: "topic_health_safety",
    title: "Occupational Health & Safety",
    entityType: "legal_topic",
    color: "var(--entity-topic)",
    attributes: [
      { key: "question patterns", value: "training, medical exams, workplace accidents, occupational physicians" }
    ]
  },

  topic_remote_work: {
    id: "topic_remote_work",
    title: "Remote Work",
    entityType: "legal_topic",
    color: "var(--entity-topic)",
    attributes: [
      { key: "question patterns", value: "remote work agreements, legal allowance, right to disconnect" }
    ]
  },

  topic_benefits: {
    id: "topic_benefits",
    title: "Mandatory Benefits",
    entityType: "legal_topic",
    color: "var(--entity-topic)",
    attributes: [
      { key: "question patterns", value: "meal vouchers, bonuses, social security, mandatory insurance" }
    ]
  },

  topic_data_protection: {
    id: "topic_data_protection",
    title: "Employee Data Protection",
    entityType: "legal_topic",
    color: "var(--entity-topic)",
    attributes: [
      { key: "question patterns", value: "background checks, personal data, retention, employee files" }
    ]
  },

  topic_work_authorization: {
    id: "topic_work_authorization",
    title: "Work Authorization",
    entityType: "legal_topic",
    color: "var(--entity-topic)",
    attributes: [
      { key: "question patterns", value: "work permits, residence permits, start of work, validity, renewal" }
    ]
  },

  topic_blue_card: {
    id: "topic_blue_card",
    title: "EU Blue Card",
    entityType: "legal_topic",
    color: "var(--entity-topic)",
    attributes: [
      { key: "question patterns", value: "eligibility, salary thresholds, processing time, employer requirements" }
    ]
  },

  topic_employer_sponsorship: {
    id: "topic_employer_sponsorship",
    title: "Employer Sponsorship",
    entityType: "legal_topic",
    color: "var(--entity-topic)",
    attributes: [
      { key: "question patterns", value: "sponsorship documents, guarantees, fees, labor market test" }
    ]
  },

  topic_reporting_obligations: {
    id: "topic_reporting_obligations",
    title: "Reporting Obligations",
    entityType: "legal_topic",
    color: "var(--entity-topic)",
    attributes: [
      { key: "question patterns", value: "notifications to authorities, expiry tracking, termination reporting" }
    ]
  },

  topic_right_to_work: {
    id: "topic_right_to_work",
    title: "Right-to-Work Verification",
    entityType: "legal_topic",
    color: "var(--entity-topic)",
    attributes: [
      { key: "question patterns", value: "document checks, employer liability, record retention" }
    ]
  },

  topic_posted_workers: {
    id: "topic_posted_workers",
    title: "Posted Workers",
    entityType: "legal_topic",
    color: "var(--entity-topic)",
    attributes: [
      { key: "question patterns", value: "registration, on-site documents, cross-border assignments" }
    ]
  },

  /* =====================================================
     COUNTRIES
  ===================================================== */

  country_germany: {
    id: "country_germany",
    title: "Germany",
    entityType: "country",
    color: "var(--entity-country)",

    attributes: [
      { key: "jurisdiction type", value: "EU member state" },
      { key: "primary languages", value: "German" },
      { key: "legal areas covered", value: "Labour, Immigration" }
    ],

    relations: [
      {
        label: "Has legal areas",
        targets: [
          { id: "area_labour", title: "Labour Law", entityType: "legal_area", color: "var(--entity-legal-area)" },
          { id: "area_immigration", title: "Immigration Law", entityType: "legal_area", color: "var(--entity-legal-area)" }
        ]
      },
      {
        label: "Competent authorities",
        targets: [
          { id: "authority_bundesagentur", title: "Bundesagentur für Arbeit", entityType: "authority", color: "var(--entity-authority)" },
          { id: "authority_auslanderbehoerde", title: "Local Immigration Authority", entityType: "authority", color: "var(--entity-authority)" }
        ]
      },
      {
        label: "Has country rules",
        targets: [
          { id: "rule_de_works_council", title: "Works Council Thresholds & Rights", entityType: "legal_rule", color: "var(--entity-rule)" },
          { id: "rule_de_kurzarbeit", title: "Kurzarbeit Procedure", entityType: "procedure", color: "var(--entity-procedure)" },
          { id: "rule_de_fixed_term", title: "Fixed-Term Contracts Without Objective Reason", entityType: "legal_rule", color: "var(--entity-rule)" },
          { id: "rule_de_dismissal_protection", title: "Dismissal Protection Act Applicability", entityType: "legal_rule", color: "var(--entity-rule)" },
          { id: "rule_de_sunday_work", title: "Sunday & Public Holiday Work Restrictions", entityType: "legal_rule", color: "var(--entity-rule)" },
          { id: "rule_de_working_time_docs", title: "Working Time Documentation Requirements", entityType: "legal_rule", color: "var(--entity-rule)" },
          { id: "rule_de_freistellung", title: "Freistellung / Garden Leave", entityType: "legal_rule", color: "var(--entity-rule)" },
          { id: "permit_de_blue_card", title: "EU Blue Card — Germany", entityType: "permit_type", color: "var(--entity-permit)" },
          { id: "procedure_de_accelerated_worker", title: "Accelerated Skilled Worker Procedure", entityType: "procedure", color: "var(--entity-procedure)" }
        ]
      },
      {
        label: "Offers templates",
        targets: [
          { id: "template_de_employment_contract", title: "Employment Contract Template — Germany", entityType: "document_template", color: "var(--entity-template)" }
        ]
      }
    ]
  },

  country_czech_republic: {
    id: "country_czech_republic",
    title: "Czech Republic",
    entityType: "country",
    color: "var(--entity-country)",

    attributes: [
      { key: "jurisdiction type", value: "EU member state" },
      { key: "primary languages", value: "Czech" },
      { key: "legal areas covered", value: "Labour, Immigration" }
    ],

    relations: [
      {
        label: "Has country rules",
        targets: [
          { id: "rule_cz_probation", title: "Three-Month Statutory Probation", entityType: "legal_rule", color: "var(--entity-rule)" },
          { id: "rule_cz_dpp_dpc", title: "Agreements Outside Employment Relationship (DPP / DPČ)", entityType: "contract_type", color: "var(--entity-contract-type)" },
          { id: "rule_cz_meal_allowance", title: "Meal Allowance / Meal Voucher Rules", entityType: "benefit_scheme", color: "var(--entity-benefit)" },
          { id: "rule_cz_sick_leave_14_days", title: "Sick Leave Compensation — First 14 Days", entityType: "legal_rule", color: "var(--entity-rule)" },
          { id: "procedure_cz_e_neschopenka", title: "Electronic Sick Leave Submission (E-Neschopenka)", entityType: "procedure", color: "var(--entity-procedure)" },
          { id: "rule_cz_redundancy", title: "Termination Due to Redundancy", entityType: "legal_rule", color: "var(--entity-rule)" },
          { id: "rule_cz_non_compete", title: "Post-Termination Non-Compete", entityType: "legal_rule", color: "var(--entity-rule)" },
          { id: "rule_cz_occupational_exam", title: "Occupational Physician Medical Exams", entityType: "legal_rule", color: "var(--entity-rule)" },
          { id: "permit_cz_employee_card", title: "Employee Card — Czech Republic", entityType: "permit_type", color: "var(--entity-permit)" },
          { id: "permit_cz_blue_card", title: "Blue Card — Czech Republic", entityType: "permit_type", color: "var(--entity-permit)" },
          { id: "procedure_cz_vacancy_registration", title: "Vacancy Registration for Employee Card Sponsorship", entityType: "procedure", color: "var(--entity-procedure)" },
          { id: "rule_cz_foreigner_reporting", title: "Employer Reporting to Labour Office", entityType: "employer_obligation", color: "var(--entity-obligation)" }
        ]
      },
      {
        label: "Offers templates",
        targets: [
          { id: "template_cz_employment_contract", title: "Employment Contract Template — Czech Republic", entityType: "document_template", color: "var(--entity-template)" }
        ]
      }
    ]
  },

  country_finland: {
    id: "country_finland",
    title: "Finland",
    entityType: "country",
    color: "var(--entity-country)",

    attributes: [
      { key: "jurisdiction type", value: "EU member state" },
      { key: "primary languages", value: "Finnish, Swedish" },
      { key: "legal areas covered", value: "Labour, Immigration" }
    ],

    relations: [
      {
        label: "Has country rules",
        targets: [
          { id: "rule_fi_general_collective_agreements", title: "General Applicability of Collective Agreements", entityType: "legal_rule", color: "var(--entity-rule)" },
          { id: "procedure_fi_yt_negotiations", title: "Co-operation / Change Negotiations", entityType: "procedure", color: "var(--entity-procedure)" },
          { id: "rule_fi_occupational_healthcare", title: "Occupational Healthcare Provision", entityType: "legal_rule", color: "var(--entity-rule)" },
          { id: "rule_fi_working_time_bank", title: "Working Time Bank", entityType: "legal_rule", color: "var(--entity-rule)" },
          { id: "rule_fi_parental_leave", title: "Family Leave Reform / Parental Leave", entityType: "legal_rule", color: "var(--entity-rule)" },
          { id: "rule_fi_training_duties", title: "Training and Competence Development Duties", entityType: "employer_obligation", color: "var(--entity-obligation)" },
          { id: "rule_fi_layoff", title: "Temporary Layoff (Lomautus)", entityType: "procedure", color: "var(--entity-procedure)" },
          { id: "rule_fi_liukuva_tyoaika", title: "Flexible Working Hours (Liukuva työaika)", entityType: "legal_rule", color: "var(--entity-rule)" },
          { id: "permit_fi_employed_person", title: "Residence Permit for an Employed Person", entityType: "permit_type", color: "var(--entity-permit)" },
          { id: "procedure_fi_fast_track", title: "Fast Track Immigration Procedure", entityType: "procedure", color: "var(--entity-procedure)" },
          { id: "rule_fi_te_office_check", title: "TE Office Role and Labor Market Availability Check", entityType: "legal_rule", color: "var(--entity-rule)" }
        ]
      },
      {
        label: "Offers templates",
        targets: [
          { id: "template_fi_employment_contract", title: "Employment Contract Template — Finland", entityType: "document_template", color: "var(--entity-template)" }
        ]
      }
    ]
  },

  country_portugal: {
    id: "country_portugal",
    title: "Portugal",
    entityType: "country",
    color: "var(--entity-country)",

    attributes: [
      { key: "jurisdiction type", value: "EU member state" },
      { key: "primary languages", value: "Portuguese" },
      { key: "legal areas covered", value: "Labour, Immigration" }
    ],

    relations: [
      {
        label: "Has country rules",
        targets: [
          { id: "rule_pt_banco_de_horas", title: "Individual Working Time Bank (Banco de Horas)", entityType: "legal_rule", color: "var(--entity-rule)" },
          { id: "procedure_pt_collective_dismissal", title: "Collective Dismissal Procedure", entityType: "procedure", color: "var(--entity-procedure)" },
          { id: "rule_pt_remote_work", title: "Remote Work Agreement Requirements", entityType: "legal_rule", color: "var(--entity-rule)" },
          { id: "rule_pt_meal_allowance", title: "Mandatory Meal Allowance", entityType: "benefit_scheme", color: "var(--entity-benefit)" },
          { id: "rule_pt_fixed_term", title: "Fixed-Term Contracts and Renewals", entityType: "legal_rule", color: "var(--entity-rule)" },
          { id: "rule_pt_bonuses", title: "Christmas and Vacation Bonuses", entityType: "benefit_scheme", color: "var(--entity-benefit)" },
          { id: "rule_pt_trial_periods", title: "Trial Periods by Contract Type", entityType: "legal_rule", color: "var(--entity-rule)" },
          { id: "rule_pt_accident_insurance", title: "Workplace Accident Insurance", entityType: "employer_obligation", color: "var(--entity-obligation)" },
          { id: "rule_pt_disconnect", title: "Right to Disconnect in Remote Work", entityType: "legal_rule", color: "var(--entity-rule)" },
          { id: "procedure_pt_disciplinary_dismissal", title: "Disciplinary Dismissal Procedure", entityType: "procedure", color: "var(--entity-procedure)" },
          { id: "permit_pt_work_residence", title: "Residence Visa / Permit for Subordinate Work", entityType: "permit_type", color: "var(--entity-permit)" },
          { id: "rule_pt_aima_employment_verification", title: "AIMA Verification of Employment Conditions", entityType: "legal_rule", color: "var(--entity-rule)" },
          { id: "rule_pt_employment_end_reporting", title: "Employer Notification When Foreign Worker Leaves", entityType: "employer_obligation", color: "var(--entity-obligation)" }
        ]
      },
      {
        label: "Offers templates",
        targets: [
          { id: "template_pt_employment_contract", title: "Employment Contract Template — Portugal", entityType: "document_template", color: "var(--entity-template)" },
          { id: "template_pt_remote_work_addendum", title: "Remote Work Addendum — Portugal", entityType: "document_template", color: "var(--entity-template)" }
        ]
      }
    ]
  },

  /* =====================================================
     AUTHORITIES
  ===================================================== */

  authority_bundesagentur: {
    id: "authority_bundesagentur",
    title: "Bundesagentur für Arbeit",
    entityType: "authority",
    color: "var(--entity-authority)",

    attributes: [
      { key: "country", value: "Germany" },
      { key: "role", value: "Employment approvals and labour-market related immigration checks" }
    ],

    relations: [
      {
        label: "Reviews",
        targets: [
          { id: "permit_de_blue_card", title: "EU Blue Card — Germany", entityType: "permit_type", color: "var(--entity-permit)" },
          { id: "procedure_de_accelerated_worker", title: "Accelerated Skilled Worker Procedure", entityType: "procedure", color: "var(--entity-procedure)" }
        ]
      }
    ]
  },

  authority_auslanderbehoerde: {
    id: "authority_auslanderbehoerde",
    title: "Local Immigration Authority",
    entityType: "authority",
    color: "var(--entity-authority)",

    attributes: [
      { key: "country", value: "Germany" },
      { key: "role", value: "Residence permit issuance, changes, renewals, employer change notifications" }
    ]
  },

  /* =====================================================
     DOCUMENT TEMPLATES
  ===================================================== */

  template_de_employment_contract: {
    id: "template_de_employment_contract",
    title: "Employment Contract Template — Germany",
    entityType: "document_template",
    color: "var(--entity-template)",

    attributes: [
      { key: "document type", value: "Employment contract template" },
      { key: "jurisdiction", value: "Germany" },
      { key: "covers topics", value: "role, compensation, working time, probation, notice, confidentiality" },
      { key: "usage", value: "Base template for standard employees" }
    ],

    relations: [
      {
        label: "Supports topic",
        targets: [
          { id: "topic_contracts", title: "Employment Contracts", entityType: "legal_topic", color: "var(--entity-topic)" }
        ]
      }
    ]
  },

  template_cz_employment_contract: {
    id: "template_cz_employment_contract",
    title: "Employment Contract Template — Czech Republic",
    entityType: "document_template",
    color: "var(--entity-template)",

    attributes: [
      { key: "document type", value: "Employment contract template" },
      { key: "jurisdiction", value: "Czech Republic" },
      { key: "covers topics", value: "job position, place of work, start date, salary, probation, working schedule" }
    ]
  },

  template_fi_employment_contract: {
    id: "template_fi_employment_contract",
    title: "Employment Contract Template — Finland",
    entityType: "document_template",
    color: "var(--entity-template)",

    attributes: [
      { key: "document type", value: "Employment contract template" },
      { key: "jurisdiction", value: "Finland" },
      { key: "covers topics", value: "duties, collective agreement reference, compensation, working time, leave" }
    ]
  },

  template_pt_employment_contract: {
    id: "template_pt_employment_contract",
    title: "Employment Contract Template — Portugal",
    entityType: "document_template",
    color: "var(--entity-template)",

    attributes: [
      { key: "document type", value: "Employment contract template" },
      { key: "jurisdiction", value: "Portugal" },
      { key: "covers topics", value: "trial period, salary, meal allowance, working time, fixed-term basis if applicable" }
    ]
  },

  template_pt_remote_work_addendum: {
    id: "template_pt_remote_work_addendum",
    title: "Remote Work Addendum — Portugal",
    entityType: "document_template",
    color: "var(--entity-template)",

    attributes: [
      { key: "document type", value: "Addendum / policy template" },
      { key: "jurisdiction", value: "Portugal" },
      { key: "covers topics", value: "remote workplace, equipment, expenses, availability, right to disconnect" }
    ],

    relations: [
      {
        label: "Supports topic",
        targets: [
          { id: "topic_remote_work", title: "Remote Work", entityType: "legal_topic", color: "var(--entity-topic)" }
        ]
      }
    ]
  },

  /* =====================================================
     GERMANY — LABOUR
  ===================================================== */

  rule_de_works_council: {
    id: "rule_de_works_council",
    title: "Works Council Thresholds & Rights",
    entityType: "legal_rule",
    color: "var(--entity-rule)",

    attributes: [
      { key: "country", value: "Germany" },
      { key: "topic", value: "Employee Representation" },
      { key: "question coverage", value: "works council thresholds, consultation, co-determination over HR and working time" },
      { key: "answer shape", value: "threshold + scope of rights + required consultation points" }
    ],

    relations: [
      {
        label: "Applies to topic",
        targets: [
          { id: "topic_representation", title: "Employee Representation", entityType: "legal_topic", color: "var(--entity-topic)" }
        ]
      }
    ]
  },

  rule_de_kurzarbeit: {
    id: "rule_de_kurzarbeit",
    title: "Kurzarbeit Procedure",
    entityType: "procedure",
    color: "var(--entity-procedure)",

    attributes: [
      { key: "country", value: "Germany" },
      { key: "topic", value: "Working Time / Temporary Reduction of Work" },
      { key: "question coverage", value: "how Kurzarbeit works, who approves, what documentation is needed" },
      { key: "answer shape", value: "trigger + consultation / agreement + authority approval + payroll effect" }
    ],

    relations: [
      {
        label: "Involves authority",
        targets: [
          { id: "authority_bundesagentur", title: "Bundesagentur für Arbeit", entityType: "authority", color: "var(--entity-authority)" }
        ]
      },
      {
        label: "Applies to topic",
        targets: [
          { id: "topic_working_time", title: "Working Time", entityType: "legal_topic", color: "var(--entity-topic)" }
        ]
      }
    ]
  },

  rule_de_fixed_term: {
    id: "rule_de_fixed_term",
    title: "Fixed-Term Contracts Without Objective Reason",
    entityType: "legal_rule",
    color: "var(--entity-rule)",

    attributes: [
      { key: "country", value: "Germany" },
      { key: "topic", value: "Employment Contracts" },
      { key: "question coverage", value: "fixed-term contracts without objective reason, renewals, limits" },
      { key: "answer shape", value: "allowed / not allowed + duration limit + renewal logic + exceptions" }
    ],

    relations: [
      {
        label: "Applies to topic",
        targets: [
          { id: "topic_contracts", title: "Employment Contracts", entityType: "legal_topic", color: "var(--entity-topic)" }
        ]
      }
    ]
  },

  rule_de_dismissal_protection: {
    id: "rule_de_dismissal_protection",
    title: "Dismissal Protection Act Applicability",
    entityType: "legal_rule",
    color: "var(--entity-rule)",

    attributes: [
      { key: "country", value: "Germany" },
      { key: "topic", value: "Termination" },
      { key: "question coverage", value: "when unfair dismissal protection applies, standard termination vs probation" },
      { key: "answer shape", value: "threshold + tenure requirement + effect on dismissal grounds and process" }
    ],

    relations: [
      {
        label: "Applies to topic",
        targets: [
          { id: "topic_termination", title: "Termination", entityType: "legal_topic", color: "var(--entity-topic)" }
        ]
      }
    ]
  },

  rule_de_sunday_work: {
    id: "rule_de_sunday_work",
    title: "Sunday & Public Holiday Work Restrictions",
    entityType: "legal_rule",
    color: "var(--entity-rule)",

    attributes: [
      { key: "country", value: "Germany" },
      { key: "topic", value: "Working Time" },
      { key: "question coverage", value: "Sunday work prohibition, exemptions, compensatory rest" },
      { key: "answer shape", value: "general prohibition + sector exceptions + employer obligations" }
    ]
  },

  rule_de_working_time_docs: {
    id: "rule_de_working_time_docs",
    title: "Working Time Documentation Requirements",
    entityType: "legal_rule",
    color: "var(--entity-rule)",

    attributes: [
      { key: "country", value: "Germany" },
      { key: "topic", value: "Working Time" },
      { key: "question coverage", value: "time registration, tracking method, retention of records" },
      { key: "answer shape", value: "is tracking mandatory + what must be recorded + who keeps records" }
    ]
  },

  rule_de_freistellung: {
    id: "rule_de_freistellung",
    title: "Freistellung / Garden Leave",
    entityType: "legal_rule",
    color: "var(--entity-rule)",

    attributes: [
      { key: "country", value: "Germany" },
      { key: "topic", value: "Termination" },
      { key: "question coverage", value: "garden leave legality, paid release, offset of vacation, revocable / irrevocable release" },
      { key: "answer shape", value: "when possible + conditions + payroll / leave treatment" }
    ]
  },

  /* =====================================================
     GERMANY — IMMIGRATION
  ===================================================== */

  permit_de_blue_card: {
    id: "permit_de_blue_card",
    title: "EU Blue Card — Germany",
    entityType: "permit_type",
    color: "var(--entity-permit)",

    attributes: [
      { key: "country", value: "Germany" },
      { key: "permit family", value: "Residence permit for highly skilled employment" },
      { key: "question coverage", value: "eligibility, salary threshold, approval flow, employer change, family reunification" },
      { key: "answer shape", value: "eligibility + documents + thresholds + authority path + post-approval duties" }
    ],

    relations: [
      {
        label: "Applies to topic",
        targets: [
          { id: "topic_blue_card", title: "EU Blue Card", entityType: "legal_topic", color: "var(--entity-topic)" },
          { id: "topic_work_authorization", title: "Work Authorization", entityType: "legal_topic", color: "var(--entity-topic)" }
        ]
      },
      {
        label: "Reviewed by",
        targets: [
          { id: "authority_bundesagentur", title: "Bundesagentur für Arbeit", entityType: "authority", color: "var(--entity-authority)" },
          { id: "authority_auslanderbehoerde", title: "Local Immigration Authority", entityType: "authority", color: "var(--entity-authority)" }
        ]
      }
    ]
  },

  procedure_de_accelerated_worker: {
    id: "procedure_de_accelerated_worker",
    title: "Accelerated Skilled Worker Procedure",
    entityType: "procedure",
    color: "var(--entity-procedure)",

    attributes: [
      { key: "country", value: "Germany" },
      { key: "topic", value: "Employer Sponsorship / Work Authorization" },
      { key: "question coverage", value: "expedited processing, employer role, filings before visa issuance" },
      { key: "answer shape", value: "eligibility + employer actions + authority workflow + expected timeline" }
    ]
  },

  /* =====================================================
     CZECH REPUBLIC — LABOUR
  ===================================================== */

  rule_cz_probation: {
    id: "rule_cz_probation",
    title: "Three-Month Statutory Probation",
    entityType: "legal_rule",
    color: "var(--entity-rule)",

    attributes: [
      { key: "country", value: "Czech Republic" },
      { key: "topic", value: "Probation" },
      { key: "question coverage", value: "three-month probation operation, statutory maximum, termination during probation" },
      { key: "answer shape", value: "limit + how agreed + who it applies to + dismissal consequences" }
    ],

    relations: [
      {
        label: "Applies to topic",
        targets: [
          { id: "topic_probation", title: "Probation", entityType: "legal_topic", color: "var(--entity-topic)" }
        ]
      }
    ]
  },

  rule_cz_dpp_dpc: {
    id: "rule_cz_dpp_dpc",
    title: "Agreements Outside Employment Relationship (DPP / DPČ)",
    entityType: "contract_type",
    color: "var(--entity-contract-type)",

    attributes: [
      { key: "country", value: "Czech Republic" },
      { key: "contract family", value: "Non-standard labour arrangements" },
      { key: "question coverage", value: "DPP / DPČ legal regime, working limits, HR handling, differences from employment contracts" },
      { key: "answer shape", value: "definition + thresholds + rights + payroll / admin implications" }
    ],

    relations: [
      {
        label: "Alternative to",
        targets: [
          { id: "topic_contracts", title: "Employment Contracts", entityType: "legal_topic", color: "var(--entity-topic)" }
        ]
      }
    ]
  },

  rule_cz_meal_allowance: {
    id: "rule_cz_meal_allowance",
    title: "Meal Allowance / Meal Voucher Rules",
    entityType: "benefit_scheme",
    color: "var(--entity-benefit)",

    attributes: [
      { key: "country", value: "Czech Republic" },
      { key: "topic", value: "Mandatory Benefits" },
      { key: "question coverage", value: "when meal allowance or vouchers must be provided" },
      { key: "answer shape", value: "is mandatory or conditional + who qualifies + payroll / tax treatment if relevant" }
    ]
  },

  rule_cz_sick_leave_14_days: {
    id: "rule_cz_sick_leave_14_days",
    title: "Sick Leave Compensation — First 14 Days",
    entityType: "legal_rule",
    color: "var(--entity-rule)",

    attributes: [
      { key: "country", value: "Czech Republic" },
      { key: "topic", value: "Leave Entitlements" },
      { key: "question coverage", value: "employer compensation obligations during first 14 days of sickness" },
      { key: "answer shape", value: "who pays + for which days + what certificate flow is needed" }
    ]
  },

  procedure_cz_e_neschopenka: {
    id: "procedure_cz_e_neschopenka",
    title: "Electronic Sick Leave Submission (E-Neschopenka)",
    entityType: "procedure",
    color: "var(--entity-procedure)",

    attributes: [
      { key: "country", value: "Czech Republic" },
      { key: "topic", value: "Sick Leave Certification" },
      { key: "question coverage", value: "electronic submission of sickness certificates and employer handling" },
      { key: "answer shape", value: "certificate source + HR workflow + evidence and payroll implications" }
    ]
  },

  rule_cz_redundancy: {
    id: "rule_cz_redundancy",
    title: "Termination Due to Redundancy",
    entityType: "legal_rule",
    color: "var(--entity-rule)",

    attributes: [
      { key: "country", value: "Czech Republic" },
      { key: "topic", value: "Termination" },
      { key: "question coverage", value: "redundancy grounds, notice, severance, required documents" },
      { key: "answer shape", value: "valid ground + notice + severance + documentation package" }
    ]
  },

  rule_cz_non_compete: {
    id: "rule_cz_non_compete",
    title: "Post-Termination Non-Compete",
    entityType: "legal_rule",
    color: "var(--entity-rule)",

    attributes: [
      { key: "country", value: "Czech Republic" },
      { key: "topic", value: "Employment Contracts" },
      { key: "question coverage", value: "validity and compensation of post-termination non-competes" },
      { key: "answer shape", value: "enforceability + required compensation + formal requirements" }
    ]
  },

  rule_cz_occupational_exam: {
    id: "rule_cz_occupational_exam",
    title: "Occupational Physician Medical Exams",
    entityType: "legal_rule",
    color: "var(--entity-rule)",

    attributes: [
      { key: "country", value: "Czech Republic" },
      { key: "topic", value: "Occupational Health & Safety" },
      { key: "question coverage", value: "pre-employment and periodic medical examinations" },
      { key: "answer shape", value: "when required + by whom + before which roles" }
    ]
  },

  /* =====================================================
     CZECH REPUBLIC — IMMIGRATION
  ===================================================== */

  permit_cz_employee_card: {
    id: "permit_cz_employee_card",
    title: "Employee Card — Czech Republic",
    entityType: "permit_type",
    color: "var(--entity-permit)",

    attributes: [
      { key: "country", value: "Czech Republic" },
      { key: "permit family", value: "Combined residence and work authorization" },
      { key: "question coverage", value: "vacancy listing, sponsorship documents, processing time, employer change, expiry handling" },
      { key: "answer shape", value: "eligibility + job registration + employer docs + change / renewal rules" }
    ]
  },

  permit_cz_blue_card: {
    id: "permit_cz_blue_card",
    title: "Blue Card — Czech Republic",
    entityType: "permit_type",
    color: "var(--entity-permit)",

    attributes: [
      { key: "country", value: "Czech Republic" },
      { key: "permit family", value: "Highly qualified worker residence permit" },
      { key: "question coverage", value: "difference from Employee Card, eligibility, sponsor requirements" },
      { key: "answer shape", value: "comparison + thresholds + required employer documents" }
    ]
  },

  procedure_cz_vacancy_registration: {
    id: "procedure_cz_vacancy_registration",
    title: "Vacancy Registration for Employee Card Sponsorship",
    entityType: "procedure",
    color: "var(--entity-procedure)",

    attributes: [
      { key: "country", value: "Czech Republic" },
      { key: "topic", value: "Employer Sponsorship" },
      { key: "question coverage", value: "central job vacancies database listing and waiting period before hiring non-EU worker" },
      { key: "answer shape", value: "when listing is required + how long + what vacancy data must be filed" }
    ]
  },

  rule_cz_foreigner_reporting: {
    id: "rule_cz_foreigner_reporting",
    title: "Employer Reporting to Labour Office",
    entityType: "employer_obligation",
    color: "var(--entity-obligation)",

    attributes: [
      { key: "country", value: "Czech Republic" },
      { key: "topic", value: "Reporting Obligations" },
      { key: "question coverage", value: "hiring / termination notifications, retention of residence and work authorization copies" },
      { key: "answer shape", value: "what must be reported + when + recordkeeping duties" }
    ]
  },

  /* =====================================================
     FINLAND — LABOUR
  ===================================================== */

  rule_fi_general_collective_agreements: {
    id: "rule_fi_general_collective_agreements",
    title: "General Applicability of Collective Agreements",
    entityType: "legal_rule",
    color: "var(--entity-rule)",

    attributes: [
      { key: "country", value: "Finland" },
      { key: "topic", value: "Employee Representation / Terms of Employment" },
      { key: "question coverage", value: "how generally binding collective agreements affect employers and employment terms" },
      { key: "answer shape", value: "when agreement applies + effect on minimum terms + HR implications" }
    ]
  },

  procedure_fi_yt_negotiations: {
    id: "procedure_fi_yt_negotiations",
    title: "Co-operation / Change Negotiations",
    entityType: "procedure",
    color: "var(--entity-procedure)",

    attributes: [
      { key: "country", value: "Finland" },
      { key: "topic", value: "Redundancies / Change Management" },
      { key: "question coverage", value: "when YT-negotiations are required and how the process works" },
      { key: "answer shape", value: "employee threshold + triggers + process steps + consultation timing" }
    ]
  },

  rule_fi_occupational_healthcare: {
    id: "rule_fi_occupational_healthcare",
    title: "Occupational Healthcare Provision",
    entityType: "legal_rule",
    color: "var(--entity-rule)",

    attributes: [
      { key: "country", value: "Finland" },
      { key: "topic", value: "Occupational Health & Safety" },
      { key: "question coverage", value: "employer duty to provide occupational healthcare" },
      { key: "answer shape", value: "mandatory scope + optional extended care + documentation / provider arrangement" }
    ]
  },

  rule_fi_working_time_bank: {
    id: "rule_fi_working_time_bank",
    title: "Working Time Bank",
    entityType: "legal_rule",
    color: "var(--entity-rule)",

    attributes: [
      { key: "country", value: "Finland" },
      { key: "topic", value: "Working Time" },
      { key: "question coverage", value: "working time bank legality and agreement requirements" },
      { key: "answer shape", value: "whether allowed + what agreement is needed + how balances are used" }
    ]
  },

  rule_fi_parental_leave: {
    id: "rule_fi_parental_leave",
    title: "Family Leave Reform / Parental Leave",
    entityType: "legal_rule",
    color: "var(--entity-rule)",

    attributes: [
      { key: "country", value: "Finland" },
      { key: "topic", value: "Leave Entitlements" },
      { key: "question coverage", value: "parental leave entitlement after family leave reform" },
      { key: "answer shape", value: "leave buckets + who can use them + employer administration implications" }
    ]
  },

  rule_fi_training_duties: {
    id: "rule_fi_training_duties",
    title: "Training and Competence Development Duties",
    entityType: "employer_obligation",
    color: "var(--entity-obligation)",

    attributes: [
      { key: "country", value: "Finland" },
      { key: "topic", value: "Training / Competence" },
      { key: "question coverage", value: "employer obligations regarding employee competence development" },
      { key: "answer shape", value: "is mandatory / contextual + when triggered + link to reorganization / redundancy contexts" }
    ]
  },

  rule_fi_layoff: {
    id: "rule_fi_layoff",
    title: "Temporary Layoff (Lomautus)",
    entityType: "procedure",
    color: "var(--entity-procedure)",

    attributes: [
      { key: "country", value: "Finland" },
      { key: "topic", value: "Temporary Layoff" },
      { key: "question coverage", value: "how temporary layoff works, notice, consultation, payroll consequences" },
      { key: "answer shape", value: "trigger + process + duration logic + employee status during layoff" }
    ]
  },

  rule_fi_liukuva_tyoaika: {
    id: "rule_fi_liukuva_tyoaika",
    title: "Flexible Working Hours (Liukuva työaika)",
    entityType: "legal_rule",
    color: "var(--entity-rule)",

    attributes: [
      { key: "country", value: "Finland" },
      { key: "topic", value: "Working Time / Flexible Working Arrangements" },
      { key: "question coverage", value: "legal operation of liukuva työaika" },
      { key: "answer shape", value: "agreement basis + flex window + tracking requirements" }
    ]
  },

  /* =====================================================
     FINLAND — IMMIGRATION
  ===================================================== */

  permit_fi_employed_person: {
    id: "permit_fi_employed_person",
    title: "Residence Permit for an Employed Person",
    entityType: "permit_type",
    color: "var(--entity-permit)",

    attributes: [
      { key: "country", value: "Finland" },
      { key: "permit family", value: "Standard work-based residence permit" },
      { key: "question coverage", value: "when required, TE Office role, labor market test, employer duties, change of employer" },
      { key: "answer shape", value: "who needs it + workflow + review bodies + post-hire obligations" }
    ]
  },

  procedure_fi_fast_track: {
    id: "procedure_fi_fast_track",
    title: "Fast Track Immigration Procedure",
    entityType: "procedure",
    color: "var(--entity-procedure)",

    attributes: [
      { key: "country", value: "Finland" },
      { key: "topic", value: "Work Authorization" },
      { key: "question coverage", value: "fast track for specialists, startups and families" },
      { key: "answer shape", value: "eligible groups + filing path + expected processing logic" }
    ]
  },

  rule_fi_te_office_check: {
    id: "rule_fi_te_office_check",
    title: "TE Office Role and Labor Market Availability Check",
    entityType: "legal_rule",
    color: "var(--entity-rule)",

    attributes: [
      { key: "country", value: "Finland" },
      { key: "topic", value: "Employer Sponsorship" },
      { key: "question coverage", value: "TE Office involvement and labour market availability review" },
      { key: "answer shape", value: "when review applies + what employer must show + effect on permit issuance" }
    ]
  },

  /* =====================================================
     PORTUGAL — LABOUR
  ===================================================== */

  rule_pt_banco_de_horas: {
    id: "rule_pt_banco_de_horas",
    title: "Individual Working Time Bank (Banco de Horas)",
    entityType: "legal_rule",
    color: "var(--entity-rule)",

    attributes: [
      { key: "country", value: "Portugal" },
      { key: "topic", value: "Working Time" },
      { key: "question coverage", value: "individual working time bank under Portuguese labour law" },
      { key: "answer shape", value: "agreement basis + overtime / time-off balancing + statutory limits" }
    ]
  },

  procedure_pt_collective_dismissal: {
    id: "procedure_pt_collective_dismissal",
    title: "Collective Dismissal Procedure",
    entityType: "procedure",
    color: "var(--entity-procedure)",

    attributes: [
      { key: "country", value: "Portugal" },
      { key: "topic", value: "Termination" },
      { key: "question coverage", value: "collective dismissal steps, consultation, notices, authority involvement" },
      { key: "answer shape", value: "trigger thresholds + process steps + mandatory documentation" }
    ]
  },

  rule_pt_remote_work: {
    id: "rule_pt_remote_work",
    title: "Remote Work Agreement Requirements",
    entityType: "legal_rule",
    color: "var(--entity-rule)",

    attributes: [
      { key: "country", value: "Portugal" },
      { key: "topic", value: "Remote Work" },
      { key: "question coverage", value: "whether remote work is regulated and what agreement terms are required" },
      { key: "answer shape", value: "is allowed + mandatory clauses + expenses / equipment / availability rules" }
    ]
  },

  rule_pt_meal_allowance: {
    id: "rule_pt_meal_allowance",
    title: "Mandatory Meal Allowance",
    entityType: "benefit_scheme",
    color: "var(--entity-benefit)",

    attributes: [
      { key: "country", value: "Portugal" },
      { key: "topic", value: "Mandatory Benefits" },
      { key: "question coverage", value: "when meal allowance applies and how employers handle it" },
      { key: "answer shape", value: "mandatory / market-standard distinction + eligible employees + payment form" }
    ]
  },

  rule_pt_fixed_term: {
    id: "rule_pt_fixed_term",
    title: "Fixed-Term Contracts and Renewals",
    entityType: "legal_rule",
    color: "var(--entity-rule)",

    attributes: [
      { key: "country", value: "Portugal" },
      { key: "topic", value: "Employment Contracts" },
      { key: "question coverage", value: "fixed-term contract requirements, objective grounds, renewal limits, termination compensation" },
      { key: "answer shape", value: "valid basis + max duration / renewals + end-of-term consequences" }
    ]
  },

  rule_pt_bonuses: {
    id: "rule_pt_bonuses",
    title: "Christmas and Vacation Bonuses",
    entityType: "benefit_scheme",
    color: "var(--entity-benefit)",

    attributes: [
      { key: "country", value: "Portugal" },
      { key: "topic", value: "Mandatory Benefits" },
      { key: "question coverage", value: "mandatory Christmas bonus and vacation bonus" },
      { key: "answer shape", value: "who gets them + when paid + relation to salary structure" }
    ]
  },

  rule_pt_trial_periods: {
    id: "rule_pt_trial_periods",
    title: "Trial Periods by Contract Type",
    entityType: "legal_rule",
    color: "var(--entity-rule)",

    attributes: [
      { key: "country", value: "Portugal" },
      { key: "topic", value: "Probation" },
      { key: "question coverage", value: "trial periods depending on role / contract type" },
      { key: "answer shape", value: "default length + variations + termination during trial" }
    ]
  },

  rule_pt_accident_insurance: {
    id: "rule_pt_accident_insurance",
    title: "Workplace Accident Insurance",
    entityType: "employer_obligation",
    color: "var(--entity-obligation)",

    attributes: [
      { key: "country", value: "Portugal" },
      { key: "topic", value: "Occupational Health & Safety" },
      { key: "question coverage", value: "mandatory workplace accident insurance and employer duties after accidents" },
      { key: "answer shape", value: "insurance duty + reporting / documentation + employee protection consequences" }
    ]
  },

  rule_pt_disconnect: {
    id: "rule_pt_disconnect",
    title: "Right to Disconnect in Remote Work",
    entityType: "legal_rule",
    color: "var(--entity-rule)",

    attributes: [
      { key: "country", value: "Portugal" },
      { key: "topic", value: "Remote Work" },
      { key: "question coverage", value: "right to disconnect for remote employees" },
      { key: "answer shape", value: "scope of employer duty + prohibited conduct + policy implications" }
    ]
  },

  procedure_pt_disciplinary_dismissal: {
    id: "procedure_pt_disciplinary_dismissal",
    title: "Disciplinary Dismissal Procedure",
    entityType: "procedure",
    color: "var(--entity-procedure)",

    attributes: [
      { key: "country", value: "Portugal" },
      { key: "topic", value: "Termination" },
      { key: "question coverage", value: "steps for disciplinary dismissal and required performance / misconduct documentation" },
      { key: "answer shape", value: "investigation + notice + defense rights + final decision requirements" }
    ]
  },

  /* =====================================================
     PORTUGAL — IMMIGRATION
  ===================================================== */

  permit_pt_work_residence: {
    id: "permit_pt_work_residence",
    title: "Residence Visa / Permit for Subordinate Work",
    entityType: "permit_type",
    color: "var(--entity-permit)",

    attributes: [
      { key: "country", value: "Portugal" },
      { key: "permit family", value: "Work-based residence authorization" },
      { key: "question coverage", value: "contract requirements, employer docs, authority verification, family accompaniment, expiry / employment end issues" },
      { key: "answer shape", value: "eligibility + contract quality + filing package + employer follow-up duties" }
    ]
  },

  rule_pt_aima_employment_verification: {
    id: "rule_pt_aima_employment_verification",
    title: "AIMA Verification of Employment Conditions",
    entityType: "legal_rule",
    color: "var(--entity-rule)",

    attributes: [
      { key: "country", value: "Portugal" },
      { key: "topic", value: "Employer Sponsorship" },
      { key: "question coverage", value: "how authorities verify salary and employment conditions for foreign workers" },
      { key: "answer shape", value: "what must match labour law + what employer documents must demonstrate" }
    ]
  },

  rule_pt_employment_end_reporting: {
    id: "rule_pt_employment_end_reporting",
    title: "Employer Notification When Foreign Worker Leaves",
    entityType: "employer_obligation",
    color: "var(--entity-obligation)",

    attributes: [
      { key: "country", value: "Portugal" },
      { key: "topic", value: "Reporting Obligations" },
      { key: "question coverage", value: "authority notification duties if foreign employee ceases employment" },
      { key: "answer shape", value: "who must be notified + when + what records should remain on file" }
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