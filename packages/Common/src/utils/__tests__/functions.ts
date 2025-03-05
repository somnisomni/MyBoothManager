import { deleteKeys, emptyObject, toDateRangeString } from "../functions";

describe("Common Functions", () => {
  describe("deleteKeys()", () => {
    it("should delete keys from object in-place", () => {
      const obj = { a: 1, b: 2, c: 3, d: 4 };
      const keys = [ "a", "c" ] as const;

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

  describe("emptyObject()", () => {
    it("should empty object in-place", () => {
      const objStrKey: Record<string, unknown> = { a: 1, b: 2, c: 3, d: 4 };
      const objNumKey: Record<number, unknown> = { 1: "a", 2: "b", 3: "c", 4: "d" };
      const objSymbolKey: Record<symbol, unknown> = { [Symbol("a")]: 1, [Symbol("b")]: 2, [Symbol("c")]: 3, [Symbol("d")]: 4 };
      const objMixedKey: Record<string | number | symbol, unknown> = { a: 1, 2: "b", [Symbol("c")]: 3 };

      expect(objStrKey).toBeInstanceOf(Object);
      expect(objNumKey).toBeInstanceOf(Object);
      expect(objSymbolKey).toBeInstanceOf(Object);
      expect(objMixedKey).toBeInstanceOf(Object);

      emptyObject(objStrKey);
      emptyObject(objNumKey);
      emptyObject(objSymbolKey);
      emptyObject(objMixedKey);

      expect(objStrKey).toBeInstanceOf(Object);
      expect(objNumKey).toBeInstanceOf(Object);
      expect(objSymbolKey).toBeInstanceOf(Object);
      expect(objMixedKey).toBeInstanceOf(Object);
      expect(Object.keys(objStrKey)).toHaveLength(0);
      expect(Object.keys(objNumKey)).toHaveLength(0);
      expect(Object.keys(objSymbolKey)).toHaveLength(0);
      expect(Object.keys(objMixedKey)).toHaveLength(0);
    });

    it("should return empty object if an empty object is provided", () => {
      const objEmpty: Record<string, unknown> = { };

      expect(objEmpty).toBeInstanceOf(Object);
      expect(Object.keys(objEmpty)).toHaveLength(0);

      emptyObject(objEmpty);

      expect(objEmpty).toBeInstanceOf(Object);
      expect(Object.keys(objEmpty)).toHaveLength(0);
    });
  });

  describe("toDateRangeString()", () => {
    const predefinedDate = new Date("2000-01-01");

    it("should return date range string (sequential items)", () => {
      const testData1 = [ "2024-01-01", "2024-01-02" ];
      const testData2 = [ "2024-01-01", "2024-01-02", "2024-01-03" ];
      const testData3 = [ "2024-01-01", "2025-01-01", "2026-01-01" ];
      const testData4 = [ new Date("2024-01-01"), new Date("2024-01-02") ];
      const testData5 = [ new Date("2024-01-01"), new Date("2024-01-02"), new Date("2024-01-03") ];
      const testData6 = [ new Date("2024-01-01"), new Date("2025-01-01"), new Date("2026-01-01") ];

      expect(toDateRangeString(testData1)).toBe(`${new Date("2024-01-01").toLocaleDateString()} ~ ${new Date("2024-01-02").toLocaleDateString()}`);
      expect(toDateRangeString(testData2)).toBe(`${new Date("2024-01-01").toLocaleDateString()} ~ ${new Date("2024-01-03").toLocaleDateString()}`);
      expect(toDateRangeString(testData3)).toBe(`${new Date("2024-01-01").toLocaleDateString()} ~ ${new Date("2026-01-01").toLocaleDateString()}`);
      expect(toDateRangeString(testData4)).toBe(`${new Date("2024-01-01").toLocaleDateString()} ~ ${new Date("2024-01-02").toLocaleDateString()}`);
      expect(toDateRangeString(testData5)).toBe(`${new Date("2024-01-01").toLocaleDateString()} ~ ${new Date("2024-01-03").toLocaleDateString()}`);
      expect(toDateRangeString(testData6)).toBe(`${new Date("2024-01-01").toLocaleDateString()} ~ ${new Date("2026-01-01").toLocaleDateString()}`);
    });

    it("should return date range string (non-sequential items)", () => {
      const testData1 = [ "2024-01-01", "2024-05-30", "2024-02-21" ];
      const testData2 = [ predefinedDate, new Date("2025-01-01"), new Date("2020-04-05"), new Date("2022-12-12") ];

      expect(toDateRangeString(testData1)).toBe(`${new Date("2024-01-01").toLocaleDateString()} ~ ${new Date("2024-05-30").toLocaleDateString()}`);
      expect(toDateRangeString(testData2)).toBe(`${predefinedDate.toLocaleDateString()} ~ ${new Date("2025-01-01").toLocaleDateString()}`);
    });

    it("should return date range string (string/date mixed items)", () => {
      const testData1 = [ "2024-01-01", new Date("2024-05-30"), "2024-02-21" ];
      const testData2 = [ "2025-01-01", new Date("2020-04-05"), predefinedDate, "2022-12-12" ];

      expect(toDateRangeString(testData1)).toBe(`${new Date("2024-01-01").toLocaleDateString()} ~ ${new Date("2024-05-30").toLocaleDateString()}`);
      expect(toDateRangeString(testData2)).toBe(`${predefinedDate.toLocaleDateString()} ~ ${new Date("2025-01-01").toLocaleDateString()}`);
    });

    it("should return single locale date string if the array has only one date", () => {
      const testData1 = [ "2024-01-01" ];
      const testData2 = [ predefinedDate ];

      expect(toDateRangeString(testData1)).toBe(new Date("2024-01-01").toLocaleDateString());
      expect(toDateRangeString(testData2)).toBe(predefinedDate.toLocaleDateString());
    });

    it("should throw `TypeError` if invalid date is provided in the array", () => {
      const testData1 = [ "2024-01-01", "Invalid", "What the?" ];
      const testData2 = [ new Date(), new Date("HELLO WORLD"), new Date("2024-04-04") ];

      expect(() => toDateRangeString(testData1)).toThrow(TypeError);
      expect(() => toDateRangeString(testData2)).toThrow(TypeError);
    });
  });
});
