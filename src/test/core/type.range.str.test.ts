import { expect, test } from "vitest";
import { StrRange } from "../../core/";

//-----------------------------------------------
// 从 string 构建
//-----------------------------------------------
test("range:str<input as str>-(A,D]", () => {
  let rg = new StrRange("(A,D]");
  expect(rg.toString()).eq("(A,D]");
  expect(rg.contains("B")).eq(true);
  expect(rg.contains("C")).eq(true);
  expect(rg.contains("D")).eq(true);
  expect(rg.contains("abc")).eq(false);
  expect(rg.contains("9")).eq(false);
  expect(rg.contains("*")).eq(false);

  let ro = rg.toRangeObj();
  expect(ro).toStrictEqual({ $gt: "A", $lte: "D" });

  let ri = rg.toRangeInfo();
  expect(ri).toStrictEqual({
    hasMinValue: true,
    minValue: "A",
    minValueIncluded: false,
    hasMaxValue: true,
    maxValue: "D",
    maxValueIncluded: true,
  });
});
//-----------------------------------------------
test("range:str<input as str>-(D)", () => {
  let rg = new StrRange("(D)");
  expect(rg.toString()).eq("(D)");
  expect(rg.contains("B")).eq(false);
  expect(rg.contains("C")).eq(false);
  expect(rg.contains("D")).eq(false);

  let ro = rg.toRangeObj();
  expect(ro).toStrictEqual({ $ne: "D" });

  let ri = rg.toRangeInfo();
  expect(ri).toStrictEqual({
    hasMinValue: true,
    minValue: "D",
    minValueIncluded: false,
    hasMaxValue: true,
    maxValue: "D",
    maxValueIncluded: false,
  });

  rg = new StrRange("(D,D)");
  expect(rg.toString()).eq("(D)");
  expect(rg.contains("B")).eq(false);
  expect(rg.contains("C")).eq(false);
  expect(rg.contains("D")).eq(false);

  ro = rg.toRangeObj();
  expect(ro).toStrictEqual({ $ne: "D" });

  ri = rg.toRangeInfo();
  expect(ri).toStrictEqual({
    hasMinValue: true,
    minValue: "D",
    minValueIncluded: false,
    hasMaxValue: true,
    maxValue: "D",
    maxValueIncluded: false,
  });
});
//-----------------------------------------------
test("range:str<input as str>-(B,)", () => {
  let rg = new StrRange("(B,)");
  expect(rg.toString()).eq("(B,)");
  expect(rg.contains("A")).eq(false);
  expect(rg.contains("B")).eq(false);
  expect(rg.contains("C")).eq(true);
  expect(rg.contains("D")).eq(true);

  let ro = rg.toRangeObj();
  expect(ro).toStrictEqual({ $gt: "B" });

  let ri = rg.toRangeInfo();
  expect(ri).toStrictEqual({
    hasMinValue: true,
    minValue: "B",
    minValueIncluded: false,
    hasMaxValue: false,
  });
});

//-----------------------------------------------
// 从 RangeInfo 构建
//-----------------------------------------------
test("range:str<input as info>-(A,D]", () => {
  // let rg = new StrRange("(A,D]");
  let rg = new StrRange({
    hasMinValue: true,
    minValue: "A",
    minValueIncluded: false,
    hasMaxValue: true,
    maxValue: "D",
    maxValueIncluded: true,
  });
  expect(rg.toString()).eq("(A,D]");
  expect(rg.contains("B")).eq(true);
  expect(rg.contains("C")).eq(true);
  expect(rg.contains("D")).eq(true);
  expect(rg.contains("abc")).eq(false);
  expect(rg.contains("9")).eq(false);
  expect(rg.contains("*")).eq(false);
});
//-----------------------------------------------
test("range:str<input as info>-(D)", () => {
  //let rg = new StrRange("(D)");
  let rg = new StrRange({
    hasMinValue: true,
    minValue: "D",
    minValueIncluded: false,
    hasMaxValue: true,
    maxValue: "D",
    maxValueIncluded: false,
  });
  expect(rg.toString()).eq("(D)");
  expect(rg.contains("B")).eq(false);
  expect(rg.contains("C")).eq(false);
  expect(rg.contains("D")).eq(false);
});
//-----------------------------------------------
test("range:str<input as info>-(B,)", () => {
  //let rg = new StrRange("(B,)");
  let rg = new StrRange({
    hasMinValue: true,
    minValue: "B",
    minValueIncluded: false,
    hasMaxValue: false,
    maxValueIncluded: false,
  });
  expect(rg.toString()).eq("(B,)");
  expect(rg.contains("A")).eq(false);
  expect(rg.contains("B")).eq(false);
  expect(rg.contains("C")).eq(true);
  expect(rg.contains("D")).eq(true);
});

//-----------------------------------------------
// 从 RangeObj 构建
//-----------------------------------------------
test("range:str<input as obj>-(A,D]", () => {
  // let rg = new StrRange("(A,D]");
  let rg = new StrRange({ $gt: "A", $lte: "D" });
  expect(rg.toString()).eq("(A,D]");
  expect(rg.contains("B")).eq(true);
  expect(rg.contains("C")).eq(true);
  expect(rg.contains("D")).eq(true);
  expect(rg.contains("abc")).eq(false);
  expect(rg.contains("9")).eq(false);
  expect(rg.contains("*")).eq(false);
});
//-----------------------------------------------
test("range:str<input as obj>-(D)", () => {
  //let rg = new StrRange("(D)");
  let rg = new StrRange({ $ne: "D" });
  expect(rg.toString()).eq("(D)");
  expect(rg.contains("B")).eq(false);
  expect(rg.contains("C")).eq(false);
  expect(rg.contains("D")).eq(false);
});
//-----------------------------------------------
test("range:str<input as obj>-(B,)", () => {
  //let rg = new StrRange("(B,)");
  let rg = new StrRange({ $gt: "B" });
  expect(rg.toString()).eq("(B,)");
  expect(rg.contains("A")).eq(false);
  expect(rg.contains("B")).eq(false);
  expect(rg.contains("C")).eq(true);
  expect(rg.contains("D")).eq(true);
});
