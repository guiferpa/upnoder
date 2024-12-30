import { normalizeMetadataKeys } from "./file";

describe("Logic file", () => {
  describe("Normalize metadata keys", () => {
    test("Should be normal given camel case keys", () => {
      const raw = {
        itsCamelCaseA: "A",
        itsCamelCaseB: "B",
      };
      const got = normalizeMetadataKeys(raw);
      expect(got).toStrictEqual({
        its_camel_case_a: "A",
        its_camel_case_b: "B",
      });
    });

    test("Should be normal given camel case keys with more levels", () => {
      const raw = {
        itsCamelCaseA: {
          itsCamelCaseAAnotherLevel: "A",
        },
        itsCamelCaseB: "B",
      };
      const got = normalizeMetadataKeys(raw);
      expect(got).toStrictEqual({
        its_camel_case_a: {
          its_camel_case_a_another_level: "A",
        },
        its_camel_case_b: "B",
      });
    });
  });
});
