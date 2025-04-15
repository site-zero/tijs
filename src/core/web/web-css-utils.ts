import _ from 'lodash';
import { Str, Util } from '../';
import {
  CssSheet,
  FuncA2,
  MessageMap,
  Size2D,
  StrCaseMode,
  Vars,
} from '../../_type';
import * as Dom from './web-dom';
import { AttrFilter } from './web-dom';

export function pickGridItemStyle(sty: Vars) {
  return mergeStyles(sty, {
    // - gridColumn: string;
    // - gridColumnStart: string;
    // - gridColumnEnd: string;
    // - gridRow: string;
    // - gridRowStart: string;
    // - gridRowEnd: string;
    // - gridArea: string;
    // - justifySelf: CssItemAlignment;
    // - alignSelf: CssItemAlignment;
    filter: (key, val) => {
      return !_.isNil(val) && /^(grid-.+|(justify|align)-self)$/.test(key);
    },
  });
}
/*-------------------------------------------------------

                   Utility Functions

-------------------------------------------------------*/
/**
 * @param scale : the rate of width/height
 * @param W: width
 * @param H: height
 *
 * @return
 */
export function scaleSize(scale = 1.0, W: number, H: number): Size2D {
  if (H && W) {
    return {
      width: W,
      height: H,
    };
  }
  if (H) {
    return {
      width: scale * H,
      height: H,
    };
  }
  return {
    width: W,
    height: W / scale,
  };
}
//-----------------------------------
export function toPixel(
  input: null | undefined | number | string,
  base = 100,
  dft = 0
) {
  if (_.isNil(input)) {
    return dft;
  }
  // Number may `.23` or `300`
  if (_.isNumber(input)) {
    // Take (-1, 1) as percent
    if (input > -1 && input < 1) {
      return input * base;
    }
    // Fixed value
    return input;
  }
  // String, may `45px` or `43%`
  let opt = {
    base,
    dft,
    remBase: Dom.getRemBase(),
  };
  return toAbsPixel(input, opt);
}
//-----------------------------------
export function toAbsPixel(
  input: number | string,
  { base = 100, dft = 0, remBase = 100, emBase = 14 } = {}
) {
  if (_.isNumber(input)) {
    return input;
  }
  let m = /^(-?[\d.]+)(px|rem|em|%)?$/.exec(input);
  if (m) {
    let v: number = (m[1] as any) * 1;
    let fn = {
      'px': (v: number) => v,
      'rem': (v: number) => v * remBase,
      'em': (v: number) => v * emBase,
      '%': (v: number) => (v * base) / 100,
    }[m[2]];
    if (fn) {
      return fn(v);
    }
    return v;
  }
  // Fallback to default
  return dft;
}
//-----------------------------------
export type ToSizeOptions = {
  autoPercent?: boolean;
  remBase?: number;
};
export function toSize(
  sz: any,
  { autoPercent = false, remBase = 0 } = {} as ToSizeOptions
): string {
  if (_.isNumber(sz) || /^[0-9]+$/.test(sz)) {
    if (0 == sz) return sz;
    if (autoPercent && sz >= -1 && sz <= 1) {
      return sz * 100 + '%';
    }
    if (remBase > 0) {
      return sz / remBase + 'rem';
    }
    return sz + 'px';
  }
  return sz;
}
//-----------------------------------
export function toSize2(sz: any) {
  return toSize(sz, { autoPercent: false });
}
//-----------------------------------
export function toSizeRem100(sz: any, options?: ToSizeOptions) {
  let opt = _.assign({}, options, { remBase: 100 }) as ToSizeOptions;
  return toSize(sz, opt);
}
//-----------------------------------
export function toStyle(obj?: Vars, options?: ToSizeOptions): Vars {
  if (_.isNil(obj)) {
    return {};
  }
  return _.mapValues(obj, (val, key) => {
    let ck = _.kebabCase(key);
    if (/^(opacity|z-index|order)$/.test(ck)) {
      return val;
    }
    return toSize(val, options);
  });
}
//-----------------------------------
export function toStyleRem100(obj: Vars, options?: ToSizeOptions) {
  let opt = _.assign({}, options, { remBase: 100 }) as ToSizeOptions;
  return toStyle(obj, opt);
}
//-----------------------------------
export function toBackgroundUrl(src?: string, base = '') {
  if (!src) return;
  if (base) {
    src = Util.appendPath(base, src);
  }
  return `url("${src}")`;
}
//-----------------------------------
export function toBackgroundUrlBy(src: Vars | string, tmpl?: string) {
  if (!src) return;
  if (tmpl && !_.isString(src)) {
    src = Str.renderTmpl(tmpl, src);
  }
  return `url("${src}")`;
}
//-----------------------------------
export function toNumStyle(obj: Vars) {
  return toStyle(obj);
}
//-----------------------------------
export function mergeClassName(...args: any[]) {
  return mergeClassNameBy({}, ...args);
}
//-----------------------------------
export function mergeClassNameBy(context = {} as Vars, ...args: any[]) {
  let klass = {} as Vars;
  //.................................
  const __join_class = (kla: any) => {
    // Guard
    if (_.isNil(kla)) return;
    // Function
    if (_.isFunction(kla)) {
      let re = kla(context);
      __join_class(re);
    }
    // String
    else if (_.isString(kla)) {
      let ss = _.without(_.split(kla, /\s+/g), '');
      for (let s of ss) {
        klass[s] = true;
      }
    }
    // Array
    else if (_.isArray(kla)) {
      for (let a of kla) {
        __join_class(a);
      }
    }
    // Object
    else if (_.isPlainObject(kla)) {
      _.forEach(kla, (val, key) => {
        if (val) {
          klass[key] = true;
        }
      });
    }
  };
  //.................................
  __join_class(args);
  //.................................
  return klass;
}
//-----------------------------------
export type MergetStyleOptions = {
  caseMode?: StrCaseMode;
  filter?: FuncA2<string, any, boolean>;
};
//-----------------------------------
export function mergeStyles(
  styles: Vars[] | Vars,
  options: MergetStyleOptions = {}
): Vars {
  let styleList: Vars[];
  if (!_.isArray(styles)) {
    styleList = [styles];
  } else {
    styleList = styles;
  }
  let caseMode = options.caseMode || 'kebab';
  let filter = options.filter;
  let re = {} as Vars;
  let fn = Str.getCaseFunc(caseMode);
  for (let style of styleList) {
    _.forEach(style, (v, k) => {
      let name = k.startsWith('--') ? k : fn(k);
      if (!filter || filter(k, v)) {
        re[name] = v;
      }
    });
  }
  return re;
}
//-----------------------------------
export function joinClassNames(...args: any[]) {
  let klass = mergeClassName(...args);
  let names = [] as string[];
  _.forEach(klass, (enabled, key) => {
    if (enabled) {
      names.push(key);
    }
  });
  return names.join(' ');
}
//----------------------------------------------------
export function toCssStyle(input?: null | Vars | string): Vars {
  if (_.isNil(input)) {
    return {};
  }
  if (_.isString(input)) {
    return parseCssRule(input);
  }
  return toStyle(input);
}
//----------------------------------------------------
export function parseCssRule(
  rulesStr: undefined | null | string,
  flt?: AttrFilter
): Vars {
  if (!rulesStr) {
    return {};
  }

  //
  let filter = flt ? Dom.attrFilter(flt) : () => true;

  // 解析CSS规则
  const rules: Record<string, string> = {};

  // 使用状态机处理规则字符串，以正确处理引号内的分号
  let buffer = '';
  let inQuotes = false;
  let quoteChar = '';
  let propertyName = '';

  for (let i = 0; i < rulesStr.length; i++) {
    const char = rulesStr[i];

    // 处理引号
    if (
      (char === '"' || char === "'") &&
      (i === 0 || rulesStr[i - 1] !== '\\')
    ) {
      if (!inQuotes) {
        inQuotes = true;
        quoteChar = char;
      } else if (char === quoteChar) {
        inQuotes = false;
      }
      buffer += char;
      continue;
    }

    // 如果在引号内，继续添加字符
    if (inQuotes) {
      buffer += char;
      continue;
    }

    // 处理分号（规则分隔符）
    if (char === ';') {
      // 处理完整的属性-值对
      const colonIndex = buffer.indexOf(':');
      if (colonIndex !== -1) {
        propertyName = buffer.substring(0, colonIndex).trim();
        const value = buffer.substring(colonIndex + 1).trim();

        // 转换CSS属性名为驼峰命名
        const camelCaseProp = _.camelCase(propertyName);
        let fre = filter(camelCaseProp, value);
        let key: string;
        if (fre) {
          if (_.isBoolean(fre)) {
            key = camelCaseProp;
          } else if (_.isString(fre)) {
            key = fre;
          }
          // convert name and value
          else {
            key = fre.name;
          }
          rules[key] = value;
        }
      }
      buffer = '';
    } else {
      buffer += char;
    }
  }

  // 处理最后一个规则（没有分号结尾）
  if (buffer.trim() !== '') {
    const colonIndex = buffer.indexOf(':');
    if (colonIndex !== -1) {
      propertyName = buffer.substring(0, colonIndex).trim();
      const value = buffer.substring(colonIndex + 1).trim();

      // 转换CSS属性名为驼峰命名
      const camelCaseProp = propertyName.replace(/-([a-z])/g, (_, letter) =>
        letter.toUpperCase()
      );

      rules[camelCaseProp] = value;
    }
  }
  return rules;
}
//----------------------------------------------------
export type ParseAndTidyCssOptions = {
  filter?: AttrFilter;
  parseBackground?: boolean;
  nameCase: StrCaseMode;
  urlRewrite?: {
    (url: string): string;
  };
};
export function parseAndTidyCssRule(
  rule = {} as Vars,
  {
    filter,
    parseBackground: need_parse_background = true,
    nameCase = 'kebab',
    urlRewrite,
  } = {} as ParseAndTidyCssOptions
) {
  if (_.isString(rule)) {
    rule = parseCssRule(rule, filter);
  }
  if (need_parse_background) {
    let toNameCase = Str.getCaseFunc(nameCase);
    if (rule.background) {
      let bg = parseBackground(rule.background as string, { nameCase });
      delete rule.background;
      _.assign(rule, bg);
    }

    // Rewruite url
    let bgImgKey = toNameCase('background-image');
    if (rule[bgImgKey] && _.isFunction(urlRewrite)) {
      rule[bgImgKey] = urlRewrite(rule[bgImgKey]);
    }

    let bgPosKey = toNameCase('background-position');
    if (rule[bgPosKey]) {
      const toPosName = function (
        str: string | undefined,
        cans = [] as string[]
      ) {
        if (str) {
          if (/^0(%|px|rem|em|pt)?$/.test(str)) {
            return cans[0];
          }
          if ('50%' == str) {
            return cans[1];
          }
          if ('100%' == str) {
            return cans[2];
          }
        }
        return str;
      };
      let poss = rule[bgPosKey].split(/\s+/) as string[];
      let posX = _.first(poss);
      let posY = _.last(poss);
      delete rule[bgPosKey];
      rule[toNameCase('background-position-x')] = toPosName(posX, [
        'left',
        'center',
        'right',
      ]);
      rule[toNameCase('background-position-y')] = toPosName(posY, [
        'top',
        'center',
        'bottom',
      ]);
    }
  }
  return rule;
}
//----------------------------------------------------
export function parseBackground(
  str = '',
  { nameCase = 'kebab' } = {} as {
    nameCase: StrCaseMode;
  }
): MessageMap {
  let toNameCase = Str.getCaseFunc(nameCase);
  // 首先整理字符串，去掉多余的空格，确保 backgroundPosition|backgroundSize 之间是没有空格的
  let s = (str || '')
    .replace(/[ ]{2,}/g, ' ')
    .replace(/[ ]*([\/,])[ ]*/g, '$1')
    .replace(/[ ]\)/g, ')')
    .replace(/\([ ]/g, '(');

  // 正则表达式拼装
  // 1: backgroundColor
  let R = '(#[0-9a-f]{3,}|rgba?\\([\\d, .]+\\))';
  // 2: backgroundImage
  R += '|(url\\([^\\)]+\\))';
  // 3: 组合 backgroundPosition / backgroundSize 的组合
  R += '|(';
  // 4: backgroundPositionX
  R += '(left|right|center|\\d+(%|em|px|cm|ch))';
  // 6: backgroundPositionX
  R += ' *(top|bottom|center|\\d+(%|em|px|cm|ch)?)';
  // 8: backgroundSize : 3 子表达式
  R += '/(auto|cover|contain|\\d+(%|em|px)( \\d+(%|em|px))?|auto( auto)?)';
  R += ')';
  // 13: backgroundRepeat
  R += '|(repeat|no-repeat)';
  // 14: backgroundOrigin : 1 子表达式
  R += '|((padding|border|content)-box)';
  // 16: backgroundAttachment
  R += '|(scroll|fixed)';
  let regex = new RegExp(R, 'gi');

  // 准备赋值
  let indexes = {
    backgroundColor: 1,
    backgroundImage: 2,
    backgroundPositionX: 4,
    backgroundPositionY: 6,
    backgroundSize: 8,
    backgroundRepeat: 13,
    backgroundOrigin: 14,
    backgroundAttachment: 16,
  } as {
    [k: string]: number;
  };

  // 准备返回对象
  let bg = {} as MessageMap;

  // 循环解析字符串
  let m;
  while ((m = regex.exec(s)) !== null) {
    //console.log(m)
    for (var key in indexes) {
      var index = indexes[key];
      if (m[index]) {
        let k2 = toNameCase(key);
        bg[k2] = m[index];
      }
    }
  }

  // 搞定收工
  return bg;
}
//----------------------------------------------------
export function renderCssRule(css = {}) {
  if (_.isEmpty(css)) {
    return '';
  }
  if (_.isString(css)) {
    return css;
  }
  let list = [] as string[];
  _.forEach(css, (val, key) => {
    if (_.isNull(val) || _.isUndefined(val) || Str.isBlank(val)) return;
    // CSS 变量
    if (key.startsWith('--')) {
      list.push(`${key}:${val}`);
      return;
    }
    let pnm = _.kebabCase(key);
    if (/^(opacity|z-index|order)$/.test(pnm)) {
      list.push(`${pnm}:${val}`);
    }
    // Empty string to remove one propperty
    else if (_.isNumber(val)) {
      list.push(`${pnm}:${val}px`);
    }
    // Set the property
    else {
      list.push(`${pnm}:${val}`);
    }
  });
  return list.join(';');
}
//----------------------------------------------------
/**
 * Render a full style sheet by object like:
 *
 * ```js
 * [{
 *    selector: ["selector A", "selector B"],
 *    rules: {
 *       "background": "red"
 *    }
 * }]
 * ```
 *
 * @param sheet{Array} : style selecor and rules
 */
