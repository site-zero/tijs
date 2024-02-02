import _ from "lodash";
import { expect, test } from "vitest";
import { S } from "../../core/ti";

test("isBlank", function () {
  expect(S.isBlank("")).eq(true);
  expect(S.isBlank("    ")).eq(true);
  expect(S.isBlank("  ")).eq(true);
  expect(S.isBlank(" \n ")).eq(true);
  expect(S.isBlank(" \r ")).eq(true);
  expect(S.isBlank(" \\n ")).eq(false);
});

test("sBlank", function () {
  expect(S.sBlank("", "")).eq("");
  expect(S.sBlank("    ", "hello")).eq("hello");
  expect(S.sBlank("  ", "hello")).eq("hello");
  expect(S.sBlank(" \n ", "NA")).eq("NA");
  expect(S.sBlank(" \r ", "NA")).eq("NA");
  expect(S.sBlank(" \\n ", "NA")).eq(" \\n ");
});

test("splitIgnoreBlank", function () {
  expect(S.splitIgnoreBlank("a b")[0]).eq("a b");
  expect(_.isEqual(S.splitIgnoreBlank("a,b"), ["a", "b"])).eq(true);
  expect(_.isEqual(S.splitIgnoreBlank("a,b", "-"), ["a", "b"])).eq(false);
  expect(_.isEqual(S.splitIgnoreBlank("a:b", ":"), ["a", "b"])).eq(true);
  expect(_.isEqual(S.splitIgnoreBlank(" a : b \n", ":"), ["a", "b"])).eq(true);
});

test("splitQuote", () => {
  let ll = S.splitQuote("'A,B',C,\"'D;E'\",F");
  let ss = ["'A,B'", "C", "\"'D;E'\"", "F"];
  expect(ss.length).eq(ll.length);
  expect(ss.length).eq(4);
  expect(ss[0]).eq(ll[0]);
  expect(ss[1]).eq(ll[1]);
  expect(ss[2]).eq(ll[2]);
  expect(ss[3]).eq(ll[3]);

  ll = S.splitQuote("'A,B',C,\"'D;E'\",F", { keepQuote: false });
  ss = ["A,B", "C", "'D;E'", "F"];
  expect(ss.length).eq(ll.length);
  expect(ss.length).eq(4);
  expect(ss[0]).eq(ll[0]);
  expect(ss[1]).eq(ll[1]);
  expect(ss[2]).eq(ll[2]);
  expect(ss[3]).eq(ll[3]);
});

test("toJsValue", () => {
  // why change string to number？
  expect(S.toJsValue("123")).toStrictEqual(123);
  expect(S.toJsValue(123)).toStrictEqual(123);
  expect(S.toJsValue("true")).toStrictEqual(true);
  expect(S.toJsValue("'true'")).toStrictEqual("true");
  expect(S.toJsValue("{x:100,y:99}")).toStrictEqual({ x: 100, y: 99 });
  expect(S.toJsValue("{x: '123'}")).toStrictEqual({ x: "123" });
  expect(S.toJsValue('{x: "123"}')).toStrictEqual({ x: "123" });
  expect(S.toJsValue("{x:100,y:99, z:[1, 2]}")).toStrictEqual({
    x: 100,
    y: 99,
    z: [1, 2]
  });
});

test("intToChineseNumber", () => {
  expect(S.intToChineseNumber(24)).toBe("二十四");
  expect(S.intToChineseNumber(98465)).toBe("九万八千四百六十五");
  expect(S.intToChineseNumber(119846500)).toBe("一亿一千九百八十四万六千五百");
  expect(S.intToChineseNumber(119846050)).toBe(
    "一亿一千九百八十四万六千零五十"
  );

  expect(S.intToChineseNumber(24, true)).toBe("贰拾肆");
  expect(S.intToChineseNumber(98465, true)).toBe("玖万捌仟肆佰陆拾伍");
  expect(S.intToChineseNumber(119846500, true)).toBe(
    "壹亿壹仟玖佰捌拾肆万陆仟伍佰"
  );
  expect(S.intToChineseNumber(119846050, true)).toBe(
    "壹亿壹仟玖佰捌拾肆万陆仟零伍拾"
  );
});

