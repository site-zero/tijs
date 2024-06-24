import { ExplainOptions, Explainer, Vars } from '../../../_type';

export class FuncExplainer implements Explainer {
  // 解析后的处理函数
  private _func: Function;

  // 构造函数，进行编译
  constructor(input: Function) {
    this._func = input;
  }

  // 执行渲染
  explain(context: Vars, options: ExplainOptions): any {
    if (options.evalFunc) {
      return this._func(context, options);
    }
    return this._func;
  }
}
