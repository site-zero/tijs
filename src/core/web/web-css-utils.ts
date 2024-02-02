import _ from "lodash";
import { FuncA2, MessageMap, S, Size2D, StrCaseMode, Util, Vars } from "../ti";
import * as Dom from "./web-dom";
import { AttrFilter } from "./web-dom";
/*-------------------------------------------------------

                     Type Defination

-------------------------------------------------------*/
export type CssItemAlignment = "start" | "end" | "center" | "stretch";
export type CssContentAlignment =
  | "start"
  | "end"
  | "center"
  | "stretch"
  | "space-around"
  | "space-between"
  | "space-evenly";
export type CssGridAutoFlow =
  | "row"
  | "column"
  | "dense"
  | "row dense"
  | "column dense";
export type CssGridLayout = Partial<{
  // Track
  gridTemplateColumns: string;
  gridTemplateRows: string;
  /*
  [
    "header header header header",
    "main   main   .      sidebar",
    "footer footer footer footer",
  ]
   */
  gridTemplateAreas: string[];
  // Gap
  gridColumnGap: string;
  gridRowGap: string;
  // <grid-row-gap> <grid-column-gap>
  gap: string;
  // Alignment
  justifyItems: CssItemAlignment;
  alignItems: CssItemAlignment;
  justifyContent: CssContentAlignment;
  alignContent: string;
  // Extends
  gridAutoColumns: string;
  gridAutoRows: string;
  gridAutoFlow: CssGridAutoFlow;
}>;

