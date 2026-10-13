/* One instance per IINA player. No global playback state. */
const { mpv, menu, core, event, preferences, sidebar } = iina;
const localization = require("./i18n.js");
const locale = localization.preferred(iina);
const t = key => localization.text(locale, key);
const FILTER = "bt709-gamma-plugin";
// Approximate gamma 1.961 using a 2.4 source curve and an extra gamma factor.
// Under the color-managed playback path: base / factor = target.
const QT_BASE_GAMMA = 2.4;
const QT_TARGET_GAMMA = 1.961;
const QT_GAMMA_FACTOR = QT_BASE_GAMMA / QT_TARGET_GAMMA;
const modes = [
  { id: "mpv", keyBinding: "Ctrl+Alt+0", title: t("mode.mpv"), gamma: null, factor: 1 },
  { id: "qt", keyBinding: "Ctrl+Alt+1", title: t("mode.qt"), gamma: "gamma2.4", factor: QT_GAMMA_FACTOR },
  { id: "gamma22", keyBinding: "Ctrl+Alt+2", title: t("mode.gamma22"), gamma: "gamma2.2", factor: 1 },
  { id: "gamma24", keyBinding: "Ctrl+Alt+3", title: t("mode.gamma24"), gamma: "gamma2.4", factor: 1 }
];
function defaultMode() {
  const value = preferences.get("defaultGamma");
  return modes.some(m => m.id === value) ? value : "mpv";
}
let selected = defaultMode();
let available = false;
let loading = false;
// Keep file presence separate from eligibility: audio-only files are unsupported,
// while startup/end-file may still expose stale video parameters.
let hasMedia = !!read("path") || !!read("video-params");
let closed = false;
let applied = null;
let savedFactor = null;
let warnedICC = false;
let warningTimer = null;
let menuState = "";
let initializing = true;
let modeTimer = null;
let pendingMode = null;

