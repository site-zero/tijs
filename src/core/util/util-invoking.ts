import _ from 'lodash';
import { Invoke, InvokeOptions, Str } from '../ti';

/**
 * 根据一个调用语句，返回一个包裹的函数调用
 *
 * @param str 调用语句
 * @param options  选项，详情参见 `InvokingOptions`
 * @returns 函数调用
 * @see InvokeOptions
 */
export function genInvoking(
  str: string | Function,
  options: InvokeOptions,
): Function {
  // 传入函数就直接返回了
  if (_.isFunction(str)) {
    return str as Function;
  }

  let invoke = parseInvoking(str as string);
  return genInvokingBy(invoke, options);
}

export function genInvokingBy(
  invoke: Invoke,
  options: InvokeOptions,
): Function {
  // 分析选项
  let {
    that,
    context = {},
    args = [],
    funcSet = globalThis,
    partial = 'left',
    dft,
  } = options;

  // 确保有默认值
  dft =
    dft ??
    function () {
      let is = JSON.stringify(invoke);
      throw `Fail to found Invoke: ${is}`;
    };

  let callPath = invoke.name;
  let callArgs = invoke.args;
  partial = invoke.partial ?? partial;

  // 采用传入的参数
  if (!_.isEmpty(args)) {
    callArgs = args;
  }

  // 获取函数对象
  let func = _.get(funcSet, callPath);

  // 防守
  if (!_.isFunction(func)) {
    return dft;
  }

  let invokeArgs = _.map(callArgs, (v) => {
    if (_.isString(v) || _.isArray(v)) return Str.toJsValue(v, { context });
    return v;
  });

  // 没有参数，不用包裹函数
  if (_.isEmpty(invokeArgs)) {
    return func;
  }

  that = that ?? context;

  let re = {
    // [ ? --> ... ]
    'right': function (...input: any[]) {
      // 这里不能像 right? 一样忽略 undefined,
      // 因为 Ti.Types.toBoolStr， 一般用作表格的布尔字段显示
      // 而有的字段，布尔值是 undefined 的
      let ins = input;
      let as = _.concat([], ins, invokeArgs);
      return func.apply(that, as);
    },
    // [ ? --> ... ] 同时去掉参数里的 undefined
    'right?': function (...input: any[]) {
      let ins = _.without(input, undefined);
      let as = _.concat([], ins, invokeArgs);
      return func.apply(that, as);
    },
    // [ ... <-- ?]
    'left': function (...input: any[]) {
      let ins = input;
      let as = _.concat([], invokeArgs, ins);
      return func.apply(that, as);
    },
    // [ ... <-- ?]
    'left?': function (...input: any[]) {
      let ins = _.without(input, undefined);
      let as = _.concat([], invokeArgs, ins);
      return func.apply(that, as);
    },
  }[partial];

  if (_.isFunction(re)) {
    return re;
  }

  // 默认返回
  return function () {
    return func.apply(that, invokeArgs);
  };
}

export function parseInvoking(str: string | Invoke): Invoke {
  // Object mode
  if (_.isObject(str)) {
    return str;
  }

  let ivk = {
    name: '',
    args: [],
  } as Invoke;
  let m = /^([^()]+)(\((.+)\))?$/.exec(str);
  if (m) {
    ivk.name = _.trim(m[1]);
    let s_args = _.trim(m[3]);
    ivk.args = Str.joinArgs(s_args, [], (v: any) => v);
  }

  return ivk;
}