export function renderCssStyleSheet(sheet = [] as CssSheet[], scope?: string) {
  sheet = _.concat(sheet);
  let re = [];
  for (let it of sheet) {
    let { selectors, rules } = it;
    selectors = _.concat(selectors);

    if (_.isEmpty(selectors) || _.isEmpty(rules)) {
      continue;
    }

    // 添加前缀
    if (scope) {
      selectors = _.map(selectors, (s) => {
        return scope + ' ' + s;
      });
    }

    re.push(selectors.join(',') + '{');
    re.push(renderCssRule(rules));
    re.push('}');
  }
  return re.join('\n');
}

/**
 * 将 CSS 样式表字符串解析为 CssSheet 对象数组。
 *
 * @param input 包含 CSS 规则的字符串。
 * @returns  CssSheet 对象的数组，每个对象代表一个 CSS 规则集。
 *
 * @example
 * ```typescript
 * const cssString = `
 * .c0 uk[a=9] {color:red; padding:2em 12em; font-size:16px}
 * .c2-2345,#cx > .title {margin-left:12px; background: url("a.png") no-repeat;}
 * `;
 * const cssSheets = parseCssStyleSheet(cssString);
 * console.log(cssSheets);
 * // Expected output:
 * // [
 * //   {
 * //     selectors: [".c0 uk[a=9]"],
 * //     rules: { color: "red", padding: "2em 12em", fontSize:"16px" }
 * //   },
 * //   {
 * //     selectors: [".c2-2345", "#cx > .title"],
 * //     rules: { mrginLeft: "12px",  background: "url(\"a.png\"") no-repeat"}
 * //   }
 * // ]
 * ```
 */
export function parseCssStyleSheet(input: string): CssSheet[] {
  const result: CssSheet[] = [];

  // 正则表达式匹配CSS规则块
  // 这个正则表达式匹配选择器部分和大括号内的规则部分
  const ruleRegex = /([^{]+)\s*\{\s*([^}]+)\s*\}/g;

  // 匹配所有规则块
  let match;
  while ((match = ruleRegex.exec(input)) !== null) {
    const selectorsStr = match[1].trim();
    const rulesStr = match[2].trim();

    // 分割多个选择器（逗号分隔）
    const selectors = selectorsStr.split(',').map((s) => s.trim());
    const rules = parseCssRule(rulesStr);

    // 添加到结果数组
    result.push({
      selectors,
      rules,
    });
  }

  return result;
}
