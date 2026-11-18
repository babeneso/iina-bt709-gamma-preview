/* Shared WebView localization. Never replace input elements: IINA owns
 * preference bindings, and sidebar.js owns playback event listeners. */
(function () {
  "use strict";
  let locale;
  function apply(value) {
    const next = window.GammaI18n.resolve([value]);
    if (next === locale) return;
    locale = next;
    document.documentElement.lang = locale === "zh-Hant" ? "zh-Hant-TW" : "en";
    document.querySelectorAll("[data-i18n]").forEach(function (element) {
      element.textContent = window.GammaI18n.text(locale, element.dataset.i18n);
    });
    document.querySelectorAll("[data-i18n-html]").forEach(function (element) {
      element.innerHTML = window.GammaI18n.text(locale, element.dataset.i18nHtml);
    });
  }
  window.GammaUI = { apply };
  function initialize() {
    apply(window.GammaI18n.resolve(navigator.languages || [navigator.language]));
    if (document.body.dataset.page === "sidebar") return; // main.js sends IINA's locale with state.
    let attempts = 0;
    function readLocale() {
      if (!window.iina || !window.iina.preferences) {
        if (++attempts < 40) setTimeout(readLocale, 100);
        return;
      }
      window.iina.preferences.get("_uiLocale", function (value) {
        if (value === "en" || value === "zh-Hant") apply(value);
      });
    }
    readLocale();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initialize);
  else initialize();
}());
