import getSymbolFromCurrency from "currency-symbol-map";

/**
 * Interface for providing currency information.
 */
export interface ICurrencyInfo {
  /**
   * Localized currency name (e.g. "United States Dollar", "미국 달러" for US dollar)
   * Language code should be in ISO 639-1 format.
   */
  nameLocalized: { [iso639_1: string]: string };

  /**
   * ISO 4217 currency code (e.g. "USD" for US dollar)
   */
  code: string;

  /**
   * Unicode symbol (e.g. "$" for US dollar)
   */
  symbol: string;

  /**
   * Optimal, human-friendly step for the currency (e.g. 0.01 for US dollar, 1000 for Korean won)
   */
  step: number;

  /**
   * Whether the currency is a major target currency
   */
  isMajorTarget: boolean;
}

export type SupportedCurrencyCodes = "KRW" | "USD" | "JPY" | "CNY" | "EUR" | "GBP" | "AUD" | "CAD" | "HKD" | "NZD";

/**
 * Mapping from currency code to currency symbol.
 */
export const CURRENCY_CODE_TO_SYMBOL_MAP = Object.freeze<Record<SupportedCurrencyCodes, string>>({
  KRW: getSymbolFromCurrency("KRW")!,
  USD: getSymbolFromCurrency("USD")!,
  JPY: getSymbolFromCurrency("JPY")!,
  CNY: `CN${getSymbolFromCurrency("CNY")!}`,
  EUR: getSymbolFromCurrency("EUR")!,
  GBP: getSymbolFromCurrency("GBP")!,
  AUD: `AU${getSymbolFromCurrency("AUD")!}`,
  CAD: `CA${getSymbolFromCurrency("CAD")!}`,
  HKD: `HK${getSymbolFromCurrency("HKD")!}`,
  NZD: `NZ${getSymbolFromCurrency("NZD")!}`,
});

/**
 * Mapping from currency symbol to currency code.
 */
export const CURRENCY_SYMBOL_TO_CODE_MAP = Object.freeze<Record<string, SupportedCurrencyCodes>>({
  [CURRENCY_CODE_TO_SYMBOL_MAP["KRW"]]: "KRW",
  [CURRENCY_CODE_TO_SYMBOL_MAP["USD"]]: "USD",
  [CURRENCY_CODE_TO_SYMBOL_MAP["JPY"]]: "JPY",
  [CURRENCY_CODE_TO_SYMBOL_MAP["CNY"]]: "CNY",
  [CURRENCY_CODE_TO_SYMBOL_MAP["EUR"]]: "EUR",
  [CURRENCY_CODE_TO_SYMBOL_MAP["GBP"]]: "GBP",
  [CURRENCY_CODE_TO_SYMBOL_MAP["AUD"]]: "AUD",
  [CURRENCY_CODE_TO_SYMBOL_MAP["CAD"]]: "CAD",
  [CURRENCY_CODE_TO_SYMBOL_MAP["HKD"]]: "HKD",
  [CURRENCY_CODE_TO_SYMBOL_MAP["NZD"]]: "NZD",
});

/**
 * Predefined currency information for major currencies.
 */
export const CURRENCY_INFO = Object.freeze<Record<SupportedCurrencyCodes, ICurrencyInfo>>({
  // Major target currencies //
  KRW: {
    nameLocalized: {
      ko: "대한민국 원",
      en: "Korean Won",
      ja: "韓国 ウォン",
    },
    code: "KRW",
    symbol: CURRENCY_CODE_TO_SYMBOL_MAP["KRW"],
    step: 1000,
    isMajorTarget: true,
  },
  USD: {
    nameLocalized: {
      ko: "미국 달러",
      en: "United States Dollar",
      ja: "アメリカ ドル",
    },
    code: "USD",
    symbol: CURRENCY_CODE_TO_SYMBOL_MAP["USD"],
    step: 1,
    isMajorTarget: true,
  },
  JPY: {
    nameLocalized: {
      ko: "일본 엔",
      en: "Japanese Yen",
      ja: "日本 円",
    },
    code: "JPY",
    symbol: CURRENCY_CODE_TO_SYMBOL_MAP["JPY"],
    step: 100,
    isMajorTarget: true,
  },

  // Other currencies //
  CNY: {
    nameLocalized: {
      ko: "중국 위안",
      en: "Chinese Yuan",
      ja: "中国 人民元",
    },
    code: "CNY",
    symbol: CURRENCY_CODE_TO_SYMBOL_MAP["CNY"],
    step: 10,
    isMajorTarget: false,
  },
  EUR: {
    nameLocalized: {
      ko: "유로",
      en: "Euro",
      ja: "ユーロ",
    },
    code: "EUR",
    symbol: CURRENCY_CODE_TO_SYMBOL_MAP["EUR"],
    step: 1,
    isMajorTarget: false,
  },
  GBP: {
    nameLocalized: {
      ko: "영국 파운드",
      en: "British Pound",
      ja: "イギリス ポンド",
    },
    code: "GBP",
    symbol: CURRENCY_CODE_TO_SYMBOL_MAP["GBP"],
    step: 1,
    isMajorTarget: false,
  },
  AUD: {
    nameLocalized: {
      ko: "호주 달러",
      en: "Australian Dollar",
      ja: "オーストラリア ドル",
    },
    code: "AUD",
    symbol: CURRENCY_CODE_TO_SYMBOL_MAP["AUD"],
    step: 1,
    isMajorTarget: false,
  },
  CAD: {
    nameLocalized: {
      ko: "캐나다 달러",
      en: "Canadian Dollar",
      ja: "カナダ ドル",
    },
    code: "CAD",
    symbol: CURRENCY_CODE_TO_SYMBOL_MAP["CAD"],
    step: 1,
    isMajorTarget: false,
  },
  HKD: {
    nameLocalized: {
      ko: "홍콩 달러",
      en: "Hong Kong Dollar",
      ja: "香港 ドル",
    },
    code: "HKD",
    symbol: CURRENCY_CODE_TO_SYMBOL_MAP["HKD"],
    step: 10,
    isMajorTarget: false,
  },
  NZD: {
    nameLocalized: {
      ko: "뉴질랜드 달러",
      en: "New Zealand Dollar",
      ja: "ニュージーランド ドル",
    },
    code: "NZD",
    symbol: CURRENCY_CODE_TO_SYMBOL_MAP["NZD"],
    step: 1,
    isMajorTarget: false,
  },
} as const);
