import _ from "lodash";
import { DateTime, I18n, Num, Str } from "../";
import {
  CurrencyExchangeRate,
  DateInput,
  ExchangeOptions,
  ExchangeRate,
  ExchangeRateSet,
  ExchangeRateTable,
  TiCurrency,
  ToBankTextOptions,
} from "../../_type";

///////////////////////////////////////
const CURRENCIES = {
  AUD: {
    token: "$",
    icon: "fas-dollar-sign",
    text: `i18n:currency-AUD`,
  },
  CAD: {
    token: "$",
    icon: "fas-dollar-sign",
    text: `i18n:currency-CAD`,
  },
  EUR: {
    token: "€",
    icon: "fas-euro-sign",
    text: `i18n:currency-EUR`,
  },
  GBP: {
    token: "£",
    icon: "fas-pound-sign",
    text: `i18n:currency-GBP`,
  },
  HKD: {
    token: "¥",
    icon: "fas-yen-sign",
    text: `i18n:currency-HKD`,
  },
  JPY: {
    token: "¥",
    icon: "fas-yen-sign",
    text: `i18n:currency-JPY`,
  },
  MOP: {
    token: "¥",
    icon: "fas-yen-sign",
    text: `i18n:currency-MOP`,
  },
  CNY: {
    token: "¥",
    icon: "fas-yen-sign",
    text: `i18n:currency-CNY`,
  },
  USD: {
    token: "$",
    icon: "fas-dollar-sign",
    text: `i18n:currency-USD`,
  },
} as { [k: string]: { token: string; icon: string; text: string } };
///////////////////////////////////////
/**
 * 根据汇率数组生成汇率表，支持自动添加反向汇率与桥接汇率
 * @param input 原始汇率数组
 * @param bridge 桥接货币，即本币，默认 CNY
 * @returns 汇率表对象
 */
export function buildExchangeRateTable(
  input: CurrencyExchangeRate[],
  bridge: string = "CNY"
) {
  const re: ExchangeRateTable = {
    loadedDates: new Set(),
    rates: new Map(),
  };
  joinExchangeRateTable(re, input, bridge);
  return re;
}

/**
 * 根据汇率数组生成汇率表，支持自动添加反向汇率与桥接汇率
 * @param input 原始汇率数组
 * @param bridge 桥接货币，即本币，默认 CNY
 * @param autoAddReverse 是否自动补全反向汇率，默认 true
 * @returns 汇率表对象
 */
export function joinExchangeRateTable(
  table: ExchangeRateTable,
  input: CurrencyExchangeRate[],
  bridge: string = "CNY"
): ExchangeRateTable {
  // 遍历输入，填充直接汇率
  for (let it of input) {
    const { currency, beginDate, endDate, rate, value } = it;
    // 本币忽略
    if (currency == bridge || !beginDate) continue;

    const key = `${bridge}_${currency}`;
    // 获取每日汇率表
    let rate_set = table.rates.get(key);
    let val: ExchangeRate = { rate, value };

    // 初始化:每日汇率表
    if (!rate_set) {
      rate_set = {
        history: new Map(),
      };
      table.rates.set(key, rate_set);
    }

    // 最新汇率
    if (!endDate) {
      rate_set.last = val;
      rate_set.lastDate = beginDate;
      table.hasLoadedLastRates = true;
      table.lastDate = beginDate;
      table.loadedDates.add(beginDate);
    }
    // 填充每日汇率
    else if (beginDate >= endDate!) {
      rate_set.history.set(beginDate, val);
      table.loadedDates.add(beginDate);
    }
    // 添加多个日汇率
    else {
      // 开始日期
      rate_set.history.set(beginDate, val);
      table.loadedDates.add(beginDate);
      // 中间日期 yyyyMMdd
      let m = /^(\d{4})(\d{2})(\d{2})$/.exec(beginDate);
      if (!m) {
        throw new Error(`Invalid exchange rate beginDate format: ${beginDate}`);
      }
      let d = new Date(`${m[1]}-${m[2]}-${m[3]} 00:00:00Z`);
      // 100 天汇率总会变吧
      let loopCount = 0;
      while (loopCount < 100) {
        DateTime.moveDate(d, 1);
        let d_in_s = DateTime.format(d, { fmt: "yyyyMMdd", timezone: "Z" });
        if (d_in_s == endDate!) {
          break;
        }
        rate_set.history.set(d_in_s, val);
        table.loadedDates.add(d_in_s);
        loopCount++;
      }
      // 结束日期
      rate_set.history.set(endDate, val);
      table.loadedDates.add(endDate);
    }
  }

  return table;
}

