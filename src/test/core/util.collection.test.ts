import { expect, test } from "vitest";
import * as Util from "../../core/util";

test("pushEle", () => {
  let a = {} as { [k: string]: any };
  Util.pushEle(a, "pets", "A", "B");
  expect(a.pets).toStrictEqual(["A", "B"]);
});

test("grouping", () => {
  let list = [
    { type: "A", name: "A1" },
    { type: "A", name: "A2" },
    { type: "A", name: "A3" },
    { type: "B", name: "B1" },
    { type: "B", name: "B2" },
    { name: "X1" },
    { name: "X2" }
  ] as any[];
  let re = Util.grouping(list, "type", {
    titles: [
      { text: "GA", value: "A" },
      { text: "GB", value: "B" }
    ],
    asList: true
  }) as {
    text: string;
    value: string;
    list: { type: string; name: string }[];
  }[];
  //console.log(JSON.stringify(re, null, "   "));
  expect(re.length).eq(3);
  expect(re[0].value).eq("A");
  expect(re[0].text).eq("GA");
  expect(re[0].list.length).eq(3);
  expect(re[0].list[0].name).eq("A1");
  expect(re[0].list[1].name).eq("A2");
  expect(re[0].list[2].name).eq("A3");
  expect(re[1].value).eq("B");
  expect(re[1].text).eq("GB");
  expect(re[1].list.length).eq(2);
  expect(re[1].list[0].name).eq("B1");
  expect(re[1].list[1].name).eq("B2");
  expect(re[2].value).eq("Others");
  expect(re[2].text).eq("Others");
  expect(re[2].list.length).eq(2);
  expect(re[2].list[0].name).eq("X1");
  expect(re[2].list[1].name).eq("X2");
});
