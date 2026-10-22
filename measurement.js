"use strict";
// Uses an existing, consent-enabled GA4 installation. Does not load analytics,
// set cookies, or transmit data until that installation is configured.
document.addEventListener("click", (event) => {
  const link = event.target.closest("a[href]");
  if (!link || typeof window.gtag !== "function") return;
  const href = link.getAttribute("href");
  let channel;
  if (href.startsWith("mailto:")) channel = "email";
  else if (/^https:\/\/wa\.me\//.test(href)) channel = "whatsapp";
  else if (/^https:\/\/(www\.)?linkedin\.com\//.test(href)) channel = "linkedin";
  else if (/shahriar-rezvani-profile\.pdf$/.test(href)) channel = "profile";
  if (!channel) return;
  window.gtag("event", channel === "profile" ? "profile_download" : "contact_click", {
    contact_channel: channel,
    page_path: window.location.pathname,
    transport_type: "beacon"
  });
});