export function exchangeWithCurrency(val: string, options: ExchangeOptions) {
  // 拆分输入参数
  let { from = "CNY" } = options;
  // 解析出 cent 和 货币单位
  let { cent, currency } = parseCurrency(val, {
    currency: from,
    unit: 1,
  });

  // 整理输入金额
  from = currency || from;

  // 转换
  let v1 = exchange(cent, { ...options, from, precision: 0 });
  if (isNaN(v1)) return undefined;
  let yuan = Num.precise(v1, options.precision);
  return `${yuan}${options.to}`;
}

export function exchange(val: number, options: ExchangeOptions): number {
  // 获取汇率
  let exr = evalExchangeRate(_.omit(options, "precision"));

  // 转换金额
  let re = val * exr;
  if (options.precision) {
    return Num.precise(re, options.precision);
  }
  return re;
}
//-----------------------------------
export function evalExchangeRate(options: ExchangeOptions): number {
  let { from = "CNY", to, bridge, table, precision = 4 } = options;

  // 无需汇率转换
  if (from == to) {
    return 1;
  }

  // 直接转换
  let exr = table[`${from}_${to}`];
  if (_.isNumber(exr)) {
    return exr;
  }

  // 此时必须有桥接，否则无法计算
  if (!bridge) {
    throw new Error("Bridge currency cannot be empty");
  }

  // 直接采用反转汇率
  exr = table[`${to}_${from}`];
  if (_.isNumber(exr)) {
    return 1 / exr;
  }

  // 使用中间货币桥接计算
  const errMsg = `Exchange rate fail to build bridge, from:${from}, to:${to}, bridge:${bridge}`;

  // 前桥
  let br0_is_rev = false;
  let br0 = table[`${from}_${bridge}`];
  if (!_.isNumber(br0)) {
    br0 = table[`${bridge}_${from}`];
    br0_is_rev = true;
    if (!_.isNumber(br0)) throw Error(errMsg);
  }

  // 后桥
  let br1_is_rev = false;
  let br1 = table[`${bridge}_${to}`];
  if (!_.isNumber(br1)) {
    br1 = table[`${to}_${bridge}`];
    br1_is_rev = true;
    if (!_.isNumber(br1)) throw Error(errMsg);
  }

  // 开始计算桥接汇率
  let v0 = br0_is_rev ? 1 / br0 : 1 * br0;
  let v1 = br1_is_rev ? v0 / br1 : v0 * br1;
  exr = Num.precise(v1, precision);
  return exr;
}
//-----------------------------------
export function toExchangeRateDateStr(input: DateInput): string {
  let d = DateTime.parse(input, { timezone: "Z" });
  return DateTime.format(d!, { timezone: "Z", fmt: "yyyyMMdd" });
}
//-----------------------------------
export function getExchangeRateOfDate(
  rateSet: ExchangeRateSet,
  date?: string | null
): ExchangeRate | undefined {
  // 未指定日期，返回最新汇率
  if (!date) {
    return rateSet.last;
  }
  // 指定日期比最后日期还晚，也用最新汇率
  if (rateSet.lastDate && rateSet.last && date >= rateSet.lastDate) {
    return rateSet.last;
  }
  // 寻找对应日期的汇率
  return rateSet.history.get(date);
}

//-----------------------------------
export function getCurrencyChar(cur: string = "CNY"): string {
  return _.get(CURRENCIES[cur], "token");
}

//-----------------------------------
export function getCurrencyToken(cur: string = "CNY"): string {
  return _.get(CURRENCIES[cur], "token");
}

//-----------------------------------
export function getCurrencyText(cur = "CNY") {
  return _.get(CURRENCIES[cur], "text");
}
//   //-----------------------------------
export function getCurrencyIcon(cur = "CNY") {
  return _.get(CURRENCIES[cur], "icon");
}
//-----------------------------------
export function getCurrencyList(): any[] {
  let list: any[] = [];
  _.forEach(CURRENCIES, (cu, key) => {
    list.push({
      key,
      value: key,
      token: cu.token,
      icon: cu.icon,
      text: I18n.text(cu.text),
    });
  });
  return list;
}

//-----------------------------------
/**
 * 解析给定的金额（数字、字符串、或对象）
 *
 * @param {String|Number|Object} input： 输入内容可以是 数组 或 如同 "100CNY" 结构的字符串
 * @param {Number} unit： 当输入是数字的时候，使用 该 unit 计算 cent， cent = input * unit
 *  - `100`  : yuan : 元
 *  - `10`   : jiao : 角
 *  - `1`    : cent : 分
 * @param {String} currency:  当输入是数字时，声明其代表的货币
 * @returns `{cent:128, yuan:1.28, currency:"CNY"}`
 */
