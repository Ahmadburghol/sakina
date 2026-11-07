/*
 * سكينة | Sakina — language toggle (Arabic default / English).
 * - Loaded in <head> so the inactive language is hidden before first paint.
 * - Without JS both languages remain visible, stacked.
 * - Priority: ?lang=ar|en in the URL > saved choice (localStorage) > Arabic.
 * - No cookies, no network requests.
 */
(function () {
  "use strict";

  var KEY = "sakina.lang";
  var SITE = "https://sakina.ahmadburghol.com/";
  var root = document.documentElement;
  var storageOk = true;

  function readSaved() {
    try {
      return window.localStorage.getItem(KEY);
    } catch (e) {
      storageOk = false;
      return null;
    }
  }

  function save(lang) {
    try {
      window.localStorage.setItem(KEY, lang);
      storageOk = true;
    } catch (e) {
      storageOk = false;
    }
  }

  function fromUrl() {
    try {
      var m = /[?&]lang=(ar|en)(?:&|$)/.exec(window.location.search);
      return m ? m[1] : null;
    } catch (e) {
      return null;
    }
  }

  function valid(l) {
    return l === "ar" || l === "en";
  }

  var urlLang = fromUrl();
  var current = urlLang || readSaved();
  if (!valid(current)) current = "ar";
  if (urlLang) save(urlLang);

  function applyRoot(lang) {
    root.classList.add("js");
    root.classList.remove("show-ar", "show-en");
    root.classList.add("show-" + lang);
    root.setAttribute("lang", lang);
    root.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
    var t = root.getAttribute("data-title-" + lang);
    if (t) document.title = t;
  }

  // Run immediately (before <body> is parsed) to avoid a flash of both languages.
  applyRoot(current);

  function updateUrl(lang) {
    try {
      if (!window.history || !window.history.replaceState) return;
      var u = new URL(window.location.href);
      if (lang === "ar") u.searchParams.delete("lang");
      else u.searchParams.set("lang", lang);
      window.history.replaceState(null, "", u.toString());
    } catch (e) { /* ignore */ }
  }

  // If storage is unavailable, carry the choice across pages through the URL.
  function decorateLinks(lang) {
    if (storageOk) return;
    var links = document.querySelectorAll('a[href^="' + SITE + '"]');
    for (var i = 0; i < links.length; i++) {
      try {
        var u = new URL(links[i].getAttribute("href"));
        if (lang === "en") u.searchParams.set("lang", "en");
        else u.searchParams.delete("lang");
        links[i].setAttribute("href", u.toString());
      } catch (e) { /* ignore */ }
    }
  }

  function updateAria(lang) {
    var els = document.querySelectorAll("[data-aria-" + lang + "]");
    for (var i = 0; i < els.length; i++) {
      els[i].setAttribute("aria-label", els[i].getAttribute("data-aria-" + lang));
    }
  }

  function updateToggles(lang) {
    var other = lang === "ar" ? "en" : "ar";
    var buttons = document.querySelectorAll("[data-lang-toggle]");
    for (var i = 0; i < buttons.length; i++) {
      var b = buttons[i];
      var label = b.querySelector("[data-lang-label]") || b;
      label.textContent = other === "en" ? "English" : "العربية";
      label.setAttribute("lang", other);
      b.setAttribute("aria-label", other === "en" ? "Switch to English" : "التبديل إلى العربية");
      b.hidden = false;
    }
  }

  function apply(lang) {
    current = lang;
    applyRoot(lang);
    updateToggles(lang);
    updateAria(lang);
    decorateLinks(lang);
  }

  function init() {
    apply(current);
    var buttons = document.querySelectorAll("[data-lang-toggle]");
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener("click", function () {
        var next = current === "ar" ? "en" : "ar";
        save(next);
        apply(next);
        updateUrl(next);
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
