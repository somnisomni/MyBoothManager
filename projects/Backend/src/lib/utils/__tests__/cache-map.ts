import { CacheMap } from "@/lib/utils/cache-map";

class TestCacheMap extends CacheMap<string, string> {
  protected override async fetch(key: string): Promise<string> {
    return `${key}_fetched`;
  }
}

describe("CacheMap", () => {
  const initializedMap = new TestCacheMap();
  initializedMap.get("get");
  initializedMap.get("this map is already initialized");
  initializedMap.get("값 가져오기");

  it("should be defined", () => {
    const map = new TestCacheMap();

    expect(map).toBeDefined();
    expect(map).toBeInstanceOf(TestCacheMap);
    expect(map).toBeInstanceOf(CacheMap);
  });

  it("should not have any value initially", () => {
    const map = new TestCacheMap();

    expect(map.has("test")).toBe(false);
    expect(map.has("アンドロイド")).toBe(false);
    expect(map.has("🤖")).toBe(false);
  });

  it("should be able to fetch automatically when value is not in cache using `get` function", async () => {
    const map = new TestCacheMap();

    expect(await map.get("test")).toBe("test_fetched");
    expect(await map.get("アンドロイド")).toBe("アンドロイド_fetched");
    expect(await map.get("🤖")).toBe("🤖_fetched");
  });

  it("should have values in test initialized map (`initializedMap`)", async () => {
    expect(initializedMap.count()).toBe(3);

    expect(initializedMap.has("get")).toBe(true);
    expect(initializedMap.has("this map is already initialized")).toBe(true);
    expect(initializedMap.has("값 가져오기")).toBe(true);

    expect(await initializedMap.get("get")).toBe("get_fetched");
    expect(await initializedMap.get("this map is already initialized")).toBe("this map is already initialized_fetched");
    expect(await initializedMap.get("값 가져오기")).toBe("값 가져오기_fetched");
  });

  it("should be able to test value of cached value", async () => {
    const map = new TestCacheMap();

    expect(await map.get("test")).toBe("test_fetched");
    expect(map.has("test")).toBe(true);
    expect(await map.testValue("test", "test_fetched")).toBe(true);
    expect(await map.testValue("test", "test_INVALIDVALUE")).toBe(false);
  });

  it("should be able to test value even if it is not in cache yet", async () => {
    const map = new TestCacheMap();

    expect(map.has("test")).toBe(false);
    expect(await map.testValue("test", "test_fetched")).toBe(true);
    expect(await map.testValue("test", "test_INVALIDVALUE")).toBe(false);

    expect(map.has("invalid")).toBe(false);
    expect(await map.testValue("invalid", "INVALID_VALUE")).toBe(false);
  });

  it("should be able to invalidate cache", async () => {
    const map = new TestCacheMap();
    await map.get("test1");
    await map.get("test2");
    await map.get("test3");

    expect(map.has("test1")).toBe(true);
    expect(map.has("test2")).toBe(true);
    expect(map.has("test3")).toBe(true);
    expect(map.count()).toBe(3);

    map.invalidate("test1");

    expect(map.has("test1")).toBe(false);
    expect(map.has("test2")).toBe(true);
    expect(map.has("test3")).toBe(true);
    expect(map.count()).toBe(2);
  });
});
