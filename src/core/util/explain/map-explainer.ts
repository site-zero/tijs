import _ from "lodash";
import { ExplainOptions, Explainer, Vars } from "../../ti";
import { buildExplainer } from "../util-explain";

type Field = {
  // "..." 开头的键，表示解构，一个对象可以有 "...","...1", "...2" 多个解构键
  decon?: boolean;
  name: string;
  value: Explainer;
};

export class MapExplainer implements Explainer {
  // 解析后的处理函数
  private fields: Field[];

  // 构造函数，进行编译
  constructor(input: object) {
    this.fields = [];
    _.forEach(input, (v, name) => {
      let fld = {
        decon: /^\.{3,}/.test(name),
        name,
        value: buildExplainer(v)
      };
      this.fields.push(fld);
    });
  }

  // 执行渲染
  explain(context: Vars, options: ExplainOptions): any {
    let reMap = {} as { [k: string]: any };
    for (let fld of this.fields) {
      let val = fld.value.explain(context, options);
      // 解构
      if (fld.decon) {
        if (!_.isNil(val)) {
          _.assign(reMap, val);
        }
      }
      // 直接赋值
      else {
        reMap[fld.name] = val;
      }
    }
    return reMap;
  }
}
