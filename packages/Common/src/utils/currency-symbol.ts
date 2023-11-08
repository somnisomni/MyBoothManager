import getSymbolFromCurrency from "currency-symbol-map";

const currencySymbolInfo: Record<string, { name: string, symbol: string }> = {
  KRW: {
    name: "대한민국 원",
    symbol: getSymbolFromCurrency("KRW")!,
  },
  JPY: {
    name: "일본 엔",
    symbol: getSymbolFromCurrency("JPY")!,
  },
  USD: {
    name: "미국 달러",
    symbol: getSymbolFromCurrency("USD")!,
  },
  AUD: {
    name: "호주 달러",
    symbol: `AU${getSymbolFromCurrency("AUD")!}`,
  },
  EUR: {
    name: "유로",
    symbol: getSymbolFromCurrency("EUR")!,
  },
  CNY: {
    name: "중국 위안",
    symbol: `CN${getSymbolFromCurrency("CNY")!}`,
  },
};

export { currencySymbolInfo };
