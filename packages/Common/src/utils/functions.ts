export function emptyObject(target: Record<string, unknown>): void {
  Object.keys(target).forEach((key) => delete target[key]);
}

export function emptyNumberKeyObject(target: Record<number, unknown>): void {
  Object.keys(target).forEach((key) => delete target[parseInt(key)]);
}

export function toDateRangeString(dates: Array<Date | string>): string  {
  if(dates.length === 1) return new Date(dates[0]).toLocaleDateString();

  const min = dates.reduce((prev, curr) => new Date(prev) < new Date(curr) ? prev : curr);
  const max = dates.reduce((prev, curr) => new Date(prev) > new Date(curr) ? prev : curr);

  return `${new Date(min).toLocaleDateString()} ~ ${new Date(max).toLocaleDateString()}`;
}
