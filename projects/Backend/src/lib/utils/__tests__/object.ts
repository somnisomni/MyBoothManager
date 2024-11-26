import { deleteKeys } from "@/lib/utils/object";

describe("Object Utilities", () => {
  describe("deleteKeys()", () => {
    it("should delete keys from object in-place", () => {
      const obj = { a: 1, b: 2, c: 3, d: 4 };
      const keys = ["a", "c"] as const;

      expect(obj).toBeInstanceOf(Object);
      expect(Object.keys(obj)).toHaveLength(4);
      expect(obj).toBeTruthy();
      expect(obj).toHaveProperty("a");
      expect(obj).toHaveProperty("b");

      expect(keys).toBeInstanceOf(Array);
      expect(keys).toHaveLength(2);
      expect(keys).toBeTruthy();

      deleteKeys(obj, keys);

      expect(obj).toBeTruthy();
      expect(Object.keys(obj)).toHaveLength(2);
      expect(obj).not.toHaveProperty("a");
      expect(obj).toHaveProperty("b");
      expect(obj).not.toHaveProperty("c");
      expect(obj).toHaveProperty("d");
    });
  });
});
