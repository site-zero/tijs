import { expect, test } from "vitest";
import { NumRange, TiColor } from "../../core/ti";

test("color:HEX", () => {
  expect("#FFFFFF").eq(new TiColor([255, 255, 255]).hex);
  expect("#FFFF00").eq(new TiColor([255, 255, 0, 0.3]).hex);
});

test("color:RGB", () => {
  expect("RGB(128,255,255)").eq(new TiColor([128, 255, 255]).rgb);
  expect("RGBA(255,255,0,0.3)").eq(new TiColor([255, 255, 0, 0.3]).rgba);
});

test("range:num-(0,100]", () => {
  const _T = (s: string) => new NumRange(s);
  let rg = _T("(0,100]");
  expect(rg.toString()).eq("(0,100]");
  expect(rg.contains(1)).eq(true);
  expect(rg.contains(100)).eq(true);
  for (let n = 1; n <= 100; n++) {
    expect(rg.contains(n)).eq(true);
  }
  expect(rg.contains(0)).eq(false);
  expect(rg.contains(101)).eq(false);
});

test("range:num-(100)", () => {
  const _T = (s: string) => new NumRange(s);
  let rg = _T("(100)");
  expect(rg.toString()).eq("(100)");
  for (let n = 1; n < 100; n++) {
    expect(rg.contains(n)).eq(false);
  }
  expect(rg.contains(0)).eq(false);
  expect(rg.contains(100)).eq(false);

  rg = _T("(100,100)");
  expect(rg.toString()).eq("(100)");
  for (let n = 1; n < 100; n++) {
    expect(rg.contains(n)).eq(false);
  }
  expect(rg.contains(0)).eq(false);
  expect(rg.contains(100)).eq(false);
});

test("range:num-(1,)", () => {
  const _T = (s: string) => new NumRange(s);
  let rg = _T("(1,)");
  expect(rg.toString()).eq("(1,)");
  expect(rg.contains(0)).eq(false);
  expect(rg.contains(100)).eq(true);
});
