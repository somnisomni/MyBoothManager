export const goodsCsvHeader = [
  "name",
  "category_name",
  "description",
  "type",
  "price",
  "stock_initial",
];

export const goodsCsvHeaderStringified = goodsCsvHeader.join(",");

export const goodsCsvHeaderMap = Object.fromEntries(goodsCsvHeader.map((value) => [value, value]));
