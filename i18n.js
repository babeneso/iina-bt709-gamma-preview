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
    "playbackPrefix": "BT.709 appearance: ",
    "iccAlert": "BT.709 Gamma Preview\n\nEnable “Load ICC profile” in Settings… → Video → Color and HDR to display the video correctly.\n\nThis is only a reminder; your settings have not been changed.",
    "preferencesTitle": "Preferences — BT.709 Gamma Preview",
    "helpTitle": "Help — BT.709 Gamma Preview",
    "sidebarTitle": "BT.709 Gamma Preview",
    "defaultLegend": "Default playback gamma for BT.709 video",
    "defaultNote": "Applies to new playback windows. Existing windows retain their selection, including when a new video is loaded in the same window.",
    "iccNote": "Enable <strong>Load ICC profile</strong> in <strong>Settings… → Video → Color and HDR</strong> to display the video correctly.",
    "playbackLegend": "Choose playback gamma for this video:",
    "sidebarDefault": "To change the default for this option, go to <strong>Settings… → Plugins → BT.709 Gamma Preview → ⓘ button</strong>.",
    "helpIntro": "Watch BT.709 SDR video with various gamma modes and switch between them during playback to preview how contrast looks in different viewing environments.",
    "helpPlaybackHeading": "Using the plugin",
    "helpPlayback": "Choose a playback gamma in <strong>Menu Bar → Plugins → BT.709 Gamma Preview</strong>. Choose <strong>Show Details in Plugins Panel</strong> to open the sidebar and access the plugin’s controls.",
    "helpShortcutsHeading": "Keyboard shortcuts",
    "shortcutHeading": "Shortcut",
    "actionHeading": "Action",
    "helpDefaultsHeading": "Default gamma and playback windows",
    "helpDefaults": "Change the default playback gamma in <strong>Settings… → Plugins → BT.709 Gamma Preview → ⓘ button</strong>. The initial default is <strong>BT.1886 (mpv default)</strong>.",
    "helpICCHeading": "Required setting",
    "helpICC": "When playing supported video (BT.709) with <strong>Load ICC profile</strong> disabled, the plugin displays a reminder dialog. It does not change your settings.",
    "helpSupportHeading": "Supported video and preview limits",
    "helpSupport": "When IINA identifies a video as BT.709 (for example, a video with NCLC tags <code>1-1-1</code>), you can use this plugin to set its playback gamma. Some Log-encoded videos or videos without NCLC tags may also be identified as BT.709.",
    "helpUnsupported": "For unsupported video (such as HDR), the plugin applies no settings that change the video’s appearance and displays <strong>Not applicable to this video</strong>.",
    "helpLimits": "<strong>QuickTime-like</strong> is an approximate gamma preview, not an exact reproduction of QuickTime or ColorSync. Results depend on your display and playback configuration; this plugin does not calibrate your display.",
    "helpPermissionsHeading": "Required permissions",
    "helpPermissions": "IINA requires <strong>Access the file system</strong> permission to adjust the video’s appearance through its API. However, this plugin <strong>does not</strong> read or write your files, execute external programs, or access the network.",
    "helpVersion": "Version <code>0.2.0</code> · Requires IINA <code>1.5.0</code> or later.",
    "noVideo": "No Video Playing",
    "helpWindows": "New playback windows use the default from the plugin’s settings. Each window has its own gamma selection and retains it when a new video is loaded in the same window."
  },
  "zh-Hant": {
    "appName": "BT.709 Gamma 預覽",
    "mode.mpv": "BT.1886（mpv 預設）",
    "mode.qt": "Gamma ≈1.961（近似 QuickTime）",
    "mode.gamma22": "Gamma 2.2",
    "mode.gamma24": "Gamma 2.4",
    "notApplicable": "此影片不適用",
    "showSidebar": "於外掛面板顯示詳細資訊",
    "playbackPrefix": "BT.709 外觀：",
    "iccAlert": "BT.709 Gamma 預覽外掛\n\n請於「設定⋯ → 視訊 → 色彩和 HDR」啟用「載入 ICC 色彩描述檔」選項，以正確呈現影片外觀。\n\n此通知僅作提醒，並未更改你的設定。",
    "preferencesTitle": "偏好設定 — BT.709 Gamma 預覽",
    "helpTitle": "使用說明 — BT.709 Gamma 預覽",
    "sidebarTitle": "BT.709 Gamma 預覽",
    "defaultLegend": "BT.709 影片的預設播放 gamma",
    "defaultNote": "此處的預設值將套用於新開啟的播放視窗。現有視窗（以及在該視窗內載入的新影片）會保留其設定。",
    "iccNote": "請於「<strong>設定⋯ → 視訊 → 色彩和 HDR</strong>」啟用「<strong>載入 ICC 色彩描述檔</strong>」選項，以正確呈現影片外觀。",
    "playbackLegend": "選擇這部影片的播放 gamma：",
    "sidebarDefault": "若要更改此選項的預設值，請前往「<strong>設定⋯ → 外掛程式 → BT.709 Gamma 預覽 → ⓘ 按鈕</strong>」。",
    "helpIntro": "以各種 gamma 模式觀看 BT.709 SDR 影片，支援實時切換，方便預覽影片在不同環境下播放時的對比度外觀。",
    "helpPlaybackHeading": "使用外掛",
    "helpPlayback": "在「<strong>選單列 → 外掛程式 → BT.709 Gamma 預覽</strong>」選擇播放 gamma。點選「<strong>於外掛面板顯示詳細資訊</strong>」將開啟側邊欄，並顯示外掛面板，提供更便捷的操作。",
    "helpShortcutsHeading": "鍵盤快速鍵",
    "shortcutHeading": "快速鍵",
    "actionHeading": "動作",
    "helpDefaultsHeading": "預設 gamma 與播放視窗",
    "helpDefaults": "你可以在「<strong>設定⋯ → 外掛程式 → BT.709 Gamma 預覽 → ⓘ 按鈕</strong>」更改預設的播放 gamma。初始預設為「<strong>BT.1886（mpv 預設）</strong>」。",
    "helpICCHeading": "必需設定",
    "helpICC": "播放支援的影片（即 BT.709）時，若未啟用「<strong>載入 ICC 色彩描述檔</strong>」選項，外掛將顯示對話框，但僅作為提醒，不會更改你的設定。",
    "helpSupportHeading": "支援的影片與預覽限制",
    "helpSupport": "當 IINA 判定影片為 BT.709 時（例如 NCLC 標記為 <code>1-1-1</code> 的影片），你可以使用此外掛來設定播放 gamma。部分 Log 編碼、或 NCLC 未標記的影片可能也會被判定為 BT.709。",
    "helpUnsupported": "播放不支援的影片時（例如 HDR），外掛不會套用任何改變影片外觀的設定，並將提示<strong>此影片不適用</strong>。",
    "helpLimits": "<strong>近似 QuickTime</strong> 只提供近似的 gamma 預覽，並非完整重現 QuickTime 或 ColorSync。結果取決於螢幕與播放設定；此外掛不會校正螢幕。",
    "helpPermissionsHeading": "權限需求",
    "helpPermissions": "IINA 要求<strong>存取檔案系統</strong>權限，才能透過其 API 調整影片外觀；但此外掛<strong>不會</strong>讀寫你的檔案、執行外部程式或存取網路。",
    "helpVersion": "版本 <code>0.2.0</code> · 需要 IINA <code>1.5.0</code> 或更新版本。",
    "noVideo": "未播放影片",
    "helpWindows": "新開啟的播放視窗將使用外掛設定內的預設值。每個播放視窗的 gamma 設定都是獨立的，同視窗載入新影片時也會保留選擇。"
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
