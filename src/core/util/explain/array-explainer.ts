import _ from 'lodash';
import { ExplainOptions, Explainer, Vars } from '../../../_type';
import { buildExplainer } from '../util-explain';

export class ArrayExplainer implements Explainer {
  // 解析后的处理函数
  private scope?: Explainer;
  private mapper?: Explainer;
  private items: Explainer[] = [];

  // 构造函数，进行编译
  constructor(input: any[]) {
    let items: Explainer[] = [];
    for (let obj of input) {
      let it = buildExplainer(obj);
      items.push(it);
    }
    if (items.length === 2) {
      this.scope = items[0];
      this.mapper = items[1];
    } else {
      this.items = items;
    }
  }

  // 执行渲染
  explain(context: Vars, options: ExplainOptions): any[] {
    let reList = [];
    // 深入数组 mapping
    if (this.scope && this.mapper) {
      let scope = this.scope.explain(context, options);
      let srcList = _.concat([], scope);
      for (let it of srcList) {
        let re = this.mapper.explain(it, options);
        reList.push(re);
      }
    }
    // 从上下文挑选
    else {
      for (let it of this.items) {
        let re = it.explain(context, options);
        reList.push(re);
      }
    }
    return reList;
  }
}
