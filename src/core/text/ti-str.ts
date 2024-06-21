import JSON5 from 'json5';
import _ from 'lodash';
import * as DateTime from '../_top/ti-datetime';
import {
  StrCaseFunc,
  StrCaseMode,
  StrConvertor,
  Tmpl,
  ToJsValueOptions,
  Util,
  Vars,
} from '../ti';

/*---------------------------------------------------

                字符串渲染输出

---------------------------------------------------*/
export function renderTmpl(tmpl: string, vars: Vars): string {
  return Tmpl.exec(tmpl, vars);
}

/*---------------------------------------------------

                空值判断

---------------------------------------------------*/
/**
 * 判断字符串时否是空白字符串，包括 空格符、换页符，换行符、行结束符、缩进符tab、垂直换行符
 *
 * @param str : 输入字符串
 * @returns true/false 是否是空白字符
 */
export function isBlank(str: string): boolean {
  if (_.isNumber(str) || _.isBoolean(str)) {
    return false;
  }
  if (_.isString(str)) {
    return !str || /^\s*$/.test(str);
  }
  return str ? false : true;
}

/**
 * 如果 `str` 不是空白字符串，则返回自己，否则返回默认字符串 `dft`
 *
 * @param str : 输入字符串
 * @param dft : 默认字符串
 * @returns string
 */
export function sBlank(str: string, dft: string): string {
  if (isBlank(str)) return dft;
  return str;
}

/*---------------------------------------------------

                拆分字符串

---------------------------------------------------*/
/**
 * @param input : 输入字符串
 * @param sep : 分隔符
 * @returns 一个字符串数组，去掉空白字符串，去除字符串前后的空白字符。
 */
export function splitIgnoreBlank(
  input: string,
  sep: string | RegExp = ','
): string[] {
  if (!input) {
    return [];
  }
  let list = input.split(sep);
  let l2 = _.filter(list, (li) => !isBlank(li));
  return _.map(l2, (li) => _.trim(li));
}

export type SplitOptions = {
  quote?: string;
  escapeChar?: string;
  ignoreBlank?: boolean;
  keepQuote?: boolean;
  seps?: string;
};
export function splitQuote(str: string, options: SplitOptions = {}): string[] {
  // 分析参数
  let qucs = options.quote || `"'`;
  let spcs = options.seps || ',;、，； \t\r\n';
  let escapeChar = options.escapeChar || '\\';
  let ignoreBlank = options.ignoreBlank ?? false;
  let keepQuote = options.keepQuote ?? true;

  // 准备返回
  let list = [] as string[];

  // 解析的中间状态变量
  let cs = str.split('');
  let sb = [] as string[];
  let quoteBy: string | undefined;

  // 开始循环
  for (let i = 0; i < cs.length; i++) {
    let c = cs[i];
    // 引用外，且遇到分隔符号就拆分
    if (!quoteBy && spcs.indexOf(c) >= 0) {
      if (!ignoreBlank || !_.isEmpty(sb)) {
        let s2 = sb.join('');
        if (ignoreBlank) {
          s2 = _.trim(s2);
          if (s2) {
            list.push(s2);
          }
        } else {
          list.push(s2);
        }
        sb = [];
      }
      continue;
    }
    // 在引用里
    if (quoteBy) {
      // 逃逸字符
      if (escapeChar == c) {
        sb.push(c);
        if (i < cs.length) {
          c = cs[++i];
          sb.push(c);
        }
        continue;
      }
      // 结束引用
      if (quoteBy == c) {
        if (keepQuote) {
          sb.push(c);
        }
        quoteBy = undefined;
        continue;
      }
      // 那么就是引用咯
      sb.push(c);
      continue;
    }
    // 开始引用
    if (qucs.indexOf(c) >= 0) {
      // 开始引用
      quoteBy = c;
      if (keepQuote) {
        sb.push(c);
      }
    }
    // 其他，计入
    else {
      sb.push(c);
    }
  }

  // 添加最后一个
  if (!ignoreBlank || !_.isEmpty(sb)) {
    list.push(sb.join(''));
  }

  // 搞定
  return list;
}