test("toCase", function () {
  expect(S.toCase("aabb")).eq("aabb");
  expect(S.toCase("aabb", null)).eq("aabb");
  expect(S.toCase("aabb", "upper")).eq("AABB");
  expect(S.toCase("Nb-A", "lower")).eq("nb-a");
  expect(S.toCase("Nb-A", "camel")).eq("nbA");
  expect(S.toCase("Nb A", "camel")).eq("nbA");
  expect(S.toCase("Nb A", "snake")).eq("nb_a");
  expect(S.toCase("a b c", "kebab")).eq("a-b-c");
  expect(S.toCase("Nb A", "kebab")).eq("nb-a");
  expect(S.toCase("Nb-A", "start")).eq("Nb A");
  expect(S.toCase("nb_a", "start")).eq("Nb A");
});

test("toComType", function () {
  expect(S.toComType("Nb-A")).eq("NbA");
  expect(S.toComType("camel|snake|kbab")).eq("CamelSnakeKbab");
  expect(S.toComType("camel-snake kbab")).eq("CamelSnakeKbab");
  expect(S.toComType("camel,snake_kbab")).eq("CamelSnakeKbab");
  expect(S.toComType("camel:snake_kbab")).eq("CamelSnakeKbab");
});

test("joinWithoutNil", function () {
  expect(S.joinWithoutNil("")).eq("");
  expect(S.joinWithoutNil("", 1, 2, 3)).eq("123");
  expect(S.joinWithoutNil(",", 1, 2, 3)).eq("1,2,3");
  expect(S.joinWithoutNil(",", ["1", "3", "5"])).eq("1,3,5");
  expect(S.joinWithoutNil(",", ["1", " ", "5"])).eq("1, ,5");
  expect(S.joinWithoutNil(",", ["1", null, "5"])).eq("1,5");
  expect(S.joinWithoutNil(",", ["1", undefined, "5"])).eq("1,5");
});

test("join", function () {
  expect(
    S.join(["a", "bb", "ccc"], ",", function (value, _index, _list) {
      return value;
    })
  ).eq("a,bb,ccc");

  expect(
    S.join(["a", "bb", "ccc"], ";", function (value, _index, _list) {
      return value.length;
    })
  ).eq("1;2;3");
});

test("joinAs", function () {
  let list = [
    { name: "ming", age: 60 },
    { name: "qing", age: 50 },
    { name: "zhu", age: 30 }
  ];
  expect(S.joinAs(list, ",", "name")).eq("ming,qing,zhu");
  expect(S.joinAs(list, ",", "age")).eq("60,50,30");

  list = [
    { name: "ming", age: 60 },
    { name: "qing", age: 50 },
    { name: "zhu", gender: 1 },
    { name: "zhu", age: 20 }
  ] as any[];
  expect(S.joinAs(list, ",", "age")).eq("60,50,,20");
  expect(S.joinAs(list, "", "age")).eq("605020");
});

test("toArray", function () {
  let result = ["hello", "world", "good", "day"];
  expect(
    S.toArray("hello--world-good-day", { sep: "-", ignoreNil: true })
  ).toStrictEqual(result);
  expect(S.toArray("hello;;world;good;day")).toStrictEqual(result);
});

test("toArrayBy", function () {
  let result = ["hello", "world", "day"];
  expect(S.toArrayBy("hello,world,day")).toStrictEqual(result);
  expect(S.toArrayBy("hello;;world;day", ";")).toStrictEqual(result);
  expect(S.toArrayBy("hello;;world;;day", ";")).toStrictEqual(result);
});

test("sizeText", function () {
  expect(S.sizeText(1024)).eq("1KB");
  expect(S.sizeText(1024 * 1024 + 100)).eq("1.00MB");
  expect(S.sizeText(6764544)).eq("6.45MB");
  expect(S.sizeText(2926482298)).eq("2.73GB");
});

test("toPercent", function () {
  expect(S.toPercent(0.67)).eq("67%");
  expect(S.toPercent(0.673)).eq("67.3%");
  expect(S.toPercent(0.67328)).eq("67.33%");
  expect(S.toPercent(12.67328)).eq("1267.33%");
  expect(S.toPercent(0.000001)).eq("0%");
  expect(S.toPercent(0.01011)).eq("1.01%");
});
