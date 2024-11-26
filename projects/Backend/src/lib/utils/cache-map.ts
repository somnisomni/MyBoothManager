/**
 * Works like a Map, but if a key is not found, it will fetch the value from the fetch method.
 *
 * This is an abstract class that should be extended to implement the fetch method and use.
 *
 * @template K - Key type
 * @template V - Value type
 */
export abstract class CacheMap<K, V> {
  protected cache: Map<K, V> = new Map<K, V>();

  protected abstract fetch(key: K): Promise<V>;

  async get(key: K): Promise<V> {
    if(!this.has(key)) {
      this.cache.set(key, await this.fetch(key));
    }

    return this.cache.get(key) as V;
  }

  has(key: K): boolean {
    return this.cache.has(key);
  }

  async testValue(key: K, valueToTest: V): Promise<boolean> {
    return await this.get(key) === valueToTest;
  }

  invalidate(key: K): boolean {
    return this.cache.delete(key);
  }

  count(): number {
    return this.cache.size;
  }
}
