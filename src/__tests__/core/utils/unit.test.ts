import { unit, isUnit } from "../../../app/core/utils/unit";

describe("unit", () => {
  const tUnitValue = unit;
  const tNotUnitValue = "test";

  test("should be an instance of Unit ", () => {
    // act
    const result = isUnit(tUnitValue);
    // assert
    expect(result).toBe(true);
  });

  test("should not be an instance of Unit ", () => {
    // act
    const result = isUnit(tNotUnitValue);
    // assert
    expect(result).toBe(false);
  });
});
