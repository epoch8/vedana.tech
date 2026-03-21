// lib/seo/navigationSchema.ts

import type { NavItem, NavSection } from "@/content/navigation/navigation";

/* ======================================================
   TYPES
====================================================== */

export type SiteNavigationNode = {
  "@type": "SiteNavigationElement";
  position: number;
  name: string;
  url: string;
  description?: string;
};

export type SiteNavigationSchema = {
  "@context": "https://schema.org";
  "@type": "ItemList";
  name?: string;
  itemListElement: SiteNavigationNode[];
};

/* ======================================================
   HELPERS
====================================================== */

function normalizeBaseUrl(baseUrl: string): string {
  return baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
}

function normalizeHref(href: string): string {
  if (!href) return "/";
  return href.startsWith("/") ? href : `/${href}`;
}

function isAbsoluteUrl(href: string): boolean {
  return /^https?:\/\//i.test(href);
}

function toAbsoluteUrl(baseUrl: string, href: string): string {
  if (isAbsoluteUrl(href)) return href;
  return `${normalizeBaseUrl(baseUrl)}${normalizeHref(href)}`;
}

/* ======================================================
   FILTER (ЕДИНАЯ ЛОГИКА)
====================================================== */

function isEnabled(item: NavItem): boolean {
  return item.enabled !== false;
}

function isIndexable(item: NavItem, includeExternal: boolean): boolean {
  if (!isEnabled(item)) return false;
  if (!includeExternal && item.external) return false;
  return true;
}

/* ======================================================
   MAPPERS
====================================================== */

function toNavigationNode(
  baseUrl: string,
  item: NavItem,
  position: number
): SiteNavigationNode {
  const node: SiteNavigationNode = {
    "@type": "SiteNavigationElement",
    position,
    name: item.label,
    url: toAbsoluteUrl(baseUrl, item.href),
  };

  if (item.description) {
    node.description = item.description;
  }

  return node;
}

function flattenSections(sections: NavSection[]): NavItem[] {
  return sections
    .filter((section) => section.enabled !== false)
    .flatMap((section) => section.items);
}

/* ======================================================
   GENERIC BUILDER
====================================================== */

export function buildSiteNavigationSchema(
  baseUrl: string,
  items: NavItem[],
  options?: {
    name?: string;
    includeExternal?: boolean;
  }
): SiteNavigationSchema {
  const includeExternal = options?.includeExternal ?? false;

  const filteredItems = items.filter((item) =>
    isIndexable(item, includeExternal)
  );

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    ...(options?.name ? { name: options.name } : {}),
    itemListElement: filteredItems.map((item, index) =>
      toNavigationNode(baseUrl, item, index + 1)
    ),
  };
}

/* ======================================================
   SPECIALIZED BUILDERS
====================================================== */

export function buildMainNavSchema(
  baseUrl: string,
  items: NavItem[]
): SiteNavigationSchema {
  return buildSiteNavigationSchema(baseUrl, items, {
    name: "Main navigation",
    includeExternal: false,
  });
}

export function buildFooterNavSchema(
  baseUrl: string,
  sections: NavSection[]
): SiteNavigationSchema {
  return buildSiteNavigationSchema(
    baseUrl,
    flattenSections(sections),
    {
      name: "Footer navigation",
      includeExternal: false,
    }
  );
}