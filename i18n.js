/* Shared translations. Values containing HTML are trusted, bundled UI copy only. */
(function (root) {
  "use strict";
  const messages = {
  "en": {
    "appName": "BT.709 Gamma Preview",
    "mode.mpv": "BT.1886 (mpv Default)",
    "mode.qt": "Gamma ≈1.961 (QuickTime-like)",
    "mode.gamma22": "Gamma 2.2",
    "mode.gamma24": "Gamma 2.4",
    "notApplicable": "Not Applicable to This Video",
    "showSidebar": "Show Details in Plugins Panel",
    "playbackPrefix": "BT.709 gamma: ",
    "iccAlert": "BT.709 Gamma Preview\n\nEnable “Load ICC profile” in Settings… → Video → Color and HDR to display the video correctly.\n\nThis is only a reminder; your settings have not been changed.",
    "preferencesTitle": "Preferences — BT.709 Gamma Preview",
    "helpTitle": "Help — BT.709 Gamma Preview",
    "sidebarTitle": "BT.709 Gamma Preview",
    "defaultLegend": "Default playback gamma for BT.709 video",
    "defaultNote": "Applies to new windows. Each open window keeps its own mode, even when you open another video in it.",
    "iccNote": "Enable <strong>Load ICC profile</strong> in <strong>Settings… → Video → Color and HDR</strong> to display the video correctly.",
    "playbackLegend": "Choose playback gamma for this video:",
    "sidebarDefault": "To change the default for this option, go to <strong>Settings… → Plugins → BT.709 Gamma Preview → ⓘ button</strong>.",
    "helpIntro": "Switch the playback gamma of BT.709 SDR video, so you can compare how the same video looks with different gammas without leaving the player.",
    "helpPlaybackHeading": "Using the plugin",
    "helpPlayback": "Choose a playback gamma from <strong>Plugin → BT.709 Gamma Preview</strong> in the menu bar. Choose <strong>Show Details in Plugins Panel</strong> to see the same choices in IINA’s sidebar.",
    "helpShortcutsHeading": "Keyboard shortcuts",
    "shortcutHeading": "Shortcut",
    "actionHeading": "Action",
    "helpDefaultsHeading": "Default gamma and playback windows",
    "helpDefaults": "Change the default playback gamma in <strong>Settings… → Plugins → BT.709 Gamma Preview → ⓘ button</strong>. The initial default is <strong>BT.1886 (mpv Default)</strong>.",
    "helpICCHeading": "Required setting",
    "helpICC": "When playing supported video (BT.709) with <strong>Load ICC profile</strong> disabled, the plugin displays a reminder dialog. It does not change your settings.",
    "helpSupportHeading": "Supported video and preview limits",
    "helpSupport": "The plugin works with video that IINA identifies as BT.709 SDR. Videos without color information, including some Log footage, may also be identified as BT.709.",
    "helpUnsupported": "For other video, such as HDR, the plugin changes nothing and shows <strong>Not Applicable to This Video</strong>.",
    "helpLimits": "<strong>QuickTime-like</strong> is an approximation, not an exact match of QuickTime. Results also depend on your display and playback settings, and the plugin does not calibrate your display.",
    "helpPermissionsHeading": "Required permissions",
    "helpPermissions": "IINA asks for <strong>Access the file system</strong> permission because the plugin needs it to adjust the gamma. The plugin doesn’t read or write your files, run other programs, or connect to the internet.",
    "helpVersion": "Version <code>1.0.0</code> · Requires IINA <code>1.5.0</code> or later.",
    "noVideo": "No Video Playing",
    "helpWindows": "New windows use this default. Each window keeps its own mode, even when you open another video in it."
  },
  "zh-Hant": {
    "appName": "BT.709 Gamma 預覽",
    "mode.mpv": "BT.1886（mpv 預設）",
    "mode.qt": "Gamma ≈1.961（近似 QuickTime）",
    "mode.gamma22": "Gamma 2.2",
    "mode.gamma24": "Gamma 2.4",
    "notApplicable": "此影片不適用",
    "showSidebar": "於外掛面板顯示詳細資訊",
    "playbackPrefix": "BT.709 gamma：",
    "iccAlert": "BT.709 Gamma 預覽外掛\n\n請於「設定⋯ → 視訊 → 色彩和 HDR」啟用「載入 ICC 色彩描述檔」選項，以正確呈現影片外觀。\n\n此通知僅作提醒，並未更改你的設定。",
    "preferencesTitle": "偏好設定 — BT.709 Gamma 預覽",
    "helpTitle": "使用說明 — BT.709 Gamma 預覽",
    "sidebarTitle": "BT.709 Gamma 預覽",
    "defaultLegend": "BT.709 影片的預設播放 gamma",
    "defaultNote": "只套用到新開的視窗。已經開著的視窗保留各自的模式，在同一個視窗開啟其他影片時也不會改變。",
    "iccNote": "請於「<strong>設定⋯ → 視訊 → 色彩和 HDR</strong>」啟用「<strong>載入 ICC 色彩描述檔</strong>」選項，以正確呈現影片外觀。",
    "playbackLegend": "選擇這部影片的播放 gamma：",
    "sidebarDefault": "若要更改此選項的預設值，請前往「<strong>設定⋯ → 外掛程式 → BT.709 Gamma 預覽 → ⓘ 按鈕</strong>」。",
    "helpIntro": "在 IINA 播放 BT.709 SDR 影片時切換播放 gamma。不必離開播放器，就能比較同一部影片在不同 gamma 下的樣子。",
    "helpPlaybackHeading": "使用外掛",
    "helpPlayback": "在選單列的「<strong>外掛程式 → BT.709 Gamma 預覽</strong>」選擇播放 gamma。點選「<strong>於外掛面板顯示詳細資訊</strong>」，可以在 IINA 的側邊欄看到同樣的選項。",
    "helpShortcutsHeading": "鍵盤快速鍵",
    "shortcutHeading": "快速鍵",
    "actionHeading": "動作",
    "helpDefaultsHeading": "預設 gamma 與播放視窗",
    "helpDefaults": "你可以在「<strong>設定⋯ → 外掛程式 → BT.709 Gamma 預覽 → ⓘ 按鈕</strong>」更改預設的播放 gamma。初始預設為「<strong>BT.1886（mpv 預設）</strong>」。",
    "helpICCHeading": "必要設定",
    "helpICC": "播放支援的影片（即 BT.709）時，若未啟用「<strong>載入 ICC 色彩描述檔</strong>」選項，外掛將顯示對話框，但僅作為提醒，不會更改你的設定。",
    "helpSupportHeading": "支援的影片與預覽限制",
    "helpSupport": "外掛適用於 IINA 判定為 BT.709 SDR 的影片。沒有色彩資訊的影片，包括部分 Log 素材，也可能被判定為 BT.709。",
    "helpUnsupported": "其他影片（例如 HDR）外掛不做任何調整，並顯示「<strong>此影片不適用</strong>」。",
    "helpLimits": "「<strong>近似 QuickTime</strong>」是近似的效果，並非完全重現 QuickTime。結果也取決於螢幕與播放設定；此外掛不會校正螢幕。",
    "helpPermissionsHeading": "權限需求",
    "helpPermissions": "IINA 會要求「<strong>存取檔案系統</strong>」權限，因為外掛調整 gamma 時需要它。外掛不會讀寫你的檔案、執行其他程式或連上網路。",
    "helpVersion": "版本 <code>1.0.0</code> · 需要 IINA <code>1.5.0</code> 或更新版本。",
    "noVideo": "未播放影片",
    "helpWindows": "新開的視窗使用這個預設值。每個視窗各自記住自己的模式，在同一個視窗開啟其他影片時也不會改變。"
  }
};
  function resolve(locales) {
    for (const value of Array.isArray(locales) ? locales : []) {
      const tag = String(value).replace(/_/g, "-").toLowerCase();
      if (tag === "en" || tag.startsWith("en-")) return "en";
      if (tag.startsWith("zh-hans")) continue;
      if (tag === "zh-hant" || tag.startsWith("zh-hant-") || /^zh-(tw|hk|mo)(-|$)/.test(tag)) return "zh-Hant";
    }
    return "en";
  }
  function text(locale, key) {
    return (messages[locale] || messages.en)[key] || messages.en[key] || key;
  }
  function preferred(api) {
    try { return resolve(api.utils.preferredLocalizations()); }
    catch (_) { return "en"; }
  }
  const api = { resolve, text, preferred };
  if (typeof module !== "undefined") module.exports = api;
  else root.GammaI18n = api;
}(typeof window !== "undefined" ? window : this));
