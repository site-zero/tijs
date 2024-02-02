import _ from "lodash";
import { Vars, ExplainOptions, Explainer } from "../../ti";
import { buildExplainer } from "../util-explain";

export class ArrayExplainer implements Explainer {
  // 解析后的处理函数
  private items: Explainer[];

  // 构造函数，进行编译
  constructor(input: any[]) {
    this.items = [];
    for (let obj of input) {
      let it = buildExplainer(obj);
      this.items.push(it);
    }
  }

  // 执行渲染
  explain(context: Vars, options: ExplainOptions): any[] {
    let reList = [];
    for (let it of this.items) {
      let re = it.explain(context, options);
      reList.push(re);
    }
    return reList;
  }
}
