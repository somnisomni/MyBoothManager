/**
 * Delete keys from object in-place
 * @param obj Target object
 * @param keys Keys to delete
 */
export function deleteKeys<T>(obj: T, keys: readonly (keyof T)[]): void {
  for(const key of keys) {
    delete obj[key];
  }
}
