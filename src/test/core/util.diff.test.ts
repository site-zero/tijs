import { DiffItem } from "index";
import { expect, test } from "vitest";
import { buildDifferentItem, buildDifferentListItems } from "../../core";

test("diff-obj-00", function () {
  let my = { a: 35, b: "hello", c: { color: "red" } };
  let ta = { a: 34, b: "hello", d: true };
  let diff = buildDifferentItem(my, ta);
  expect(diff?.delta).toEqual({
    a: 35,
    c: { color: "red" },
    d: null,
  });
});

test("diff-obj-01", function () {
  let my = { a: 35, b: "hello", c: { color: "red" } };
  let ta = { a: 34, b: "hello", c: { color: "blue" } };
  let diff = buildDifferentItem(my, ta);
  expect(diff?.delta).toEqual({
    a: 35,
    c: { color: "red" },
  });
});

test("diff-obj-03", function () {
  let my = { id: "A", a: 100, b: "hello" };
  let ta = { id: "A", a: 34, b: "hello", c: { color: "red" } };
  let diff = buildDifferentItem(my, ta);
  expect(diff?.delta).toEqual({
    a: 100,
    c: null,
  });
});

test("diff-list-00", function () {
  let myList = [
    { id: "A", name: "apple", color: "red", size: 10 },
    { id: "B", name: "banana", color: "yellow", size: 11 },
    { id: "C", name: "cherry", color: "purple", size: 2 },
  ];
  let taList = [
    { id: "C", name: "cherry", color: "purple", size: 3 },
    { id: "A", name: "apple", color: "red", size: 10 },
    { id: "B", name: "bael", color: "orange", size: 7 },
  ];

  let diffs = buildDifferentListItems(myList, taList);
  expect(diffs.length).eq(2);
  expect(diffs[0].id).eq("B");
  expect(diffs[0].delta).toEqual({
    name: "banana",
    color: "yellow",
    size: 11,
  });
  expect(diffs[1].id).eq("C");
  expect(diffs[1].delta).toEqual({
    size: 2,
  });
});

test("diff-list-01", function () {
  let myList = [
    { id: "B", name: "banana", color: "yellow", size: 11 },
    { id: "C", name: "cherry", color: "purple", size: 2 },
  ];
  let taList = [
    { id: "A", name: "apple", color: "red", size: 10 },
    { id: "B", name: "banana", color: "yellow", size: 11 },
    { id: "C", name: "cherry", color: "purple", size: 2 },
  ];

  let diffs = buildDifferentListItems(myList, taList);
  console.log(JSON.stringify(diffs, null, 4));
  expect(diffs.length).eq(1);
  expect(diffs[0]).toEqual({
    id: "A",
    existsInMine: false,
    existsInTarget: true,
    myData: undefined,
    taData: { id: "A", name: "apple", color: "red", size: 10 },
    delta: {},
  } as DiffItem);
});
