function initNav() {
  const header = document.getElementById("site-header");
  const button = document.getElementById("menu-toggle");
  const nav = header?.querySelector("nav");

  if (!header || !button || !nav) return;

  const navLinks = Array.from(
    header.querySelectorAll<HTMLAnchorElement>("nav a")
  );

  const closeMenu = () => {
    header.dataset.open = "false";
    button.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  };

  const openMenu = () => {
    header.dataset.open = "true";
    button.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  };

  button.addEventListener("click", (e) => {
    e.stopPropagation(); // чтобы клик не улетал в document
    header.dataset.open === "true" ? closeMenu() : openMenu();
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key === "Escape") closeMenu();
  });

  /* 🔥 Клик вне меню */
  document.addEventListener("click", (e) => {
    if (header.dataset.open !== "true") return;

    const target = e.target as Node;

    // если клик вне nav и вне кнопки
    if (!nav.contains(target) && !button.contains(target)) {
      closeMenu();
    }
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initNav);
} else {
  initNav();
}