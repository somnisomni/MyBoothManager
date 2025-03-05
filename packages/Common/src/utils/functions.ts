/**
 * Delete keyed members from an object in-place
 * @param obj Target object
 * @param keys Keys to delete
 */
export function deleteKeys<T>(obj: T, keys: ReadonlyArray<keyof T>): void {
  for(const key of keys) {
    delete obj[key];
  }
}

/**
 * Delete all members from an object in-place, make the object empty
 * @param obj Target object
 */
export function emptyObject<TKey extends string | number>(obj: Record<TKey, unknown>): void {
  Object.keys(obj).forEach(key => delete obj[key as TKey]);
}

/**
 * Convert array of dates to date range string
 * @param dates Array of `Date` instances or date strings can be parsed by `new Date()` constructor
 * @returns Date range string with this format: `[minDateLocaleString] ~ [maxDateLocaleString]`. If the array has only one date, return the date's locale string
 * @throws {TypeError} If some of elements in the array is not a valid date
 */
export function toDateRangeString(dates: Array<Date | string>): string {
  if(dates.some(date => isNaN(new Date(date).getTime()))) {
    throw new TypeError("Some of elements in the array is not a valid date");
  }

  if(dates.length === 1) {
    return new Date(dates[0]).toLocaleDateString();
  }

  const dateTimes = dates.map(date => new Date(date).getTime());

  const minTime = Math.min(...dateTimes);
  const maxTime = Math.max(...dateTimes);

  return `${new Date(minTime).toLocaleDateString()} ~ ${new Date(maxTime).toLocaleDateString()}`;
}
