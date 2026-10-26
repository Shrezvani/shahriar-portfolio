/* Native disclosure works without JavaScript; enhance closing and focus behavior. */
(() => {
  "use strict";
  const menu = document.querySelector(".mobile-menu");
  if (!menu) return;
  const summary = menu.querySelector("summary");
  const close = (restoreFocus = false) => {
    if (!menu.open) return;
    menu.open = false;
    if (restoreFocus) summary.focus();
  };
  document.addEventListener("click", event => {
    const link = event.target.closest(".mobile-menu a");
    if (link) {
      close();
      const destination = new URL(link.href);
      if (destination.pathname === location.pathname && destination.hash) {
        const target = document.getElementById(destination.hash.slice(1));
        if (target) {
          // Move focus out of the now-closed disclosure before continuing by keyboard.
          const temporaryTabindex = !target.hasAttribute("tabindex");
          if (temporaryTabindex) target.setAttribute("tabindex", "-1");
          target.focus({ preventScroll: true });
          if (temporaryTabindex) target.addEventListener("blur", () => target.removeAttribute("tabindex"), { once: true });
        }
      }
    } else if (!menu.contains(event.target)) close();
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && menu.open) {
      event.preventDefault();
      close(true);
    }
  });
  document.addEventListener("focusin", event => {
    if (!menu.contains(event.target)) close();
  });
  window.addEventListener("hashchange", () => close());
  window.matchMedia("(min-width: 721px)").addEventListener("change", event => {
    if (event.matches) close(menu.contains(document.activeElement));
  });
})();
