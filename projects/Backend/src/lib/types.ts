export type InternalKeys = "createdAt" | "updatedAt" | "deletedAt";
export type InternalKeysWithId = InternalKeys | "id";

export interface IUploadStorage {
  id: number;
  ownerId: number;  // Foreign key to Account.id

  //          |---------- Up to backend logic ---------||- 1 -||--- 2 ---||3|
  // example) https://cdn.myboothmanager.example/uploads/booth/banner-1_2.png
  // (1) savePath: directory path from upload folder to folder containing the file, null means it's saved in root of upload folder (equivalent to '/')
  // (2) fileName
  // (3) extensions: file extensions, in order of preference
  savePath?: string;
  fileName: string;
  extensions?: Array<string>;
  imageThumbnailBase64?: string;
}

export abstract class CacheMap<K, V> {
  protected cache: Map<K, V> = new Map<K, V>();

  abstract fetch(key: K): Promise<V>;

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
}