/*---------------------------------------------------

                JS值的自动转换

---------------------------------------------------*/
export function toJsValue(v: any = '', options = {} as ToJsValueOptions): any {
  //...............................................
  // Array
  if (_.isArray(v)) {
    let re = [];
    for (let it of v) {
      let v2 = toJsValue(it, options);
      re.push(v2);
    }
    return re;
  }
  //...............................................
  // Object
  if (_.isPlainObject(v)) {
    let re = {} as { [k: string]: any };
    _.forEach(v, (it, key) => {
      let v2 = toJsValue(it, options);
      re[key] = v2;
    });
    return re;
  }

  let {
    autoJson = true,
    autoDate = false,
    autoNil = false,
    autoMap = true,
    autoNum = true,
    autoBool = true,
    autoVar = true,
    autoDefault = true,
    trimed = true,
    context = {},
  } = options || {};
  //...............................................
  // Number
  // Boolean
  // Nil
  if (_.isNil(v) || _.isBoolean(v) || _.isNumber(v)) {
    return v;
  }
  //...............................................
  // Map
  if (v instanceof Map) {
    if (autoMap) {
      return Util.mapToObj(v);
    }
    return v;
  }

  //...............................................
  // Must by string
  let str = trimed ? _.trim(v) : v;
  let dftAsNil = false;
  if (autoDefault) {
    if (str.endsWith('?')) {
      dftAsNil = true;
      str = str.substring(0, str.length - 1).trim();
    }
  }
  //...............................................
  // autoNil
  if (autoNil) {
    if ('undefined' == str) return undefined;
    if ('null' == str) return null;
  }
  //...............................................
  // The whole context
  if ('..' == str) {
    return context;
  }
  //...............................................
  // Number
  if (autoNum && /^-?\d*\.?\d+$/.test(str)) {
    let n = str * 1;
    if (n == str) {
      return n;
    }
    return str;
  }
  //...............................................
  // Try to get from context
  if (autoVar) {
    let re = _.get(context, str);
    if (!_.isUndefined(re) || dftAsNil) {
      return re;
    }
  }
  //...............................................
  // Boolean
  if (autoBool && /^(true|false|yes|no|on|off)$/.test(str)) {
    return /^(true|yes|on)$/.test(str);
  }
  //...............................................
  // JS String
  let m = /^'([^']*)'$/.exec(str);
  if (m) {
    return m[1];
  }
  //...............................................
  // try JSON
  if (autoJson) {
    try {
      return JSON5.parse(v);
    } catch (err) {}
  }
  //...............................................
  // try Date
  if (autoDate) {
    try {
      return DateTime.parse(v);
    } catch (E) {}
  }
  // Then, it is a string
  return str;
}

/***
 * Join "a,b,c" like string to arguments
 */
export function joinArgs(
  s: string | any[],
  args: any[] = [],
  iteratee = toJsValue
) {
  // String to split
  if (_.isString(s)) {
    // Maybe a json object
    // if (/^\{.*\}$/.test(s)) {
    //   try {
    //     return [eval(`(${s})`)];
    //   } catch (E) {}
    // }

    // Take it as comma-sep list
    let list = s.split(',');
    for (let li of list) {
      let vs = _.trim(li);
      if (!vs) continue;
      let v = iteratee(vs);
      args.push(v);
    }
    return args;
  }
  // Array
  else if (_.isArray(s)) {
    for (let v of s) {
      let v2 = iteratee(v);
      args.push(v2);
    }
  }
  // Others
  else if (!_.isUndefined(s)) {
    args.push(s);
  }
  return args;
}

export function anyToStr(input: any): string {
  if (_.isNil(input)) {
    return '';
  }

  if (_.isString(input)) {
    return input;
  }

  if (_.isArray(input)) {
    let ss = _.map(input, (it) => anyToStr(it));
    return ss.join(',');
  }

  if (_.isError(input)) {
    return [input.name, input.message].join(': ');
  }

  if (_.isObject(input)) {
    return JSON.stringify(input);
  }

  return input + '';
}

