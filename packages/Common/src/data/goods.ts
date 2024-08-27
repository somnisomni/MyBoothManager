export const goodsCsvHeader = [
  "name",
  "category_name",
  "description",
  "type",
  "price",
  "stock_initial",
] as const;

export const goodsCsvHeaderStringified = goodsCsvHeader.join(",");

export const goodsCsvHeaderMap = Object.freeze(Object.fromEntries(goodsCsvHeader.map((value) => [value, value])));
