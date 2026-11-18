(function () {
  let connected = false;
  let initialized = false;
  let attempts = 0;
  function connect() {
    if (initialized) return;
    if (!window.iina || typeof window.iina.onMessage !== "function") {
      if (++attempts < 40) setTimeout(connect, 100);
      return;
    }
    initialized = true;
    const inputs = Array.from(document.querySelectorAll('input[name="playbackGamma"]'));
    window.iina.onMessage("playback-state", function (state) {
      if (!state || typeof state.available !== "boolean") return;
      connected = true;
      const locale = state.locale || "en";
      const status = document.querySelector('[data-playback-status]');
      const key = state.unavailableKey === "noVideo" ? "noVideo" : "notApplicable";
      status.dataset.i18n = key;
      window.GammaUI.apply(locale);
      // Availability can change without a locale change; apply() caches locale.
      status.textContent = window.GammaI18n.text(locale, key);
      inputs.forEach(function (input) {
        input.parentElement.hidden = input.value === "na" ? state.available : !state.available;
        input.disabled = input.value === "na" || !state.available;
        input.checked = input.value === (state.available ? state.selected : "na");
      });
    });
    inputs.forEach(function (input) {
      input.addEventListener("change", function () {
        if (input.checked && !input.disabled) window.iina.postMessage("choose-mode", input.value);
      });
    });
    let requests = 0;
    function requestState() {
      // IINA's native bridge expects a JSON-serializable second argument.
      window.iina.postMessage("get-playback-state", {});
      if (!connected && ++requests < 10) setTimeout(requestState, 200);
    }
    requestState();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", connect);
  else connect();
}());
