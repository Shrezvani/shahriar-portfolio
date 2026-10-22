"use strict";
document.addEventListener("DOMContentLoaded", () => {
  const controls = document.getElementById("insight-filters");
  if (!controls) return;
  const cards = Array.from(document.querySelectorAll(".reading-card"));
  controls.hidden = false;
  controls.addEventListener("click", (event) => {
    const button = event.target.closest("[data-insight-filter]");
    if (!button) return;
    const tag = button.dataset.insightFilter;
    controls.querySelectorAll("button").forEach(item => item.setAttribute("aria-pressed", String(item === button)));
    let count = 0;
    cards.forEach(card => {
      card.hidden = tag !== "All" && card.dataset.insightTag !== tag;
      if (!card.hidden) count++;
    });
    document.getElementById("insight-count").textContent = count + (count === 1 ? " insight" : " insights") + " · Newest first";
  });
});