export type CssGridItem = Partial<{
  // <grid-column-start> <grid-column-end>
  gridColumn: string;
  // <number> | <name> | span <number> | auto
  gridColumnStart: string;
  // <number> | <name> | span <number> | auto
  gridColumnEnd: string;
  // <grid-row-start> <grid-row-end>
  gridRow: string;
  // <number> | <name> | span <number> | auto
  gridRowStart: string;
  // <number> | <name> | span <number> | auto
  gridRowEnd: string;
  // <name> | <row-start> / <column-start> / <row-end> / <column-end>
  gridArea: string;
  justifySelf: CssItemAlignment;
  alignSelf: CssItemAlignment;
}>;

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
    }
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
      height: H
    };
  }
  if (H) {
    return {
      width: scale * H,
      height: H
    };
  }
  return {
    width: W,
    height: W / scale
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
    remBase: Dom.getRemBase()
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
      px: (v: number) => v,
      rem: (v: number) => v * remBase,
      em: (v: number) => v * emBase,
      "%": (v: number) => (v * base) / 100
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
      return sz * 100 + "%";
    }
    if (remBase > 0) {
      return sz / remBase + "rem";
    }
    return sz + "px";
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
export function toBackgroundUrl(src?: string, base = "") {
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
    src = S.renderTmpl(tmpl, src);
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
      let ss = _.without(_.split(kla, /\s+/g), "");
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
  let caseMode = options.caseMode || "kebab";
  let filter = options.filter;
  let re = {} as Vars;
  let fn = S.getCaseFunc(caseMode);
  for (let style of styleList) {
    _.forEach(style, (v, k) => {
      let name = fn(k);
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
  return names.join(" ");
}
//----------------------------------------------------
export function parseCssRule(
  rule: undefined | null | string,
  flt: AttrFilter = true
): Vars {
  let re = {} as Vars;
  if (!rule) {
    return re;
  }

  rule = _.trim(rule);
  if (S.isBlank(rule)) {
    return {};
  }
  let filter = Dom.attrFilter(flt);

  let ss = rule.split(";");
  for (let s of ss) {
    if (S.isBlank(s)) continue;
    let pos = s.indexOf(":");
    if (pos <= 0) {
      continue;
    }
    let name = _.trim(s.substring(0, pos));
    let value = _.trim(s.substring(pos + 1));
    let fre = filter(name, value);
    let key: string;
    if (fre) {
      if (_.isBoolean(fre)) {
        key = _.camelCase(name);
      } else if (_.isString(fre)) {
        key = fre;
      }
      // convert name and value
      else {
        key = fre.name;
      }
      re[key] = value;
    }
  }
  return re;
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
    nameCase = "kebab",
    urlRewrite
  } = {} as ParseAndTidyCssOptions
) {
  if (_.isString(rule)) {
    rule = parseCssRule(rule, filter);
  }
  if (need_parse_background) {
    let toNameCase = S.getCaseFunc(nameCase);
    if (rule.background) {
      let bg = parseBackground(rule.background as string, { nameCase });
      delete rule.background;
      _.assign(rule, bg);
    }

    // Rewruite url
    let bgImgKey = toNameCase("background-image");
    if (rule[bgImgKey] && _.isFunction(urlRewrite)) {
      rule[bgImgKey] = urlRewrite(rule[bgImgKey]);
    }

    let bgPosKey = toNameCase("background-position");
    if (rule[bgPosKey]) {
      const toPosName = function (
        str: string | undefined,
        cans = [] as string[]
      ) {
        if (str) {
          if (/^0(%|px|rem|em|pt)?$/.test(str)) {
            return cans[0];
          }
          if ("50%" == str) {
            return cans[1];
          }
          if ("100%" == str) {
            return cans[2];
          }
        }
        return str;
      };
      let poss = rule[bgPosKey].split(/\s+/) as string[];
      let posX = _.first(poss);
      let posY = _.last(poss);
      delete rule[bgPosKey];
      rule[toNameCase("background-position-x")] = toPosName(posX, [
        "left",
        "center",
        "right"
      ]);
      rule[toNameCase("background-position-y")] = toPosName(posY, [
        "top",
        "center",
        "bottom"
      ]);
    }
  }
  return rule;
}
//----------------------------------------------------
export function parseBackground(
  str = "",
  { nameCase = "kebab" } = {} as {
    nameCase: StrCaseMode;
  }
): MessageMap {
  let toNameCase = S.getCaseFunc(nameCase);
  // 首先整理字符串，去掉多余的空格，确保 backgroundPosition|backgroundSize 之间是没有空格的
  let s = (str || "")
    .replace(/[ ]{2,}/g, " ")
    .replace(/[ ]*([\/,])[ ]*/g, "$1")
    .replace(/[ ]\)/g, ")")
    .replace(/\([ ]/g, "(");

  // 正则表达式拼装
  // 1: backgroundColor
  let R = "(#[0-9a-f]{3,}|rgba?\\([\\d, .]+\\))";
  // 2: backgroundImage
  R += "|(url\\([^\\)]+\\))";
  // 3: 组合 backgroundPosition / backgroundSize 的组合
  R += "|(";
  // 4: backgroundPositionX
  R += "(left|right|center|\\d+(%|em|px|cm|ch))";
  // 6: backgroundPositionX
  R += " *(top|bottom|center|\\d+(%|em|px|cm|ch)?)";
  // 8: backgroundSize : 3 子表达式
  R += "/(auto|cover|contain|\\d+(%|em|px)( \\d+(%|em|px))?|auto( auto)?)";
  R += ")";
  // 13: backgroundRepeat
  R += "|(repeat|no-repeat)";
  // 14: backgroundOrigin : 1 子表达式
  R += "|((padding|border|content)-box)";
  // 16: backgroundAttachment
  R += "|(scroll|fixed)";
  let regex = new RegExp(R, "gi");

  // 准备赋值
  let indexes = {
    backgroundColor: 1,
    backgroundImage: 2,
    backgroundPositionX: 4,
    backgroundPositionY: 6,
    backgroundSize: 8,
    backgroundRepeat: 13,
    backgroundOrigin: 14,
    backgroundAttachment: 16
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
    return "";
  }
  if (_.isString(css)) {
    return css;
  }
  let list = [] as string[];
  _.forEach(css, (val, key) => {
    if (_.isNull(val) || _.isUndefined(val) || S.isBlank(val)) return;
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
  return list.join(";");
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
export type CssSheet = {
  selectors: string[];
  rules: Vars;
};
export function renderCssStyleSheet(sheet = [] as CssSheet[]) {
  sheet = _.concat(sheet);
  let re = [];
  for (let it of sheet) {
    let { selectors, rules } = it;
    selectors = _.concat(selectors);
    if (_.isEmpty(selectors) || _.isEmpty(rules)) {
      continue;
    }
    re.push(selectors.join(",") + "{");
    re.push(renderCssRule(rules));
    re.push("}");
  }
  return re.join("\n");
}