export function anyToStrOrNum(val: any): string | number {
  if (_.isNumber(val)) {
    return val as number;
  }
  return anyToStr(val);
}
/*---------------------------------------------------

                中文大写数字

---------------------------------------------------*/
export function intToChineseNumber(
  input: string | number,
  capitalized = false
) {
  // 预处理，兼容字符串
  let n: number;
  if (_.isString(input)) {
    n = parseInt(input);
  } else {
    n = input as number;
  }
  // 中文大写
  if (capitalized) {
    return _to_chinese_number(n, {
      CN_NC0: '零壹贰叁肆伍陆柒捌玖',
      CN_NU0: '个拾佰仟万亿',
    });
  }
  // 中文数字
  return _to_chinese_number(n, {
    CN_NC0: '零一二三四五六七八九',
    CN_NU0: '个十百千万亿',
  });
}
type CN_DICT = { CN_NC0: string; CN_NU0: string };
function _to_chinese_number(input: number, { CN_NC0, CN_NU0 }: CN_DICT) {
  // 优化零
  if (input == 0) {
    return CN_NC0[0];
  }

  let re: string[] = [];

  // 考虑负数
  if (input < 0) {
    re.push('负');
    input *= -1;
  }

  // 直接就是个位数
  if (input < 10) {
    let c = CN_NC0[input];
    re.push(c);
    return re.join('');
  }

  // 准备拆分各个位，数组 0 表示个位
  //let ns = new int[10];
  let ns = [];
  let len = 0;

  // 挨个来
  let n = input;
  while (n > 0) {
    let nd = Math.floor(n / 10);
    ns[len++] = n - nd * 10;
    n = nd;
  }
  let lastNSIndex = len - 1;
  // 现在我们有一个数字数组
  // [2][3][0][9] ...
  // 个 十 百 千 ...
  let lastN;
  let maxI;
  let lastI;
  //
  // 分作三段输出
  //
  // ................................
  // 亿位段
  if (len > 8) {
    maxI = Math.min(lastNSIndex, 11);
    lastN = -1;
    for (let i = maxI; i >= 8; i--) {
      n = ns[i];
      // 不能输出零零
      if (n == 0 && lastN <= 0) {
        continue;
      }
      let s_n = CN_NC0[n];
      re.push(s_n);
      // 单位
      if (i > 8 && (n > 0 || lastN > 0)) {
        let s_u = CN_NU0[i - 8];
        re.push(s_u);
      }
      // 记录最后一次输出的数字
      lastN = n;
    }
    // 检查，最后一个字符是 '零' 改成 '亿'
    // 否则加个 '亿'
    lastI = re.length - 1;
    if (re[lastI] == CN_NC0[0]) {
      re[lastI] = CN_NU0[5];
    } else {
      re.push(CN_NU0[5]);
    }
  }
  // ................................
  // 万位段
  if (len > 4) {
    maxI = Math.min(lastNSIndex, 7);
    lastN = -1;
    for (let i = maxI; i >= 4; i--) {
      n = ns[i];
      // 不能输出零零
      if (n == 0 && lastN <= 0) {
        continue;
      }
      let s_n = CN_NC0[n];
      re.push(s_n);
      // 单位
      if (i > 4 && (n > 0 || lastN > 0)) {
        let s_u = CN_NU0[i - 4];
        re.push(s_u);
      }
      // 记录最后一次输出的数字
      lastN = n;
    }
    // 检查，最后一个字符是 '零' 改成 '万'
    // 否则加个 '万'
    if (lastN >= 0) {
      lastI = re.length - 1;
      if (re[lastI] == CN_NC0[0]) {
        re[lastI] = CN_NU0[4];
      } else {
        re.push(CN_NU0[4]);
      }
    }
  }

  // ................................
  // 个位段
  maxI = Math.min(lastNSIndex, 3);
  lastN = -1;
  for (let i = maxI; i >= 0; i--) {
    n = ns[i];
    // 不能输出零零
    if (n == 0 && lastN == 0) {
      continue;
    }
    let s_n = CN_NC0[n];
    // 十一 至 十九
    if (i != 1 || n != 1 || maxI > 1) {
      re.push(s_n);
    }
    // 单位
    if (i > 0 && n > 0) {
      let s_u = CN_NU0[i];
      re.push(s_u);
    }
    // 记录最后一次输出的数字
    lastN = n;
  }

  // 输出前，检查，最后一个字符是 '零' 删掉它
  lastI = re.length - 1;
  if (re[lastI] == CN_NC0[0]) {
    return re.slice(0, lastI).join('');
  }

  return re.join('');
}

