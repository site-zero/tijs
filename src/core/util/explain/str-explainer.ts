import _ from "lodash";
import {
  ExplainOptions,
  Explainer,
  S,
  Util,
  Vars,
  invoke_partial
} from "../../ti";

type ReType = { (context: Vars, options: ExplainOptions): any };
type MakeReType = {
  (val: string, getDft: ReType): ReType;
};

// 静态值：任何
function __static_val(val: any): ReType {
  let v = S.toJsValue(val);
  return () => v;
}

// 静态值：布尔
function __static_bool(val: any, not: boolean = false): ReType {
  let v = S.toJsValue(val);
  let b = v ? true : false;
  if (not) {
    b = !b;
  }
  return () => b;
}

// 自动取值: 任何值
interface Get_Val {
  (path: string, options: { getDft: ReType; autoJsValue: boolean }): ReType;
}
const __get_val: Get_Val = (path, { getDft, autoJsValue }) => {
  return (context, options) => {
    let v = _.get(context, path);
    if (_.isNil(v)) {
      return getDft(context, options);
    }
    if (autoJsValue) {
      v = S.toJsValue(v);
    }
    return v;
  };
};

// 自动取值: 布尔值
interface Get_Bool {
  (path: string, options: { getDft: ReType; not?: boolean }): ReType;
}
const __get_bool: Get_Bool = (path, { getDft, not = false }) => {
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
};

// 函数
function __get_func(path: string, partial: invoke_partial) {
  return (context: Vars, options: ExplainOptions) => {
    let func = _.get(options.funcSet || globalThis, path);
    if (!_.isFunction(func)) {
      func = Util.genInvoking(path, {
        context,
        partial,
        dft: () => path
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
        dft: () => path
      });
    }
    return func();
  };
}

// 模板
function __get_tmpl(str: string) {
  return (context: Vars, _options: ExplainOptions) => {
    return S.renderTmpl(str, context);
  };
}

type MakerMap = {
  [k: string]: MakeReType;
};

const _makers: MakerMap = {
  //
  // 函数
  //
  "==>": (val) => __get_func(val, "left"),
  "==>?": (val) => __get_func(val, "left?"),
  "==>>": (val) => __get_func(val, "right"),
  "==>>?": (val) => __get_func(val, "right?"),
  //
  // 赋值
  //
  "==": (val, getDft) => __get_bool(val, { getDft }),
  "!=": (val, getDft) => __get_bool(val, { getDft, not: true }),
  "=": (val, getDft) => __get_val(val, { getDft, autoJsValue: true }),
  //
  // 直接调用
  //
  "=>": (val) => __get_call(val, "left"),
  "=>?": (val) => __get_call(val, "left?"),
  "=>>": (val) => __get_call(val, "right"),
  "=>>?": (val) => __get_call(val, "right?"),
  //
  // 渲染模板
  //
  "->": (val) => __get_tmpl(val)
};

export class StringExplainer implements Explainer {
  // 解析后的处理函数
  private _func: ReType = (v) => v;

  // 构造函数，进行编译
  constructor(input: string) {
    this.valueOf(input);
  }

  valueOf(input: string): void {
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
    let the_dft = __static_val(input);
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
        let m_dft = m[4];
        // starts with "=" auto covert to JS value
        if (/^=/.test(m_dft)) {
          let s = m_dft.substring(1).trim();
          the_dft = __get_val(s, { getDft: the_dft, autoJsValue: true });
        }
        // starts with "!=" or "==" auto covert to Boolean
        else if ("==" == m_type) {
          the_dft = __static_bool(m_dft);
        }
        // starts with "!=" or "==" auto covert to Boolean
        else if ("!=" == m_type) {
          the_dft = __static_bool(m_dft, true);
        }
        // Others, just trim the value
        else if (m_dft) {
          m_dft = _.trim(m_dft);
          the_dft = __static_val(m_dft);
        }
      }
    }

    //
    // 获取处理器
    //
    this._func = the_dft;

    // 看看是否找到特殊处理器
    if (m_val) {
      let _maker = m_type ? _makers[m_type] : undefined;
      if (_maker) {
        this._func = _maker(m_val, the_dft);
      }
    }
  }

  // 执行渲染
  explain(context: Vars, options: ExplainOptions): any {
    return this._func(context, options);
  }
}
