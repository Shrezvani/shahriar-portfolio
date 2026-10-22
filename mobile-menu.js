/* Delegation also handles the homepage runtime replacing its initial markup. */
(function () {
  "use strict";
  function closeMenus(returnFocus) {
    document.querySelectorAll(".g-mobile-menu[open]").forEach(function (menu) {
      menu.open = false;
      if (returnFocus) menu.querySelector("summary").focus();
    });
  }
  document.addEventListener("click", function (event) {
    if (event.target.closest(".g-mobile-links a")) closeMenus(false);
    else if (!event.target.closest(".g-mobile-menu")) closeMenus(false);
  });
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeMenus(true);
  });
  window.addEventListener("hashchange", function () { closeMenus(false); });
  window.matchMedia("(min-width: 721px)").addEventListener("change", function (event) {
    if (event.matches) closeMenus(false);
  });
}());
