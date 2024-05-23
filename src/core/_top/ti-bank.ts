import _ from 'lodash';
import { I18n, Str, TiCurrency } from '../ti';

///////////////////////////////////////
const CURRENCIES = {
  AUD: {
    token: '$',
    icon: 'fas-dollar-sign',
    text: `i18n:currency-AUD`,
  },
  CAD: {
    token: '$',
    icon: 'fas-dollar-sign',
    text: `i18n:currency-CAD`,
  },
  EUR: {
    token: '€',
    icon: 'fas-euro-sign',
    text: `i18n:currency-EUR`,
  },
  GBP: {
    token: '£',
    icon: 'fas-pound-sign',
    text: `i18n:currency-GBP`,
  },
  HKD: {
    token: '¥',
    icon: 'fas-yen-sign',
    text: `i18n:currency-HKD`,
  },
  JPY: {
    token: '¥',
    icon: 'fas-yen-sign',
    text: `i18n:currency-JPY`,
  },
  MOP: {
    token: '¥',
    icon: 'fas-yen-sign',
    text: `i18n:currency-MOP`,
  },
  RMB: {
    token: '¥',
    icon: 'fas-yen-sign',
    text: `i18n:currency-RMB`,
  },
  USD: {
    token: '$',
    icon: 'fas-dollar-sign',
    text: `i18n:currency-USD`,
  },
} as { [k: string]: { token: string; icon: string; text: string } };
///////////////////////////////////////

/**
 *
 * @param val   金额, (1)若是数字，则直接转换; (2)若是 "xxRMB"结构的字符串，则解析后转换。
 * @param from  当前货币类型
 * @param to    目标货币类型
 * @param bridge 中间货币类型
 * @param exrs  转换汇率
 *
 * @returns 按汇率转换后的金额。(1)若是数字，则直接转换; (2)若是 "xxRMB"结构的字符串，则返回转换后的cent。

 */

export function exchange(
  val: number | string,
  { from = 'RMB', to = 'RMB', bridge = 'RMB', exrs = {} } = {} as {
    from?: string;
    to?: string;
    bridge?: string;
    exrs?: { [k: string]: number };
  },
): number | undefined {
  // 解析出 cent 和 货币单位
  let { cent, currency } = parseCurrency(val, {
    currency: from,
    unit: _.isNumber(val) ? 1 : 100, // "20RMB" or 2000
  });

  from = currency || from;
  val = cent;

  if (!_.isFinite(val)) {
    return undefined;
  }

  if (from == to) {
    return val;
  }

  // 直接转换
  let exr = exrs[`${from}_${to}`];
  if (exr > 0) {
    return val * exr;
  }

  // 逆向计算(评估)
  exr = exrs[`${to}_${from}`];
  if (exr > 0) {
    return val / exr;
  }

  // 使用中间货币计算
  let br0 = exrs[`${from}_${bridge}`] || exrs[`${bridge}_${from}`];
  let br1 = exrs[`${to}_${bridge}`] || exrs[`${bridge}_${to}`];
  if (br0 && br0 > 0 && br1 && br1 > 0) {
    let v0 = exchange(val, { from, to: bridge, exrs });
    if (_.isFinite(v0)) {
      let v1 = exchange(v0!, { from: bridge, to, exrs });
      return v1;
    }
  }
}

export function getCurrencyChar(cur: string = 'RMB'): string {
  return _.get(CURRENCIES[cur], 'token');
}

//-----------------------------------
export function getCurrencyToken(cur: string = 'RMB'): string {
  return _.get(CURRENCIES[cur], 'token');
}

