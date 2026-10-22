"use strict";
(() => {
  const id = "G-11LZQDZ9E9";
  const key = "shahriar-analytics-consent-v1";
  let consent = null;
  try { consent = localStorage.getItem(key); } catch (_) {}
  let started = false;
  const start = () => {
    if (started || consent !== "accepted") return;
    started = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("consent", "default", {
      analytics_storage: "granted", ad_storage: "denied",
      ad_user_data: "denied", ad_personalization: "denied"
    });
    window.gtag("js", new Date());
    window.gtag("config", id, {
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      page_location: location.origin + location.pathname,
      page_referrer: document.referrer ? new URL(document.referrer).origin : ""
    });
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtag/js?id=" + id;
    document.head.appendChild(script);
  };
  const save = value => {
    consent = value;
    try { localStorage.setItem(key, value); } catch (_) {}
  };
  const init = () => {
    const panel = document.createElement("section");
    panel.setAttribute("aria-label", "Analytics preferences");
    panel.style.cssText = "position:fixed;bottom:16px;left:16px;right:16px;max-width:560px;z-index:1000;background:#fff;color:#201e1d;border:2px solid #201e1d;padding:20px;box-shadow:0 4px 20px #0003;font:15px/1.5 system-ui";
    const text = document.createElement("p");
    text.style.margin = "0 0 12px";
    text.textContent = "Optional analytics: With your permission, this site uses Google Analytics cookies to measure visits, reading activity, contact-link clicks and profile downloads. Google processes this usage data. Declining keeps analytics off. Change your choice anytime using Analytics preferences.";
    panel.appendChild(text);
    const choose = (label, value) => {
      const button = document.createElement("button");
      button.type = "button"; button.textContent = label;
      button.style.cssText = "padding:10px 16px;margin:4px 8px 4px 0;background:#fff;color:#201e1d;border:2px solid #201e1d;cursor:pointer;font:inherit";
      button.addEventListener("click", () => {
        save(value); panel.hidden = true;
        if (value === "accepted") start();
        else if (started) {
          window["ga-disable-" + id] = true;
          // Remove this property's first-party cookies when consent is withdrawn.
          const names = document.cookie.split(";").map(c => c.trim().split("=")[0]).filter(n => n === "_ga" || n === "_ga_" + id.slice(2).replace(/-/g, "_"));
          names.forEach(name => {
            ["", ";domain=" + location.hostname, ";domain=.shahriar.me"].forEach(domain => {
              document.cookie = name + "=;Max-Age=0;path=/" + domain;
            });
          });
          location.reload();
        }
      });
      panel.appendChild(button);
    };
    choose("Accept analytics", "accepted");
    choose("Decline", "declined");
    panel.hidden = consent === "accepted" || consent === "declined";
    document.body.appendChild(panel);
    const preferences = document.createElement("button");
    preferences.type = "button"; preferences.textContent = "Analytics preferences";
    preferences.style.cssText = "position:static;display:inline-block;margin:0;padding:0;background:transparent;color:inherit;border:0;border-bottom:1px solid currentColor;cursor:pointer;font:inherit;letter-spacing:inherit;text-transform:inherit";
    preferences.addEventListener("click", () => {
      panel.hidden = false; panel.querySelector("button").focus();
    });
    // Keep the control in the footer, including after the homepage component renders.
    const mountPreferences = () => {
      const footer = document.querySelector("footer");
      const host = footer && (footer.querySelector("div") || footer);
      if (host && preferences.parentNode !== host) host.appendChild(preferences);
    };
    mountPreferences();
    new MutationObserver(mountPreferences).observe(document.body, { childList: true, subtree: true });
    start();
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
  document.addEventListener("click", event => {
    if (consent !== "accepted" || !started) return;
    const link = event.target.closest("a[href]");
    if (!link) return;
    const href = link.getAttribute("href");
    let channel;
    if (href.startsWith("mailto:")) channel = "email";
    else if (/^https:\/\/wa\.me\//.test(href)) channel = "whatsapp";
    else if (/^https:\/\/(www\.)?linkedin\.com\//.test(href)) channel = "linkedin";
    else if (/shahriar-rezvani-profile\.pdf$/.test(href)) channel = "profile";
    if (channel) window.gtag("event", channel === "profile" ? "profile_download" : "contact_click", {
      contact_channel: channel, page_path: location.pathname, transport_type: "beacon"
    });
  });
})();