export function parseCurrency(
  input: String | Number | TiCurrency,
  { unit = 100, currency = "CNY" } = {} as {
    unit: number;
    currency?: string;
  }
) {
  let [cent, yuan] = [NaN, NaN];

  // 若是数字类型
  if (_.isNumber(input) && _.isFinite(input)) {
    cent = Math.round(input * unit);
  }
  // 若是 string 类型
  else if (_.isString(input)) {
    let m: any = /^(\d*\.?\d+)([A-Z]{3})?$/.exec(input);
    if (m) {
      // 如果输入的是 "110CNY"/"20USD" 之类的字符串，则金额认为是"元"
      if (m[2]) {
        currency = m[2];
        cent = Math.round(m[1] * unit);
      }
      // 否则，当成数字处理
      else {
        cent = Math.round(m[1] * unit);
      }
    }
    // 无效的金额格式
    else {
      cent = NaN;
    }
  }
  // 若是对象类型
  else if (input instanceof Object && _.has(input, "currency")) {
    //   if (input && input.currency) {
    // if (_.isObject(input) && _.has(input, "currency")) {
    input = <TiCurrency>input;
    currency = input.currency;
    if (!_.isNil(input.cent)) {
      cent = input.cent;
    } else if (!_.isNil(input.yuan)) {
      cent = input.yuan * 100;
    } else if (!_.isNil(input.value)) {
      cent = input.value * unit;
    }
  }
  // 无效的金额格式
  else {
    cent = NaN;
  }

  if (_.isNumber(cent) && _.isFinite(cent)) {
    yuan = cent / 100;
  }

  // 完毕
  return { cent, yuan, currency };
}

export type AutoYuanTokenTextOptions = ToBankTextOptions & {
  currency?: string;
  precision?: number;
  showHeadToken?: boolean;
  showTailUnit?: boolean;
};

//-----------------------------------
export function autoYuanTokenText(
  cent: number = 0.0,
  options: AutoYuanTokenTextOptions = {}
): string {
  let {
    currency = "CNY",
    precision = 100,
    decimalPlaces = 2,
    width = 3,
    sep = ",",
    to = "left",
    showHeadToken: showPrefixToken = true,
    showTailUnit: showSuffixUnit = false,
  } = options;

  cent = Math.round(cent);
  let neg = cent < 0 ? "-" : "";
  cent = Math.abs(cent);
  let head = showPrefixToken ? getCurrencyToken(currency) || "" : "";
  let tail = showSuffixUnit ? currency : "";

  let n = cent / 100;
  if (precision > 0) {
    n = Math.round(n * precision) / precision;
  }

  // 组装 "金额文字"
  // let s = `${n}`;
  // if (precision > 0 && !auto) {
  //   let pos = s.lastIndexOf('.');
  //   if (pos < 0) {
  //     s = s + '.' + _.repeat('0', precision);
  //   }
  //   // 补零
  //   else {
  //     let sub = s.substring(pos + 1);
  //     if (sub.length < precision) {
  //       sub = _.padEnd(sub, precision, '0');
  //       s = s.substring(0, pos + 1) + sub;
  //     }
  //   }
  // }

  let s = toBankText(n, {
    decimalPlaces,
    width,
    sep,
    to,
  });
  return `${neg}${head}${s}${tail}`;
}

//-----------------------------------
/**
 * 将分转换为元
 *
 * @param cent 分的数额
 * @param precise 精度，默认两位小数
 * @returns 元的金额
 */
export function toYuanText(cent = 0.0, precision = 100): string {
  return autoYuanTokenText(cent, {
    currency: undefined,
    precision,
  });
}
//-----------------------------------
export function toYuanTokenText(
  cent = 0.0,
  currency = "CNY",
  precision = 100
): string {
  return autoYuanTokenText(cent, { currency, precision });
}
//-----------------------------------
export function toYuanTokenText2(
  cent = 0.0,
  currency = "CNY",
  precision = 100
): string {
  let s = toYuanTokenText(cent, currency, precision);
  return `${s}${currency}`;
}

//-----------------------------------
export type ToZeroTextOptions = AutoYuanTokenTextOptions & {
  placeholder?: string;
};
//-----------------------------------
export function toZeroText(
  cent: number = 0.0,
  options: ToZeroTextOptions = {}
) {
  if (!cent) {
    return options.placeholder ?? "--";
  }
  return autoYuanTokenText(cent, options);
}

//-----------------------------------
export function toZeroTokenText(
  cent = 0.0,
  options: ToZeroTextOptions = {}
): string {
  if (!cent) {
    return options.placeholder ?? "--";
  }
  return autoYuanTokenText(cent, {
    currency: "CNY",
    showHeadToken: true,
    showTailUnit: false,
    ...options,
  });
}

