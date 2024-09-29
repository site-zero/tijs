import _ from 'lodash';
import { ExplainOptions, Explainer, Vars } from '../../../_type';
import { buildExplainer } from '../util-explain';

export class ArrayExplainer implements Explainer {
  // 解析后的处理函数
  private scope?: Explainer;
  private mapper?: Explainer;
  private items: Explainer[] = [];

  // 构造函数，进行编译
  constructor(input: any[], scope?: string) {
    // 明确指定挑选 scope
    if (
      input.length === 2 &&
      _.isString(input[0]) &&
      input[0].startsWith(':scope=')
    ) {
      this.scope = buildExplainer(input[0].substring(6).trim());
      this.mapper = buildExplainer(input[1]);
    }
    // 默认的 scope，就是在 map 里直接指定一个1元素的对象数组
    else if (scope && input.length === 1 && _.isPlainObject(input[0])) {
      this.scope = buildExplainer(scope);
      this.mapper = buildExplainer(input[0]);
    }
    // 自由挑选数组元素
    else {
      let items: Explainer[] = [];
      for (let obj of input) {
        let it = buildExplainer(obj);
        items.push(it);
      }
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
