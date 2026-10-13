/* Make IINA's language available to Preferences/Help, even without a player.
 * This private cache is refreshed at launch; it is not a user preference.
 * Never access the player or menu from this entry. */
const localization = require("./i18n.js");
iina.preferences.set("_uiLocale", localization.preferred(iina));
iina.preferences.sync();
