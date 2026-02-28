function initNav() {
  const header = document.getElementById("site-header");
  const button = document.getElementById("menu-toggle");
  const nav = document.getElementById("primary-nav");
  const overlay = document.getElementById("nav-overlay");

  if (!header || !button || !nav || !overlay) return;

  const navLinks = nav.querySelectorAll<HTMLAnchorElement>("a");

  const setOpen = (open: boolean) => {
    header.dataset.open = String(open);
    button.setAttribute("aria-expanded", String(open));
    nav.setAttribute("aria-hidden", String(!open));
    document.body.style.overflow = open ? "hidden" : "";
  };

  const isOpen = () => header.dataset.open === "true";

  const toggleMenu = () => setOpen(!isOpen());

  button.addEventListener("click", toggleMenu);
  overlay.addEventListener("click", () => setOpen(false));

  navLinks.forEach((link) => {
    link.addEventListener("click", () => setOpen(false));
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setOpen(false);
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initNav);
} else {
  initNav();
}