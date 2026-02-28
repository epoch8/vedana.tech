import type { NavItem } from "@/components/blocks/header/Nav.astro";


export const navItems: NavItem[]  = [
  { label: "Industries", href: "/industries" },
  { label: "Problem", href: "/#problem" },
  { label: "Demo", href: "/#demo" },
  { label: "Methodology", href: "/#methodology" },
  { label: "FAQ", href: "/#faq" },
  { label: "Docs", href: "/docs" },
  { label: "Get started", href: "/#signup", kind: "cta" },
];