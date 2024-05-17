import _ from 'lodash';
import { Vars, ExplainOptions, Explainer, Invoke } from '../ti';
import { StringExplainer } from './explain/str-explainer';
import { FuncExplainer } from './explain/func-explainer';
import { ArrayExplainer } from './explain/array-explainer';
import { MapExplainer } from './explain/map-explainer';
import { RawExplainer } from './explain/raw-explainer';
import { InvokeExplainer } from './explain/invoke-explainer';

export function buildExplainer(obj: any): Explainer {
  if (_.isString(obj)) {
    return new StringExplainer(obj);
  }

  if (_.isFunction(obj)) {
    return new FuncExplainer(obj);
  }

  if (_.isArray(obj)) {
    return new ArrayExplainer(obj);
  }

  if (_.isObject(obj)) {
    // 采用对象形式声明的调用
    let it = obj as any;
    if (it.name) {
      if (it.__invoke) {
        let invoke = it as Invoke;
        return new InvokeExplainer(invoke, false);
      }

      if (it.__function) {
        let invoke = it as Invoke;
        return new InvokeExplainer(invoke, true);
      }
    }

    // 输出一个对象
    return new MapExplainer(obj);
  }

  return new RawExplainer(obj);
}

export function explainObj<T>(
  context: Vars,
  obj: T,
  options = {} as ExplainOptions
): T {
  // 指定默认值
  _.defaults(options, {
    funcSet: globalThis,
    evalFunc: true,
    iteratee: (v: any) => v,
  });

  // 预编译
  let exp = buildExplainer(obj);

  // 执行渲染
  let re = exp.explain(context, options);
  if (options.iteratee) {
    re = options.iteratee(re);
  }
  return re;
}
