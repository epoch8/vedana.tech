// config/navigation.ts

/* ======================================================
   TYPES
====================================================== */

export type NavItem = {
  label: string;
  href: string;
  description?: string;

  external?: boolean; // ссылка наружу
  enabled?: boolean;  // можно выключать без удаления
};

export type NavSection = {
  title: string;

  items: NavItem[];

  enabled?: boolean; // можно скрыть целую колонку
};

export type FooterMeta = {
  tagline: string;
  company: string;
};

/* ======================================================
   META
====================================================== */

export const footerMeta: FooterMeta = {
  tagline:
    "Vedana turns your documents into structured data and lets AI explore it with tools",
  company: "Epoch8 LLC",
};

/* ======================================================
   MAIN NAV
====================================================== */

export const mainNav: NavItem[] = [
  {
    label: "Product",
    href: "/product",
    description: "Platform overview and capabilities",
    enabled: true,
  },
  {
    label: "Industries",
    href: "/industries",
    description: "Solutions by domain",
    enabled: true,
  },
  {
    label: "Resources",
    href: "/resources",
    description: "Docs, concepts, and guides",
    enabled: true,
  },
  {
    label: "Company",
    href: "/company",
    description: "About Vedana and team",
    enabled: false,
  },
];

/* ======================================================
   FOOTER NAV
====================================================== */

export const footerNav: NavSection[] = [
  {
    title: "Product",
    enabled: true,

    items: [
      {
        label: "Docs",
        href: "/docs",
        enabled: true,
      },
      {
        label: "GitHub",
        href: "https://github.com/epoch8/vedana",
        external: true,
        enabled: true,
      },
    ],
  },
  {
    title: "Industries",
    enabled: true,

    items: [
      {
        label: "Legal",
        href: "/industries/legal",
        enabled: false,
      },
      {
        label: "HoReCa",
        href: "/industries/horeca",
        enabled: true,
      },
      {
        label: "Development",
        href: "/industries/development",
        enabled: true,
      },
      {
        label: "Support",
        href: "/industries/support",
        enabled: false,
      },
    ],
  },
  {
    title: "Resources",
    enabled: true,

    items: [
      {
        label: "Minimal Modeling",
        href: "https://minimalmodeling.com/",
          external: true,
        enabled: true,
      },
      {
        label: "Database Design Book",
        href: "https://databasedesignbook.com/",
        external: true,
        enabled: true,
      },
    ],
  },
  {
    title: "Company",
    enabled: true,

    items: [
      {
        label: "About",
        href: "/about",
        enabled: true,
      },
      {
        label: "Careers",
        href: "/careers",
        enabled: false,
      },
      {
        label: "Contact",
        href: "/contact",
        enabled: true,
      },
      {
        label: "Legal",
        href: "/legal",
        enabled: false,
      },
    ],
  },
];