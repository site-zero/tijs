import { Util } from '../../';
import {
  ExplainOptions,
  Explainer,
  Invoke,
  InvokeOptions,
  Vars,
} from '../../../_type';

export class InvokeExplainer implements Explainer {
  // 解析后的处理函数
  private _invoke: Invoke;
  private _evalFunc: boolean;

  // 构造函数，进行编译
  constructor(input: Invoke, evalFunc: boolean) {
    this._invoke = input;
    this._evalFunc = evalFunc;
  }

  // 执行渲染
  explain(context: Vars, options: ExplainOptions): any {
    let opt: InvokeOptions = {
      context,
      funcSet: options.funcSet,
      partial: 'left',
      dft: () => {
        throw `Fail to Invoke : ${JSON.stringify(this._invoke)}`;
      },
    };
    let func = Util.genInvokingBy(this._invoke, opt);
    if (this._evalFunc) {
      return func();
    }
    return func;
  }
}
