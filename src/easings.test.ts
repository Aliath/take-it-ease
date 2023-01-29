import { EasingFunctions } from "./easings";

describe("easings", () => {
  it("checks if f(0) = 0", () => {
    Object.keys(EasingFunctions).forEach((key) => {
      const fn = EasingFunctions[key as keyof typeof EasingFunctions];

      const value = fn(0);
      expect(value).toBeLessThanOrEqual(0);
      expect(value).toBeGreaterThanOrEqual(-Number.EPSILON);
    });
  });

  it("checks if f(1) = 1", () => {
    Object.keys(EasingFunctions).forEach((key) => {
      const fn = EasingFunctions[key as keyof typeof EasingFunctions];

      const value = fn(1);
      expect(value - 1).toBeLessThanOrEqual(Number.EPSILON);
      expect(value - 1).toBeGreaterThanOrEqual(-Number.EPSILON);
    });
  });
});
