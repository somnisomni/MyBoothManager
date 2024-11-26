import { generateRandomDigestFileName } from "@/lib/utils/security";

describe("Security Utilities", () => {
  describe("generateRandomDigestFileName()", () => {
    it("should generate a random digest file name", () => {
      const { fileName } = generateRandomDigestFileName();

      expect(fileName).toBeDefined();
      expect(fileName).toBeTruthy();
      expect(typeof fileName).toBe("string");
      try {
        const decoded = Buffer.from(fileName, "base64url").toString("utf-8");
        expect(decoded).toBeDefined();
        expect(decoded).toBeTruthy();
      } catch(_) {
        fail("Failed to decode base64url encoded file name.");
      }
    });

    it("should be able to append extension to the file name", () => {
      const generated = generateRandomDigestFileName();

      expect(generated).toBeDefined();
      expect(generated).toBeTruthy();
      expect(generated).toBeInstanceOf(Object);
      expect(generated).toHaveProperty("fileName");
      expect(generated).toHaveProperty("withExt");
      expect(typeof generated.withExt).toBe("function");

      const ext = "txt";
      const fileNameWithExt = generated.withExt(ext);

      expect(fileNameWithExt).toBeDefined();
      expect(fileNameWithExt).toBeTruthy();
      expect(typeof fileNameWithExt).toBe("string");
      expect(fileNameWithExt).toMatch(new RegExp(`^${generated.fileName}\\.${ext}$`));
    });
  });
});
