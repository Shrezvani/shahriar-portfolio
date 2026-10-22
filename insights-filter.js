"use strict";
(() => {
  const initialized = new WeakSet();
  const topics = ["All", "Mobility & Transport", "Leadership & People", "Strategy & Transformation"];
  const render = (controls, topic) => {
    const home = controls.closest("[data-home-insights]");
    const scope = home || document.querySelector("main");
    if (!scope) return;
    const cards = Array.from(scope.querySelectorAll(".reading-card"));
    let shown = 0;
    cards.forEach(card => {
      const matches = topic === "All" || card.dataset.insightTag === topic;
      card.hidden = !matches || (!!home && shown >= 6);
      if (!card.hidden) shown++;
    });
    controls.querySelectorAll("button").forEach(button => {
      button.setAttribute("aria-pressed", String(button.dataset.insightFilter === topic));
    });
    const status = scope.querySelector("#insight-count");
    if (status) status.textContent = home
      ? (topic === "All" ? "Selected perspectives across mobility, leadership and strategy" : topic + " perspectives")
      : (topic === "All" ? "Newest first" : topic + " · Newest first");
    const explore = scope.querySelector("[data-explore-insights]");
    if (explore) {
      explore.href = "/insights/" + (topic === "All" ? "" : "?topic=" + encodeURIComponent(topic));
      explore.textContent = topic === "All" ? "Explore all insights →" : "Explore more in " + topic + " →";
    }
  };
  const init = () => {
    const controls = document.getElementById("insight-filters");
    if (!controls || initialized.has(controls)) return;
    initialized.add(controls);
    controls.hidden = false;
    const requested = new URLSearchParams(location.search).get("topic");
    render(controls, topics.includes(requested) ? requested : "All");
  };
  document.addEventListener("click", event => {
    const button = event.target.closest("[data-insight-filter]");
    const controls = button && button.closest("#insight-filters");
    if (controls && topics.includes(button.dataset.insightFilter)) render(controls, button.dataset.insightFilter);
  });
  const start = () => {
    init();
    // The homepage component may replace its markup after DOMContentLoaded.
    new MutationObserver(init).observe(document.body, { childList: true, subtree: true });
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