/*---------------------------------------------------

                大小写转换

---------------------------------------------------*/

const STR_CASE_FUNC = {
  upper: (s: string) => (s ? s.toUpperCase() : s),
  lower: (s: string) => (s ? s.toLowerCase() : s),
  camel: (s: string) => _.camelCase(s),
  snake: (s: string) => _.snakeCase(s),
  kebab: (s: string) => _.kebabCase(s),
  start: (s: string) => _.startCase(s),
  raw: (s: string) => s,
} as StrCaseFunc;

export function toStdComType(comType: string) {
  return _.upperFirst(_.camelCase(comType));
}

export function getCaseFunc(mode: StrCaseMode): StrConvertor {
  return STR_CASE_FUNC[mode];
}

/**
 *
 * 将给定的字符串 `str` 转为特定的格式，支持的模式请参考`mode`的注释。
 *
 * @param str - 输入的字符串
 * @param mode - 转换格式
 *  - `"upper"` : 大写格式
 *  - `"lower"` : 小写格式
 *  - `"camel"` : 驼峰格式
 *  - `"snake"` : 下划线连接格式
 *  - `"kebab"` : 短横线连接格式
 *  - `"start"` : 每个单词的首字母都大写的格式
 *  - `null`  : 保持原样
 * @returns 格式转换后的字符串
 */
export function toCase(str: string, mode?: StrCaseMode | null): string {
  // Guard
  if (!str || !mode) {
    return str;
  }

  // Find mode
  let fn = getCaseFunc(mode);
  return fn(str);

  // if (_.isFunction(fn)) {
  //   return fn(str);
  // }

  //throw `Invalid toCase.mode '${mode}'`;
}
/**
 * 将控件名称格式为统一的首字母大写的驼峰格式
 *
 * @param comType - 控件类型名称，是一个字符串，可以是`camel|snake|kbab`
 * @returns 会自动将控件名称变成首字母大写的驼峰
 */
export function toComType(comType: string): string {
  return _.upperFirst(_.camelCase(comType));
}

// export function isValidCase(mode: string): boolean {
//   return _.isFunction(getCaseFunc(mode));
// }

/**
 * 去除输入内容中属性值的危险字符。
 *
 * @param data{Array|Object|Any} : 输入的内容
 * @param regex{RegExp} : 要去除的字符的正则表达式
 *
 */
