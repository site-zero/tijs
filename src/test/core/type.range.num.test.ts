import { expect, test } from "vitest";
import { NumRange } from "../../core/";

//-----------------------------------------------
// 从 string 构建
//-----------------------------------------------
test("range:num<input as str>-(0,100]", () => {
  let rg = new NumRange("(0,100]");
  expect(rg.toString()).eq("(0,100]");
  expect(rg.contains(1)).eq(true);
  expect(rg.contains(100)).eq(true);
  for (let n = 1; n <= 100; n++) {
    expect(rg.contains(n)).eq(true);
  }
  expect(rg.contains("abc" as any)).eq(false);
  expect(rg.contains(0)).eq(false);
  expect(rg.contains(101)).eq(false);

  let ro = rg.toRangeObj();
  expect(ro).toStrictEqual({ $gt: 0, $lte: 100 });

  let ri = rg.toRangeInfo();
  expect(ri).toStrictEqual({
    hasMinValue: true,
    minValue: 0,
    minValueIncluded: false,
    hasMaxValue: true,
    maxValue: 100,
    maxValueIncluded: true,
  });
});
//-----------------------------------------------
test("range:num<input as str>-(100)", () => {
  let rg = new NumRange("(100)");
  expect(rg.toString()).eq("(100)");
  for (let n = 1; n < 100; n++) {
    expect(rg.contains(n)).eq(false);
  }
  expect(rg.contains(0)).eq(false);
  expect(rg.contains(100)).eq(false);

  rg = new NumRange("(100,100)");
  expect(rg.toString()).eq("(100)");
  for (let n = 1; n < 100; n++) {
    expect(rg.contains(n)).eq(false);
  }
  expect(rg.contains(0)).eq(false);
  expect(rg.contains(100)).eq(false);

  let ro = rg.toRangeObj();
  expect(ro).toStrictEqual({ $ne: 100 });

  let ri = rg.toRangeInfo();
  expect(ri).toStrictEqual({
    hasMinValue: true,
    minValue: 100,
    minValueIncluded: false,
    hasMaxValue: true,
    maxValue: 100,
    maxValueIncluded: false,
  });
});
//-----------------------------------------------
test("range:num<input as str>-(1,)", () => {
  let rg = new NumRange("(1,)");
  expect(rg.toString()).eq("(1,)");
  expect(rg.contains(0)).eq(false);
  expect(rg.contains(100)).eq(true);

  let ro = rg.toRangeObj();
  expect(ro).toStrictEqual({ $gt: 1 });

  let ri = rg.toRangeInfo();
  expect(ri).toStrictEqual({
    hasMinValue: true,
    minValue: 1,
    minValueIncluded: false,
    hasMaxValue: false,
  });
});

//-----------------------------------------------
// 从 RangeInfo 构建
//-----------------------------------------------
test("range:num<input as info>-(0,100]", () => {
  // let rg = new NumRange("(0,100]");
  let rg = new NumRange({
    hasMinValue: true,
    minValue: 0,
    minValueIncluded: false,
    hasMaxValue: true,
    maxValue: 100,
    maxValueIncluded: true,
  });
  expect(rg.toString()).eq("(0,100]");
  expect(rg.contains(1)).eq(true);
  expect(rg.contains(100)).eq(true);
  for (let n = 1; n <= 100; n++) {
    expect(rg.contains(n)).eq(true);
  }
  expect(rg.contains("abc" as any)).eq(false);
  expect(rg.contains(0)).eq(false);
  expect(rg.contains(101)).eq(false);
});
//-----------------------------------------------
test("range:num<input as info>-(100)", () => {
  //let rg = new NumRange("(100)");
  let rg = new NumRange({
    hasMinValue: true,
    minValue: 100,
    minValueIncluded: false,
    hasMaxValue: true,
    maxValue: 100,
    maxValueIncluded: false,
  });
  expect(rg.toString()).eq("(100)");
  for (let n = 1; n < 100; n++) {
    expect(rg.contains(n)).eq(false);
  }
  expect(rg.contains(0)).eq(false);
  expect(rg.contains(100)).eq(false);
});
//-----------------------------------------------
test("range:num<input as info>-(1,)", () => {
  //let rg = new NumRange("(1,)");
  let rg = new NumRange({
    hasMinValue: true,
    minValue: 1,
    minValueIncluded: false,
    hasMaxValue: false,
    maxValueIncluded: false,
  });
  expect(rg.toString()).eq("(1,)");
  expect(rg.contains(0)).eq(false);
  expect(rg.contains(100)).eq(true);
});

//-----------------------------------------------
// 从 RangeObj 构建
//-----------------------------------------------
test("range:num<input as obj>-(0,100]", () => {
  // let rg = new NumRange("(0,100]");
  let rg = new NumRange({ $gt: 0, $lte: 100 });
  expect(rg.toString()).eq("(0,100]");
  expect(rg.contains(1)).eq(true);
  expect(rg.contains(100)).eq(true);
  for (let n = 1; n <= 100; n++) {
    expect(rg.contains(n)).eq(true);
  }
  expect(rg.contains("abc" as any)).eq(false);
  expect(rg.contains(0)).eq(false);
  expect(rg.contains(101)).eq(false);
});
//-----------------------------------------------
test("range:num<input as obj>-(100)", () => {
  //let rg = new NumRange("(100)");
  let rg = new NumRange({ $ne: 100 });
  expect(rg.toString()).eq("(100)");
  for (let n = 1; n < 100; n++) {
    expect(rg.contains(n)).eq(false);
  }
  expect(rg.contains(0)).eq(false);
  expect(rg.contains(100)).eq(false);
});
//-----------------------------------------------
test("range:num<input as obj>-(1,)", () => {
  //let rg = new NumRange("(1,)");
  let rg = new NumRange({ $gt: 1 });
  expect(rg.toString()).eq("(1,)");
  expect(rg.contains(0)).eq(false);
  expect(rg.contains(100)).eq(true);
});
