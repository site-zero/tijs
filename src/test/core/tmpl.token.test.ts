import { expect, test } from "vitest";
import _ from "lodash";
import { parseTokens } from "../../core/tmpl/token-parse";

test("simpleToken", () => {
  let s = "A${B}C${D}E";
  let tks = parseTokens(s);
  expect(tks.length).eq(5);
  expect(tks[0].toString()).eq("<TEXT>: 'A'");
  expect(tks[1].toString()).eq("<DYNAMIC#VAR>: 'B'");
  expect(tks[2].toString()).eq("<TEXT>: 'C'");
  expect(tks[3].toString()).eq("<DYNAMIC#VAR>: 'D'");
  expect(tks[4].toString()).eq("<TEXT>: 'E'");
});

test("t2", () => {
  let s = "A${{B}}C${{{D}}}E";
  let tks = parseTokens(s);
  expect(tks.length).eq(5);
  expect(tks[0].toString()).eq("<TEXT>: 'A'");
  expect(tks[1].toString()).eq("<DYNAMIC#VAR>: '{B}'");
  expect(tks[2].toString()).eq("<TEXT>: 'C'");
  expect(tks[3].toString()).eq("<DYNAMIC#VAR>: '{{D}}'");
  expect(tks[4].toString()).eq("<TEXT>: 'E'");
});