function read(name) {
  try { return mpv.getNative(name); } catch (_) { return null; }
}
function eligible() {
  if (loading || closed) return false;
  const p = read("video-params");
  return !!p && p.primaries === "bt.709" && p.gamma === "bt.1886";
}
function unavailableMessage() {
  return closed || loading || !hasMedia ? "noVideo" : "notApplicable";
}
function removeFilter() {
  const filters = read("vf");
  if (Array.isArray(filters) && filters.some(f => f.label === FILTER)) {
    mpv.command("vf", ["remove", "@" + FILTER]);
  }
}
function restore() {
  if (applied === null) return;
  removeFilter();
  if (savedFactor !== null) mpv.set("gamma-factor", savedFactor);
  applied = null;
  savedFactor = null;
}
let sidebarLoaded = false;
let sidebarReady = false;
function loadSidebar() {
  if (!sidebarLoaded) {
    sidebar.loadFile("sidebar.html");
    sidebarLoaded = true;
  }
  // Register from the window/file lifecycle, when the sidebar exists.
  // Keep the callbacks referenced by this live event handler as well.
  sidebar.onMessage("get-playback-state", receiveSidebarRequest);
  sidebar.onMessage("choose-mode", receiveSidebarChoice);
}
function sendSidebarState() {
  if (sidebarReady) sidebar.postMessage("playback-state", { available, selected, locale, unavailableKey: unavailableMessage() });
}
function receiveSidebarRequest() {
  sidebarReady = true;
  sendSidebarState();
}
function receiveSidebarChoice(value) {
  sidebarReady = true;
  if (!modes.some(mode => mode.id === value)) return;
  choose(value);
  sendSidebarState();
}
event.on("iina.window-loaded", loadSidebar);
function refreshMenu() {
  const state = available + ":" + selected + ":" + unavailableMessage();
  if (state === menuState) return;
  menu.removeAllItems();
  if (available) {
    modes.forEach(mode => menu.addItem(menu.item(mode.title, () => choose(mode.id),
      { enabled: true, selected: selected === mode.id, keyBinding: mode.keyBinding })));
  } else {
    menu.addItem(menu.item(t(unavailableMessage()), null,
      { enabled: false, selected: true }));
  }
  menu.addItem(menu.item(t("showSidebar"), () => { sidebar.show(); loadSidebar(); sendSidebarState(); },
    { keyBinding: "Ctrl+Alt+g" }));
  // During first-player construction, forceUpdate re-enters PlayerCore.first.
  // IINA builds its startup menu itself; only refresh after initialization.
  if (!initializing) menu.forceUpdate();
  menuState = state;
  sendSidebarState();
}
function warnICC() {
  if (warnedICC || !eligible()) return;
  // An explicitly supplied profile also enables ICC processing.
  const profile = read("icc-profile");
  if (typeof profile === "string" && profile.length > 0) return;
  const automatic = read("icc-profile-auto");
  if (automatic !== false && automatic !== "no") return;
  warnedICC = true;
  iina.utils.ask(t("iccAlert"));
}
function scheduleWarning(delay) {
  if (warningTimer !== null) clearTimeout(warningTimer);
  warningTimer = setTimeout(() => { warningTimer = null; warnICC(); }, delay);
}
function reconcile() {
  available = eligible();
  try {
    if (!available) {
      restore();
    } else if (applied !== selected) {
      const mode = modes.find(m => m.id === selected);
      if (savedFactor === null) {
        const original = read("gamma-factor");
        savedFactor = typeof original === "number" ? original : 1;
      }
      // Mark ownership before commands so a partial failure can be cleaned up.
      applied = selected;
      removeFilter();
      if (mode.gamma) mpv.command("vf", ["add", "@" + FILTER + ":format=gamma=" + mode.gamma]);
      mpv.set("gamma-factor", mode.factor);
    }
  } catch (error) {
    iina.console.error(t("appName") + ": " + String(error));
    try { restore(); } catch (_) { /* Player may already be shutting down. */ }
    available = false;
    core.osd(t("appName") + ": " + String(error));
  }
  refreshMenu();
}
function cancelModeMessage() {
  if (modeTimer !== null) clearTimeout(modeTimer);
  modeTimer = null;
  pendingMode = null;
}
function scheduleModeMessage() {
  if (pendingMode === null) return;
  if (modeTimer !== null) clearTimeout(modeTimer);
  // Filter replacement can cause a seek and playback restart. Wait for a
  // quiet interval so IINA's resulting seek OSD precedes the mode message.
  modeTimer = setTimeout(() => {
    modeTimer = null;
    const mode = pendingMode;
    pendingMode = null;
    if (eligible() && available && selected === mode && applied === mode) {
      core.osd(t("playbackPrefix") + modes.find(m => m.id === mode).title);
      scheduleWarning(3500);
    }
  }, 500);
}
function choose(id) {
  if (!eligible()) { reconcile(); return; }
  cancelModeMessage();
  selected = id;
  reconcile();
  if (available) { pendingMode = id; scheduleModeMessage(); }
}
event.on("mpv.seek", scheduleModeMessage);
event.on("mpv.playback-restart", scheduleModeMessage);
event.on("mpv.start-file", () => {
  cancelModeMessage();
  if (closed) { selected = defaultMode(); warnedICC = false; closed = false; }
  loading = true;
  reconcile();
});
event.on("mpv.file-loaded", () => {
  loadSidebar();
  loading = false;
  hasMedia = true;
  reconcile();
  scheduleWarning(1500);
});
event.on("mpv.video-reconfig", () => { reconcile(); scheduleModeMessage(); scheduleWarning(1500); });
event.on("mpv.end-file", () => { cancelModeMessage(); hasMedia = false; loading = true; reconcile(); });
event.on("iina.window-will-close", () => {
  closed = true;
  cancelModeMessage();
  if (warningTimer !== null) clearTimeout(warningTimer);
  warningTimer = null;
  reconcile();
});
// Also catches ICC being turned off while playback is paused.
setInterval(() => { if (!closed && available && warningTimer === null) warnICC(); }, 2000);
reconcile();
initializing = false;
scheduleWarning(1500);
