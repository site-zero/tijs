import { expect, test } from "vitest";
import { isNumRangeInfo } from "../../_type";
import { TiColor } from "../../core/";

test("color:HEX", () => {
  expect("#FFFFFF").eq(new TiColor([255, 255, 255]).hex);
  expect("#FFFF00").eq(new TiColor([255, 255, 0, 0.3]).hex);
});

test("color:RGB", () => {
  expect("RGB(128,255,255)").eq(new TiColor([128, 255, 255]).rgb);
  expect("RGBA(255,255,0,0.3)").eq(new TiColor([255, 255, 0, 0.3]).rgba);
});

test("isNumRangeInfo", () => {
  expect(true).eq(
    isNumRangeInfo({
      hasMinValue: true,
      minValue: 0,
      hasMaxValue: undefined,
      maxValue: undefined,
    })
  );
  expect(true).eq(
    isNumRangeInfo({
      hasMinValue: undefined,
      minValue: undefined,
      hasMaxValue: true,
      maxValue: 0,
    })
  );
});