export function safeDeep(data: any, regex = /['"]/g): any {
  // String to replace
  if (_.isString(data)) {
    return data.replace(regex, '');
  }
  // Array
  else if (_.isArray(data)) {
    return _.map(data, (v) => safeDeep(v, regex));
  }
  // Object
  else if (_.isPlainObject(data)) {
    return _.mapValues(data, (v) => safeDeep(v, regex));
  }
  // Others return
  return data;
}

/**
 * 使用分隔符拼接参数
 * @param sep : 拼接符
 * @param args : 要拼接的参数
 *
 * @returns 拼接后的字符串
 */
export function joinWithoutNil(sep: string = '', ...args: any): string {
  let list2 = _.flattenDeep(args);
  let list3 = _.filter(list2, (li) => !_.isNil(li));
  return list3.join(sep);
}

interface JoinIteratee<T> {
  (value: T, index: number, collection: T[]): T;
}

/**
 * 迭代数组元素，拼接字符串
 *
 * @param list : 要迭代的数组列表
 * @param sep : 拼接符
 * @param iteratee : 迭代函数
 * @returns 拼接后的字符串
 */
export function join(
  list: any[] = [],
  sep: string = '',
  iteratee: JoinIteratee<any> | null
): string {
  let list1 = _.flattenDeep(list);
  let list2;
  if (_.isFunction(iteratee)) {
    list2 = _.map(list1, iteratee);
  } else {
    list2 = list1;
  }
  return list2.join(sep);
}

/**
 * 遍历数组元素(去除 null/udefined)，取出key的对应值，拼接字符串。
 *
 * @param list :  要遍历的数组
 * @param sep :   拼接符
 * @param key :   元素的属性
 * @returns 拼接后的字符串
 */
export function joinAs(
  list: any[] = [],
  sep: string = '',
  key: string | null = null
): string {
  let iter: JoinIteratee<any> | null = null;
  if (!_.isEmpty(key)) {
    iter = (li) => {
      if (_.isPlainObject(li)) return _.get(li, key!);
      return key;
    };
  }
  return join(list, sep, iter);
}

/**
 * @param s :  要转为数组的字符串
 * @param sep : 分隔符 或 正则表达式
 * @param ignoreNil : 是否忽略空白字符串
 * @returns 拆分过滤后的数组
 */
export function toArray(
  s: any,
  { sep = /[:,;\t\n\/]+/g, ignoreNil = true } = {} as {
    sep?: RegExp | string;
    ignoreNil?: boolean;
  }
): any[] {
  // Nil
  if (_.isNil(s)) {
    return [];
  }
  // Array
  if (_.isArray(s)) {
    return s;
  }

  // String to split
  if (_.isString(s) && sep) {
    let ss = _.map(s.split(sep), (v) => _.trim(v));
    if (ignoreNil) {
      return _.without(ss, '');
    }
    return ss;
  }
  // Others -> wrap
  return [s];
}

/**
 *
 * @param s : 要转为数组的字符串
 * @param sep : 分隔符，默认是 `,`
 * @returns 过滤空白字符串之后的数组
 */
export function toArrayBy(s: any, sep: string = ',') {
  return toArray(s, { sep, ignoreNil: true });
}

/**
 * Translate "XXX:A:im-pizza" or ["XXX","A","im-pizza"]
 *
 * ```
 * {text:"XXX",value:"A",icon:"im-pizza"}
 * ```
 * @param s
 * @param param1
 * @returns
 */
export function toObject(
  s: string,
  {
    sep = /[:,;\t\n\/]+/g,
    ignoreNil = true,
    keys = ['value', 'text?value', 'icon'],
  } = {} as {
    sep?: RegExp | string;
    ignoreNil?: boolean;
    keys?: string[] | string;
  }
) {
  // Split value to array
  let vs = toArray(s, { sep, ignoreNil });

  // Make sure keys as array
  if (_.isString(keys)) {
    keys = toArray(keys, {
      sep: /[:,;\s]+/g,
    });
  }

  // Analyze the keys
  let a_ks: string[] = []; // assign key list
  let m_ks: any[] = []; // those keys must has value
  _.forEach(keys, (k) => {
    let ss = toArray(k, { sep: '?' });
    if (ss.length > 1) {
      a_ks.push(ss[0]);
      m_ks.push({
        name: ss[0],
        backup: ss[1],
      });
    } else {
      a_ks.push(k);
    }
  });

  // translate
  let re: { [k: string]: string } = {};
  _.forEach(a_ks, (k, i) => {
    let v = _.nth(vs, i);
    if (_.isUndefined(v) && ignoreNil) {
      return;
    }
    re[k] = v;
  });
  // Assign default
  for (let mk of m_ks) {
    if (_.isUndefined(re[mk.name])) {
      re[mk.name] = re[mk.backup];
    }
  }

  // done
  return re;
}

/**
 *
 * @param s
 * @param param1
 */
export function toObjList(
  s: string,
  {
    sepLine = /[,;\n]+/g,
    sepPair = /[:|\/\t]+/g,
    ignoreNil = true,
    keys = ['value', 'text?value', 'icon'],
  } = {} as {
    sepLine?: RegExp | string;
    sepPair?: RegExp | string;
    ignoreNil?: boolean;
    keys?: string[] | string;
  }
): any[] {
  // console.log(s, sepLine, sepPair, ignoreNil, keys);
  let list = toArray(s, { sep: sepLine, ignoreNil });
  return _.map(list, (v) =>
    toObject(v, {
      sep: sepPair,
      ignoreNil,
      keys,
    })
  );
}

/**
 * @param str{string} : Base64 input string
 * @returns Unit8Array
 */
export function base64ToU8Bytes(str: string): Uint8Array {
  let arr: number[] = [];
  for (let i = 0; i < str.length; i++) {
    let c = str.charCodeAt(i);
    if (c >= 0x010000 && c <= 0x10ffff) {
      arr.push(((c >> 18) & 0x07) | 0xf0);
      arr.push(((c >> 12) & 0x3f) | 0x80);
      arr.push(((c >> 6) & 0x3f) | 0x80);
      arr.push((c & 0x3f) | 0x80);
    } else if (c >= 0x000800 && c <= 0x00ffff) {
      arr.push(((c >> 12) & 0x0f) | 0xe0);
      arr.push(((c >> 6) & 0x3f) | 0x80);
      arr.push((c & 0x3f) | 0x80);
    } else if (c >= 0x000080 && c <= 0x0007ff) {
      arr.push(((c >> 6) & 0x1f) | 0xc0);
      arr.push((c & 0x3f) | 0x80);
    } else {
      arr.push(c & 0xff);
    }
  }
  return new Uint8Array(arr);
}

/**
 * Get the display text for bytes
 */
export function sizeText(
  byte = 0,
  {
    fixed = 2,
    M = 1024,
    bytes = false,
    units = ['Bytes', 'KB', 'MB', 'GB', 'PB', 'TB'],
  } = {} as {
    fixed?: number;
    M?: number;
    bytes: boolean;
    units: string[];
  }
) {
  let nb = byte;
  let i = 0;
  for (; i < units.length; i++) {
    let nb2 = nb / M;
    if (nb2 < 1) {
      break;
    }
    nb = nb2;
  }
  let unit = units[i];
  let re;
  if (nb == Math.trunc(nb)) {
    re = nb + unit;
  } else {
    re = nb.toFixed(fixed) + unit;
  }

  if (bytes && i > 0) {
    return re + ` (${byte} bytes)`;
  }
  return re;
}

/**
 * Get the display percent text for a float number
 * @param n : Float number
 * @param fixed : fixed float position
 * @param auto : Auto cut the ending zero '0.34000' => '0.34'
 *
 * @returns percent text
 */
export function toPercent(
  n: number,
  { fixed = 2, auto = true } = {} as {
    fixed?: number;
    auto: boolean;
  }
): string {
  if (!_.isNumber(n)) return 'NaN';
  let nb = n * 100;
  // Round
  let str = fixed >= 0 ? nb.toFixed(fixed) : nb + '';
  if (auto) {
    let lastDot = str.lastIndexOf('.');
    let lastZero = str.lastIndexOf('0');
    if (lastDot >= 0 && lastZero > lastDot) {
      let last = str.length - 1;
      let pos = last;
      for (; pos >= lastDot; pos--) {
        if (str[pos] != '0') break;
      }
      if (pos == lastZero || pos == lastDot) {
        //pos --
      } else {
        pos++;
      }
      if (pos < str.length) str = str.substring(0, pos);
    }
  }
  return str + '%';
}
