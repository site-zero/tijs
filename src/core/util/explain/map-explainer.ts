import _ from 'lodash';
import { ExplainOptions, Explainer, Vars } from '../../../_type';
import { buildExplainer } from '../util-explain';
import { ArrayExplainer } from './array-explainer';

type MapExplainField = {
  // "..." 开头的键，表示解构，一个对象可以有 "...","...1", "...2" 多个解构键
  decon?: boolean;
  name: string;
  value: Explainer;
};

export class MapExplainer implements Explainer {
  // 解析后的处理函数
  private fields: MapExplainField[];

  // 构造函数，进行编译
  constructor(input: object) {
    this.fields = [];
    let fld: MapExplainField;
    _.forEach(input, (v, name) => {
      let decon = /^\.{3,}/.test(name);
      if (!decon && _.isArray(v)) {
        fld = {
          decon: false,
          name,
          value: new ArrayExplainer(v, `=${name}`),
        };
      }
      // 其他采用通用的解析
      else {
        fld = {
          decon,
          name,
          value: buildExplainer(v),
        };
      }
      // 计入字段列表
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
