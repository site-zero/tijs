import { DynBoolEle } from "./ele/dyn_bool_ele";
import { DynDateEle } from "./ele/dyn_date_ele";
import { DynElEle } from "./ele/dyn_el_ele";
import { DynFloatEle } from "./ele/dyn_float_ele";
import { DynIntEle } from "./ele/dyn_int_ele";
import { DynJsonEle } from "./ele/dyn_json_ele";
import { DynStrEle } from "./ele/dyn_str_ele";
import { DynElInfo, TmplEle } from "./ti-tmpl";

export function createTmplEle(s_match: string): TmplEle {
  // 如果是 `=` 开头，直接就作为字符串好了
  // 这个特殊处理，可以用来把占位符和 El 结合起来
  // 如果想输出一个占位符是 El 表达式，那么写个 = ， 就会被认为是字符串默认保留
  // 如果渲染的时候，对 key 进行判断，发现是 = 开头的 key，用 El 预先渲染并填入上下文就好了
  // TODO 这个是不是应该搞一个 TmplElEle 呢？
  if (s_match.startsWith("=")) {
    let el = s_match.substring(1).trim();
    return new DynElEle(el);
    //throw `Don't support EL yet: ${el}`;
  }

  //
  // 依次判断各种占位符
  //
  let _P2 = new RegExp(
    "([^<>()?]+)" +
      "([<(](int|long|boolean|float|double|date|string|json)?( *: *([^>]*))?[>)])?" +
      "([?] *(.*) *)?"
  );
  let m2 = _P2.exec(s_match);

  if (!m2) {
    throw new Error(`Fail to parse tmpl key : '${s_match}'`);
  }

  // 收集解析信息
  let info = {
    key: m2[1],
    type: m2[3] ?? "string",
    fmt: m2[5],
    dft: m2[7]
  } as DynElInfo;

  // 创建元素
  switch (info.type) {
    case "string":
      return new DynStrEle(info);
    // int
    case "int":
      return new DynIntEle(info);
    // long
    case "long":
      return new DynIntEle(info);
    // boolean
    case "boolean":
      return new DynBoolEle(info);
    // float
    case "float":
      return new DynFloatEle(info);
    // double
    case "double":
      return new DynFloatEle(info);
    // date
    case "date":
      return new DynDateEle(info);
    // json
    case "json":
      return new DynJsonEle(info);
  }

  throw new Error(`e.cmd.impossiable: ${s_match}`);
}