//-----------------------------------
export function getCurrencyText(cur = 'RMB') {
  return _.get(CURRENCIES[cur], 'text');
}
//   //-----------------------------------
export function getCurrencyIcon(cur = 'RMB') {
  return _.get(CURRENCIES[cur], 'icon');
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
 * @param {String|Number|Object} input： 输入内容可以是 数组 或 如同 "100RMB" 结构的字符串
 * @param {Number} unit： 当输入是数字的时候，使用 该 unit 计算 cent， cent = input * unit
 *  - `100`  : yuan : 元
 *  - `10`   : jiao : 角
 *  - `1`    : cent : 分
 * @param {String} currency:  当输入是数字时，声明其代表的货币
 * @returns `{cent:128, yuan:1.28, currency:"RMB"}`
 */
export function parseCurrency(
  input: String | Number | TiCurrency,
  { unit = 100, currency = 'RMB' } = {} as {
    unit: number;
    currency?: string;
  },
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
      // 如果输入的是 "110RMB"/"20USD" 之类的字符串，则金额认为是"元"
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
  else if (input instanceof Object && _.has(input, 'currency')) {
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

//-----------------------------------
export function autoYuanTokenText(
  cent: number = 0.0,
  { currency = 'RMB', precision = 2, auto = true } = {} as {
    currency?: string;
    precision?: number;
    auto?: boolean;
  },
): string {
  cent = Math.round(cent);
  let neg = cent < 0 ? '-' : '';
  cent = Math.abs(cent);
  let t = getCurrencyToken(currency) || '';

  let n = _.round(cent / 100, precision);

  // 组装 "金额文字"
  let s = `${n}`;
  if (precision > 0 && !auto) {
    let pos = s.lastIndexOf('.');
    if (pos < 0) {
      s = s + '.' + _.repeat('0', precision);
    }
    // 补零
    else {
      let sub = s.substring(pos + 1);
      if (sub.length < precision) {
        sub = _.padEnd(sub, precision, '0');
        s = s.substring(0, pos + 1) + sub;
      }
    }
  }

  s = toBankText(s);
  return `${neg}${t}${s}`;
}

//-----------------------------------
/**
 * 将分转换为元
 *
 * @param cent 分的数额
 * @param precise 精度，默认两位小数
 * @returns 元的金额
 */
export function toYuanText(cent = 0.0, precision = 2): string {
  return autoYuanTokenText(cent, {
    currency: undefined,
    precision,
    auto: true,
  });
}
//-----------------------------------
export function toYuanTokenText(
  cent = 0.0,
  currency = 'RMB',
  precision = 2,
): string {
  return autoYuanTokenText(cent, { currency, precision, auto: true });
}
//-----------------------------------
export function toYuanTokenText2(
  cent = 0.0,
  currency = 'RMB',
  precision = 2,
): string {
  let s = toYuanTokenText(cent, currency, precision);
  return `${s}${currency}`;
}

//-----------------------------------
export function toZeroText(
  cent: number = 0.0,
  { precision = 2, placeholder = '---' } = {} as {
    precision?: number;
    placeholder?: string;
  },
) {
  if (!cent) {
    return placeholder;
  }
  return toYuanText(cent, precision);
}

//-----------------------------------
export function toZeroTokenText(
  cent = 0.0,
  { currency = 'RMB', precision = 2, placeholder = '---' } = {} as {
    currency?: string;
    precision?: number;
    placeholder?: string;
  },
): string {
  if (!cent) {
    return placeholder;
  }
  return toYuanTokenText(cent, currency, precision);
}

//-----------------------------------
export function toZeroTokenText2(
  cent = 0.0,
  { currency = 'RMB', precision = 2, placeholder = '---' } = {} as {
    currency?: string;
    precision?: number;
    placeholder?: string;
  },
) {
  if (!cent) {
    return placeholder;
  }
  return toYuanTokenText2(cent, currency, precision);
}

//-----------------------------------
export function toChineseText(cent = 0.0, capitalized = false): string {
  // Get the cent
  let yuan = Math.trunc(cent / 100);
  let fen = Math.round((cent - yuan * 100) * 100);

  // Gen Text
  let re = [Str.intToChineseNumber(yuan, capitalized)];
  if (fen > 0) {
    let UN = '角分厘毫';
    let fens = _.padStart(fen + '', 4, '0');
    re.push('元');
    for (let i = 0; i < fens.length; i++) {
      let f = Number(fens[i]) * 1;
      if (f > 0) {
        let t = Str.intToChineseNumber(f, capitalized);
        re.push(t);
        re.push(UN[i]);
      } else if (re[re.length - 1] != '零') {
        re.push('零');
      }
    }
    if (re[re.length - 1] == '零') {
      re.pop();
    }
  } else {
    re.push('元整');
  }
  return re.join('');
}

//-----------------------------------
export function toBankText(
  v: string,
  { part = 3, sep = ',', to = 'left' } = {} as {
    part?: number;
    sep?: string;
    to?: string;
  },
): string {
  if (_.isNil(v)) {
    return v;
  }
  let s = v + '';
  let pos = s.indexOf('.');
  if (pos < 0) {
    pos = s.length;
  }
  let ns = s.split('');
  if ('left' == to) {
    for (let i = pos; i > 0; i -= part) {
      if (i < pos) {
        ns.splice(i, 0, sep);
      }
    }
  } else if ('right' == to) {
    let off = 0;
    for (let i = 0; i < pos; i += part) {
      if (i > 0) {
        ns.splice(i + off, 0, sep);
        off += sep.length;
      }
    }
  }
  return ns.join('');
}

//-----------------------------------
export function isValidPayType(payType: string): boolean {
  return (
    {
      'wx.qrcode': true,
      'zfb.qrcode': true,
      'paypal': true,
    }[payType] || false
  );
}
//-----------------------------------
export function getPayTypeText(payType: string, autoI18n = false) {
  let key = null;
  if (_.isString(payType)) {
    key = `pay-by-${payType.replace('.', '-')}`;
  }
  if (key) return autoI18n ? I18n.get(key) : key;
}

//-----------------------------------
export function getPayTypeChooseI18nText(
  payType: string,
  { text = 'pay-step-choose-tip2', nil = 'pay-step-choose-nil' } = {},
) {
  let ptt = getPayTypeText(payType, true);
  if (ptt) {
    return I18n.getf(text, { val: ptt });
  }
  return I18n.get(nil);
}
