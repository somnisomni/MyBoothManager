/**
 * @param {string} locale
 * @returns {Record<string, any> | null}
 */
function getStringsByLocale(locale) {
  try {
    return require(`./${locale}.json`);
  } catch {
    return null;
  }
}

module.exports = {
  getStringsByLocale,

  ko: getStringsByLocale("ko"),
  en: getStringsByLocale("en"),
  ja: getStringsByLocale("ja"),
}
