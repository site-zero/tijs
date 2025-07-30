import { expect, test } from "vitest";
import { ConflictItem } from "../../_type";
import {
  buildConflict,
  buildConflictList,
  buildDifferentItem,
  buildDifferentListItems,
} from "../../core";

test("conflict-item-00", function () {
  let local = { id: "A", a: 35, b: "hello", c: { color: "red" } };
  let remote = { id: "A", a: 34, b: "hello", c: { color: "red" } };
  let server = { id: "A", a: 100, b: "hello" };

  let myDiff = buildDifferentItem(local, remote);
  let taDiff = buildDifferentItem(server, remote);

  let conflict = buildConflict(myDiff, taDiff);
  expect(conflict).toEqual({
    id: "A",
    myDiffType: "CHANGE",
    taDiffType: "CHANGE",
    myDelta: { a: 35 },
    taDelta: { a: 100, c: null },
    fields: {
      a: {
        myValue: 35,
        taValue: 100,
      },
    },
  } as ConflictItem);
});

test("conflict-item-01", function () {
  let local = { id: "A", a: 35, b: "hello" };
  let remote = { id: "A", a: 34, b: "hello", c: { color: "red" } };
  let server = { id: "A", a: 100, b: "hello", c: { color: "red" } };

  let myDiff = buildDifferentItem(local, remote);
  let taDiff = buildDifferentItem(server, remote);

  let conflict = buildConflict(myDiff, taDiff);
  expect(conflict).toEqual({
    id: "A",
    myDiffType: "CHANGE",
    taDiffType: "CHANGE",
    myDelta: { a: 35, c: null },
    taDelta: { a: 100 },
    fields: {
      a: {
        myValue: 35,
        taValue: 100,
      },
    },
  } as ConflictItem);
});

test("conflict-list-00", function () {
  let local = [
    { id: "A", name: "apple", age: 19, info: { x: true, y: 1.5 } },
    { id: "B", name: "banana", age: 5, info: { x: true, y: 1.5 } },
    { id: "C", name: "cherry", age: 30, info: { x: false, y: 1.5 } },
  ];
  let remote = [
    { id: "A", name: "apple", age: 5, info: { x: true, y: 1.5 } },
    { id: "B", name: "banana", age: 5, info: { x: true, y: 1.5 } },
    { id: "C", name: "cherry", age: 5, info: { x: true, y: 1.5 } },
  ];
  let server = [
    { id: "A", name: "apple", age: 5, info: { x: true, y: 1.5 } },
    { id: "B", name: "banana", age: 5, info: { x: false, y: 200 } },
    { id: "C", name: "cherry", age: 5, info: { x: true, y: 1.5 } },
  ];

  let myDiff = buildDifferentListItems(local, remote);
  let taDiff = buildDifferentListItems(server, remote);

  let conflicts = buildConflictList(myDiff, taDiff);

  expect(conflicts.length).eq(0);
});

test("conflict-list-01", function () {
  let local = [
    { id: "A", name: "apple", age: 19, info: { x: true, y: "1.5" } },
    { id: "B", name: "banana", age: 5, info: { x: true, y: "1.5" } },
    { id: "C", name: "cherry", age: 30, info: { x: false, y: "1.5" } },
  ];
  let remote = [
    { id: "A", name: "apple", age: 5, info: { x: true, y: "1.5" } },
    { id: "B", name: "banana", age: 5, info: { x: true, y: "1.5" } },
    { id: "C", name: "cherry", age: 5, info: { x: true, y: "1.5" } },
  ];
  let server = [
    { id: "A", name: "apple", age: 5, info: { x: true, y: "1.5" } },
    { id: "B", name: "banana", age: 5, info: { x: false, y: "200" } },
    { id: "C", name: "cherry", age: 39, info: { x: false, y: "1.5" } },
  ];

  let myDiff = buildDifferentListItems(local, remote);
  let taDiff = buildDifferentListItems(server, remote);

  let conflicts = buildConflictList(myDiff, taDiff);

  expect(conflicts.length).eq(1);
  expect(conflicts[0]).toEqual({
    id: "C",
    myDiffType: "CHANGE",
    taDiffType: "CHANGE",
    myDelta: { age: 30, info: { x: false, y: "1.5" } },
    taDelta: { age: 39, info: { x: false, y: "1.5" } },
    fields: {
      age: {
        myValue: 30,
        taValue: 39,
      },
    },
  } as ConflictItem);
});

test("conflict-list-02", function () {
  let local = [
    { id: "A", name: "apple", age: 19, info: { x: true, y: "1.5" } },
    { id: "B", name: "banana", age: 5, info: { x: true, y: "1.5" } },
  ];
  let remote = [
    { id: "A", name: "apple", age: 5, info: { x: true, y: "1.5" } },
    { id: "B", name: "banana", age: 5, info: { x: true, y: "1.5" } },
    { id: "C", name: "cherry", age: 5, info: { x: true, y: "1.5" } },
  ];
  let server = [
    { id: "B", name: "banana", age: 5, info: { x: false, y: "200" } },
    { id: "C", name: "cherry", age: 39, info: { x: false, y: "1.5" } },
  ];

  let myDiff = buildDifferentListItems(local, remote);
  let taDiff = buildDifferentListItems(server, remote);

  let conflicts = buildConflictList(myDiff, taDiff);
  expect(conflicts.length).eq(2);
  expect(conflicts[0]).toEqual({
    id: "A",
    myDiffType: "CHANGE",
    taDiffType: "DELETE",
    myDelta: { age: 19 },
    taDelta: {},
    fields: {},
  } as ConflictItem);
  expect(conflicts[1]).toEqual({
    id: "C",
    myDiffType: "DELETE",
    taDiffType: "CHANGE",
    myDelta: {},
    taDelta: { age: 39, info: { x: false, y: "1.5" } },
    fields: {},
  } as ConflictItem);
});
