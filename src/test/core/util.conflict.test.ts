import { expect, test } from "vitest";
import { makeConflict, makeConflictList } from "../../core";

test("conflict-obj-simple", function () {
  let my = { a: 35, b: "hello", c: { color: "red" } };
  let ta = { a: 34, b: "hello", d: true };
  let conflict = makeConflict(my, ta);
  expect(conflict).toEqual({
    a: {
      myValue: 35,
      taValue: 34,
    },
  });
});

test("conflict-obj-valobj", function () {
  let my = { a: 35, b: "hello", c: { color: "red" } };
  let ta = { a: 34, b: "hello", c: { color: "blue" } };
  let conflict = makeConflict(my, ta);
  expect(conflict).toEqual({
    a: {
      myValue: 35,
      taValue: 34,
    },
    c: {
      myValue: {
        color: "red",
      },
      taValue: {
        color: "blue",
      },
    },
  });
});

test("conflict-list-simple", function () {
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

  let conflicts = makeConflictList(myList, taList);
  //console.log(JSON.stringify(conflicts, null, 4));
  expect(conflicts.length).eq(2);
  expect(conflicts[0].index).eq(1);
  expect(conflicts[0].detail).toEqual({
    name: {
      myValue: "banana",
      taValue: "bael",
    },
    color: {
      myValue: "yellow",
      taValue: "orange",
    },
    size: {
      myValue: 11,
      taValue: 7,
    },
  });
  expect(conflicts[1].index).eq(2);
  expect(conflicts[1].detail).toEqual({
    size: {
      myValue: 2,
      taValue: 3,
    },
  });
});