//-----------------------------------
export function toZeroTokenText2(cent = 0.0, options: ToZeroTextOptions = {}) {
  if (!cent) {
    return options.placeholder ?? "--";
  }
  return autoYuanTokenText(cent, {
    currency: "CNY",
    showHeadToken: true,
    showTailUnit: true,
    ...options,
  });
}

//-----------------------------------
export function toChineseText(cent = 0.0, capitalized = false): string {
  // Get the cent
  let yuan = Math.trunc(cent / 100);
  let fen = Math.round((cent - yuan * 100) * 100);

  // Gen Text
  let re = [Str.intToChineseNumber(yuan, capitalized)];
  if (fen > 0) {
    let UN = "角分厘毫";
    let fens = _.padStart(fen + "", 4, "0");
    re.push("元");
    for (let i = 0; i < fens.length; i++) {
      let f = Number(fens[i]) * 1;
      if (f > 0) {
        let t = Str.intToChineseNumber(f, capitalized);
        re.push(t);
        re.push(UN[i]);
      } else if (re[re.length - 1] != "零") {
        re.push("零");
      }
    }
    if (re[re.length - 1] == "零") {
      re.pop();
    }
  } else {
    re.push("元整");
  }
  return re.join("");
}

/**
 * 将输入的数字，分段显示。变成便于人类阅读的数字
 *
 * @param val 输入的值
 * @param options 配置参数
 *    - `options.width` : 每段有多长，默认 `3`
 *    - `options.sep` : 分隔字符串，默认 `,`
 *    - `options.to` : 分隔的方向。 'left|right'
 *    - `options.to = 'left'` 【默认】从右向左分隔，通常用来格式化金额
 *    - `options.to = 'right'` 从左至右分隔，通常用来格式化银行账号，或者软件激活码
 *    - `options.decimalPlaces` : 显示到小数点后几位，默认的则是自动不补零
 *
 * @returns 格式化后的字符串
 *
 * @see #PartitionOptions
 */
export function toBankText(
  val: string | number,
  options: ToBankTextOptions = {}
): string {
  // 防空
  if (_.isNil(val) || (_.isString(val) && Str.isBlank(val))) {
    return val;
  }

  // 处理参数
  let { width = 3, sep = ",", to = "left", decimalPlaces = 2 } = options;

  // 如果是字符串，则处理一下一些分隔符号
  let str: string;
  if (_.isNumber(val)) {
    str = `${val}`;
  } else {
    str = _.trim(val);
  }
  // 先拿到前缀
  let m = /^([+-])?(.+)$/.exec(str);
  if (!m) {
    throw `Impossiable toBankText '${val}'`;
  }
  let prefix = m[1] ?? "";
  let s = m[2].replaceAll(/[^0-9.]/g, "");

  // 分成两段，一个是整数部分+小数部分
  let part_int: string = "";
  let part_fra: string = "";
  let pos = s.indexOf(".");
  // 必然是 .xxx
  if (pos == 0) {
    part_int = "0";
    part_fra = s.substring(1).trim();
  }
  // 全为整数
  else if (pos < 0) {
    part_int = s;
  }
  // 是小数 xx.xxx
  else {
    part_int = s.substring(0, pos).trim();
    part_fra = s.substring(pos + 1).trim();
  }

  let parts = [prefix];
  // 对于整数部分分段处理
  parts[0] += Str.partitions(part_int, { width, sep, to });
  // 对于小数部分，对齐精度
  if (decimalPlaces > 0) {
    parts.push(_.padEnd(part_fra, decimalPlaces, "0"));
  }
  // 如果不需要强制精度，则有值就显示
  else if (part_fra) {
    parts.push(part_fra);
  }

  // 返回
  return parts.join(".");
}

//-----------------------------------
export function isValidPayType(payType: string): boolean {
  return (
    {
      "wx.qrcode": true,
      "zfb.qrcode": true,
      "paypal": true,
    }[payType] || false
  );
}
//-----------------------------------
export function getPayTypeText(payType: string, autoI18n = false) {
  let key = null;
  if (_.isString(payType)) {
    key = `pay-by-${payType.replace(".", "-")}`;
  }
  if (key) return autoI18n ? I18n.get(key) : key;
}

//-----------------------------------
export function getPayTypeChooseI18nText(
  payType: string,
  { text = "pay-step-choose-tip2", nil = "pay-step-choose-nil" } = {}
) {
  let ptt = getPayTypeText(payType, true);
  if (ptt) {
    return I18n.getf(text, { val: ptt });
  }
  return I18n.get(nil);
}
