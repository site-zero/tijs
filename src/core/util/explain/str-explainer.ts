import _ from 'lodash';
import {
  ExplainOptions,
  Explainer,
  Str,
  Util,
  Vars,
  invoke_partial,
} from '../../ti';
import { Context } from 'typedoc';

type ValueGetter = (context: Vars, options: ExplainOptions) => any;
type MakeValueGetter = (val: string, getDft: ValueGetter) => ValueGetter;

// 静态值：任何
function __static_val(val: any): ValueGetter {
  //let v = Str.toJsValue(val);
  return () => val;
}

// 静态值：布尔
function __static_bool(val: any, not: boolean = false): ValueGetter {
  let v = Str.toJsValue(val);
  let b = v ? true : false;
  if (not) {
    b = !b;
  }
  return () => b;
}

// 自动取值: 任何值
function __get_val(
  path: string,
  { getDft, autoJsValue } = {} as { getDft: ValueGetter; autoJsValue?: boolean }
): ValueGetter {
  return (context, options) => {
    let v = _.get(context, path);
    if (_.isNil(v)) {
      return getDft(context, options);
    }
    if (autoJsValue) {
      v = Str.toJsValue(v);
    }
    return v;
  };
}

// 自动取值: 布尔值
function __get_bool(
  path: string,
  { getDft, not = false } = {} as { getDft: ValueGetter; not?: boolean }
): ValueGetter {
  return (context, options) => {
    let b = _.get(context, path);
    if (_.isNil(b)) {
      b = getDft(context, options);
    }
    if (not) {
      return b ? false : true;
    }
    return b ? true : false;
  };
}

// 函数
function __get_func(path: string, partial: invoke_partial) {
  return (context: Vars, options: ExplainOptions) => {
    let func = _.get(options.funcSet || globalThis, path);
    if (!_.isFunction(func)) {
      func = Util.genInvoking(path, {
        context,
        partial,
        dft: () => path,
      });
    }
    return func;
  };
}

// 获取调用结果
function __get_call(path: string, partial: invoke_partial) {
  return (context: Vars, options: ExplainOptions) => {
    let func = _.get(options.funcSet || globalThis, path);
    if (!_.isFunction(func)) {
      func = Util.genInvoking(path, {
        context,
        partial,
        funcSet: options.funcSet,
        dft: () => path,
      });
    }
    return func();
  };
}

// 模板
function __get_tmpl(str: string) {
  return (context: Vars, _options: ExplainOptions) => {
    return Str.renderTmpl(str, context);
  };
}

type MakerMap = {
  [k: string]: MakeValueGetter;
};

const _makers: MakerMap = {
  //
  // 函数
  //
  '==>': (val) => __get_func(val, 'left'),
  '==>?': (val) => __get_func(val, 'left?'),
  '==>>': (val) => __get_func(val, 'right'),
  '==>>?': (val) => __get_func(val, 'right?'),
  //
  // 赋值
  //
  '==': (val, getDft) => __get_bool(val, { getDft }),
  '!=': (val, getDft) => __get_bool(val, { getDft, not: true }),
  '=': (val, getDft) => __get_val(val, { getDft, autoJsValue: true }),
  //
  // 直接调用
  //
  '=>': (val) => __get_call(val, 'left'),
  '=>?': (val) => __get_call(val, 'left?'),
  '=>>': (val) => __get_call(val, 'right'),
  '=>>?': (val) => __get_call(val, 'right?'),
  //
  // 渲染模板
  //
  '->': (val) => __get_tmpl(val),
};

export class StringExplainer implements Explainer {
  // 解析后的处理函数
  private _func: ValueGetter = (v) => v;

  // 构造函数，进行编译
  constructor(input: string) {
    this.valueOf(input);
  }

  valueOf(input: string): void {
    //console.log('StringExplainer.valueOf', input);
    //
    // 逃逸
    //
    let m = /^:(:*(=|==|!=|=>>?|->)(.*))$/.exec(input);
    if (m) {
      this._func = __static_val(m[1]);
      return;
    }

    //
    // 首先分析输入字符串
    //
    let m_type: string | undefined;
    let m_val: string | undefined;
    let func = __static_val(input);
    // Match template or function call
    m = /^(==?>>?\??|->)(.*)$/.exec(input);
    if (m) {
      m_type = m[1];
      m_val = _.trim(m[2]);
    }
    // Find key in context
    else {
      m = /^(==?|!=)([^?]+)(\?(.*))?$/.exec(input);
      if (m) {
        m_type = m[1];
        m_val = _.trim(m[2]);

        // support dynamic default getter
        let m_dft = _.trim(m[4]);
        let _get_dft: ValueGetter;
        if (/^=/.test(m_dft)) {
          let s = m_dft.substring(1).trim();
          _get_dft = __get_val(s, { getDft: () => s, autoJsValue: true });
        } else {
          _get_dft = __static_val(m_dft);
        }

        // starts with "!=" or "==" auto covert to Boolean
        if ('==' == m_type) {
          func = __static_bool(m_dft);
        }
        // starts with "!=" or "==" auto covert to Boolean
        else if ('!=' == m_type) {
          func = __static_bool(m_dft, true);
        }
        // whole context  "=.."
        else if ('..' == m_val) {
          func = (context) => {
            return _.cloneDeep(context);
          };
        }
        // Others, must starts with "=" auto covert to JS value
        else {
          func = __get_val(m_val, { getDft: _get_dft, autoJsValue: true });
        }
      }
    }

    //
    // 获取处理器
    //
    this._func = func;

    // 看看是否找到特殊处理器
    if (m_val) {
      let _maker = m_type ? _makers[m_type] : undefined;
      if (_maker) {
        this._func = _maker(m_val, func);
      }
    }
  }

  // 执行渲染
  explain(context: Vars, options: ExplainOptions): any {
    return this._func(context, options);
  }
}
