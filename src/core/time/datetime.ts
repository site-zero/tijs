import _ from "lodash";
import { ENV_KEYS, getEnv, I18n, Str, tiGetDefaultComPropValue } from "../";
import {
  DateFormatOptions,
  DateInput,
  DateParseOptions,
  DateParseOptionsZone,
  DateTimeQuickParseMode,
  DateTimeQuickParseOptions,
  DateTimeQuickParserSet,
  setTimeToDate,
  TimeInput,
  TimeUpdateUnit,
} from "../../_type";
import { TiTime } from "./time-info";

///////////////////////////////////////////
// const P_DATE = new RegExp(
//   "^((\\d{2,4})([/\\\\-])?(\\d{1,2})?([/\\\\-])?(\\d{1,2})?)?" +
//     "(([ T])?" +
//     "(\\d{1,2})(:)(\\d{1,2})((:)(\\d{1,2}))?" +
//     "((.)(\\d{1,3}))?)?" +
//     "(([+-])(\\d{1,2})(:\\d{1,2})?)?" +
//     "(Z(\\d*))?$"
// );
const P_DATE = new RegExp(
  "^((\\d{2,4})([^0-9])(\\d{1,2})?([^0-9])?(\\d{1,2})?)?([^0-9])?" +
    "(([ T])?" +
    "(\\d{1,2})(:)(\\d{1,2})((:)(\\d{1,2}))?" +
    "(([.])(\\d{1,3}))?)?" +
    "(Z|([+-]\\d{1,2}(:\\d{2})?)?)?$"
);

type DataStdInfo = {
  yy: string;
  MM: string;
  dd: string;
  time: TiTime;
  zone: DateParseOptionsZone;
};

/**
 * 把任何输入转换为日期对象。
 * 它支持:
 *
 * - `undefined` : 会被转换为当前时间
 * - `"today"`: 会被转换为当天 00:00:00
 * - `"now"` : 会被转换为当前时间
 * - `数字` : 会被当做时间戳绝对毫秒数
 * - `yyyy-MM-dd HH:mm:ss` 格式的字符串，会被直接转换为日期对象
 * - `yyyyMMdd`
 * - `yyyy年M月d日`
 * - 数组`[$start, $end]` 会变成对应数组，每个元素应用上面的规则递归解析
 *
 * 如果输入不符合上述条件，则会抛错
 *
 * @param d 输入对象
 *
 * @returns  日期对象
 */
export function parse(
  d: any,
  options: DateParseOptions = {}
): Date | undefined {
  // 防空
  if (_.isNil(d) || Str.isBlank(d)) {
    return;
  }
  //console.log("parseDate:", d)
  // Default return today
  if ("now" === d) {
    return new Date();
  }
  if ("today" === d) {
    let d = new Date();
    setTime(d);
    return d;
  }
  // keep null
  if (_.isArray(d) && d.length == 0) {
    return;
  }
  // Date
  if (_.isDate(d)) {
    return new Date(d);
  }
  // Number as AMS
  if (_.isNumber(d)) {
    return new Date(d);
  }
  // String
  if (!_.isString(d)) {
    // Invalid date
    console.trace("Invalid Date Format:", d);
    return;
  }

  // 必然是字符串
  let str = _.trim(d);

  // MS
  if (/\d{13,}/.test(str)) {
    return new Date((str as any) * 1);
  }

  let info: DataStdInfo;
  let overrideTimezone =
    options.overrideTimezone ?? (options.timezone ? true : false);

  // 快速字符串 yyyyMMdd
  let mq = /^(\d{4})([01]\d)(\d{2})([zZ]|([+-]\d{1,2})(:\d{2})?)?$/.exec(str);
  if (mq) {
    let timezone = _to_timezone_input(
      mq[4],
      mq[5],
      options.timezone,
      overrideTimezone
    );
    info = {
      yy: mq[1],
      MM: mq[2],
      dd: mq[3],
      time: new TiTime("00:00:00"),
      zone: timezone,
    };
  }
  // 符合标准，可以直接创建日期对象
  //      | year   | month | day     T    HH      mm       ss    .    ms    Z
  else {
    let m =
      /^(\d{4})[^\d]([01]?\d)[^\d](\d{1,2})([^\d]{1,2})?([ T](\d{2}:\d{2}(:\d{2}(\.\d{3})?)?))?([zZ]|([+-]\d{1,2})(:\d{2})?)?$/.exec(
        str
      );
    if (m) {
      // let timezone = options.timezone || "Z";
      // let _tz = m[8];
      // if (!overrideTimezone && _tz) {
      //   if ("z" == _tz || "Z" == _tz) {
      //     timezone = "Z";
      //   } else {
      //     timezone = (m[9] as any) * 1;
      //   }
      // }
      let timezone = _to_timezone_input(
        m[9],
        m[10],
        options.timezone,
        overrideTimezone
      );
      info = {
        yy: m[1],
        MM: m[2],
        dd: m[3],
        time: new TiTime(m[6] || "00:00:00"),
        zone: timezone,
      };
    } else {
      console.trace("Invalid Date Format:", d);
      return;
    }
  }

  // 合并输出
  let dateStr = [
    _.padStart(info.yy, 4, "0"),
    "-",
    _.padStart(info.MM, 2, "0"),
    "-",
    _.padStart(info.dd, 2, "0"),
    " ",
    info.time.toString(),
    toTimezoneSuffix(info.zone),
  ].join("");

  return new Date(dateStr);
}

function _to_timezone_input(
  _tz: string | null | undefined,
  offset: string | null,
  dft: DateParseOptionsZone | undefined | null,
  overrideTimezone: boolean
) {
  let timezone = dft || "Z";
  if (!overrideTimezone && _tz) {
    if ("z" == _tz || "Z" == _tz) {
      timezone = "Z";
    } else {
      timezone = (offset as any) * 1;
    }
  }

  return timezone;
}

export function isDateTimeQuickParseMode(
  input: any
): input is DateTimeQuickParseMode {
  if (_quick_parsers[input as DateTimeQuickParseMode]) {
    return true;
  }
  return false;
}

const _quick_parsers: DateTimeQuickParserSet = {
  /**
   *
   * [yy?yy] [mm] [dd] HHmmdd
   *  - 2408 -> 2024-08-01 00:00:00
   *  - 240806 -> 2024-08-06 00:00:00
   *  - 20240806 -> 2024-08-06 00:00:00
   *  - 2408 11 -> 2024-08-01 11:00:00
   */
  ymd: (s: string): string | undefined => {
    const toyear = new Date().getFullYear();
    let year: number, month: number, day: number;

    // 移除所有非数字字符
    const _str = s.trim().replace(/\D/g, "");

    // 格式: YYMM
    if (_str.length === 4) {
      year = parseInt(_str.slice(0, 2));
      month = parseInt(_str.slice(2, 4)) - 1;
      day = 1;
      year += Math.floor(toyear / 100) * 100;
    }
    // 格式: YYMMDD
    else if (_str.length === 6) {
      year = parseInt(_str.slice(0, 2));
      month = parseInt(_str.slice(2, 4)) - 1;
      day = parseInt(_str.slice(4, 6));
      year += Math.floor(toyear / 100) * 100;
    }
    // 格式: YYYYMMDD
    else if (_str.length === 8) {
      year = parseInt(_str.slice(0, 4));
      month = parseInt(_str.slice(4, 6)) - 1;
      day = parseInt(_str.slice(6, 8));
    }
    // 不能接受的格式
    else {
      return;
    }
    // 返回日期字符串
    return [
      _.padStart(`${year}`, 4, "0"),
      _.padStart(`${month + 1}`, 2, "0"),
      _.padStart(`${day}`, 2, "0"),
    ].join("-");
  },
  /**
   * 假设今年是 2024 年
   *
   * [dd] [mm] [yy?yy]
   *  - 1908 -> 2024-08-19
   *  - 190828 -> 2028-08-19
   *  - 19082028 -> 2028-08-19
   */
  dmy: (s: string): string | undefined => {
    const toyear = new Date().getFullYear();
    let day: number, month: number, year: number;

    // 移除所有非数字字符
    const _str = s.trim().replace(/\D/g, "");

    // 格式: DDMM
    if (_str.length === 4) {
      day = parseInt(_str.slice(0, 2));
      month = parseInt(_str.slice(2, 4)) - 1;
      year = toyear;
    }
    // 格式: DDMMYY
    else if (_str.length === 6) {
      day = parseInt(_str.slice(0, 2));
      month = parseInt(_str.slice(2, 4)) - 1;
      year = parseInt(_str.slice(4, 6));
      year += Math.floor(toyear / 100) * 100;
    }
    // 格式: DDMMYYYY
    else if (_str.length === 8) {
      day = parseInt(_str.slice(0, 2));
      month = parseInt(_str.slice(2, 4)) - 1;
      year = parseInt(_str.slice(4, 8));
    }
    // 不能接受的格式
    else {
      return undefined;
    }

    // 返回日期字符串
    return [
      _.padStart(`${year}`, 4, "0"),
      _.padStart(`${month + 1}`, 2, "0"),
      _.padStart(`${day}`, 2, "0"),
    ].join("-");
  },
  /**
   * 假设今年是 2024 年
   *
   * [dd] [mm] [yy?yy]
   *  - 0819 -> 2024-08-19
   *  - 081928 -> 2028-08-19
   *  - 08192028 -> 2028-08-19
   */
  mdy: (s: string): string | undefined => {
    const toyear = new Date().getFullYear();
    let day: number, month: number, year: number;

    // 移除所有非数字字符
    const _str = s.trim().replace(/\D/g, "");

    // 格式: MMDD
    if (_str.length === 4) {
      month = parseInt(_str.slice(0, 2)) - 1;
      day = parseInt(_str.slice(2, 4));
      year = toyear;
    }
    // 格式: MMDDYY
    else if (_str.length === 6) {
      month = parseInt(_str.slice(0, 2)) - 1;
      day = parseInt(_str.slice(2, 4));
      year = parseInt(_str.slice(4, 6));
      year += Math.floor(toyear / 100) * 100;
    }
    // 格式: MMDDYYYY
    else if (_str.length === 8) {
      month = parseInt(_str.slice(0, 2)) - 1;
      day = parseInt(_str.slice(2, 4));
      year = parseInt(_str.slice(4, 8));
    }
    // 不能接受的格式
    else {
      return undefined;
    }

    // 返回日期字符串
    return [
      _.padStart(`${year}`, 4, "0"),
      _.padStart(`${month + 1}`, 2, "0"),
      _.padStart(`${day}`, 2, "0"),
    ].join("-");
  },
};

/**
 * 在日期字符串后附加时区后缀。
 *
 * @param d_str - 日期字符串。
 * @param options - 解析选项。
 * @param options.timezone - 时区信息，可以是 'Z' 或数字表示的时区偏移量。
 * @returns 附加时区后缀后的日期字符串。
 */
function toTimezoneSuffix(timezone?: DateParseOptionsZone) {
  if ("Z" === timezone) {
    return "Z";
  }
  // 直接时区偏移量
  else if (_.isNumber(timezone)) {
    if (timezone >= 0) {
      return `+${timezone}`;
    }
    return `${timezone}`;
  }
  return "";
}

/**
 * 根据一个简洁的输入，解析出一个日期对象。 如果不能通过快速模式解析，
 * 那么就会回退到普通解析模式
 *
 * @param input 简洁的日期输入
 * @param options  快速输入模式的解析
 * @return  日期对象
 */
export function quickParse(
  _input: string,
  options: DateTimeQuickParseOptions = {}
): Date | undefined {
  let s = _.trim(_input);
  if (!s) return;
  let { mode = "dmy" } = options;
  let quick_parser = _quick_parsers[mode];

  // 获取日期部分和时间部分
  let m = /^([^\s]+)(\s+([^\s]+))?$/.exec(_input);
  if (m) {
    let s_date = m[1];
    let s_time = m[3] ?? "";

    // 如果日期部分包括特殊字符，就一定不是快速模式
    if (!/^[0-9]+$/.test(s_date)) {
      return parse(_input, options);
    }

    // 尝试解析日期
    let dInStr = quick_parser(s_date);

    // 解析失败
    if (!dInStr) {
      return parse(_input, options);
    }

    // 准备完整的日期时间字符串
    let date_str = dInStr;
    if (s_time) {
      let time = parseTime(s_time);
      date_str += " " + time.toString();
    } else {
      date_str += " 00:00:00.000";
    }
    date_str += toTimezoneSuffix(options.timezone);

    // 搞定
    return new Date(date_str);
  }

  // 采用普通的解析方式
  return parse(_input);
}

/**
 *
 * @param date  日期值
 * @returns  用来格式化日期的上下文变量
 */
export function genFormatContext(_d: any, timezone?: DateParseOptionsZone) {
  let date: Date;
  if (!_.isDate(_d)) {
    let d2 = parse(_d);
    if (!d2) {
      return {};
    }
    date = d2;
  } else {
    date = _d;
  }

  let m_i: number,
    yyyy: number,
    d: number,
    H: number,
    m: number,
    s: number,
    S: number;

  // 采用浏览器默认时区
  if (_.isNil(timezone)) {
    m_i = date.getMonth();
    yyyy = date.getFullYear();
    d = date.getDate();
    H = date.getHours();
    m = date.getMinutes();
    s = date.getSeconds();
    S = date.getMilliseconds();
  }
  // 指定了显示时区
  else {
    // 偏移
    if (_.isNumber(timezone)) {
      let offset = timezone * 3600000;
      date = new Date(date.getTime() + offset);
    }

    m_i = date.getUTCMonth();
    yyyy = date.getUTCFullYear();
    d = date.getUTCDate();
    H = date.getUTCHours();
    m = date.getUTCMinutes();
    s = date.getUTCSeconds();
    S = date.getUTCMilliseconds();
  }

  // TODO here add another param
  // to format the datetime to "in 5min" like string
  // Maybe the param should named as "shorthand"
  /*
  E   :Mon
  EE  :Mon
  EEE :Mon
  EEEE:Monday
  M   :9
  MM  :09
  MMM :Sep
  MMMM:September
  */
  // Format by pattern
  let M = m_i + 1;
  let Mmm = MONTH_ABBR[m_i];
  let MMM = Mmm ? Mmm.toUpperCase() : "---";
  let MMMM = I18n ? I18n.get(`month-${Mmm}`) : MONTH_NAME[m_i];

  let day = date.getDay();
  let dayK0 = _.upperFirst(I_DAYS[day]);
  let dayK1 = _.upperFirst(I_WEEK[day]);
  let E = I18n.get(dayK0);
  let EEEE = I18n.get(dayK1);
  return {
    yyyy,
    M,
    d,
    H,
    m,
    s,
    S,
    yyy: yyyy,
    yy: ("" + yyyy).substring(2, 4),
    MM: _.padStart(`${M}`, 2, "0"),
    dd: _.padStart(`${d}`, 2, "0"),
    HH: _.padStart(`${H}`, 2, "0"),
    mm: _.padStart(`${m}`, 2, "0"),
    ss: _.padStart(`${s}`, 2, "0"),
    SS: _.padStart(`${S}`, 3, "0"),
    SSS: _.padStart(`${S}`, 3, "0"),
    E,
    EE: E,
    EEE: E,
    EEEE,
    MMM,
    Mmm,
    MMMM,
  };
}

export function formats(
  date: DateInput[],
  options?: DateFormatOptions
): string[] {
  //console.log("formatDate", date, fmt)
  let list = [] as string[];
  for (let d of date) {
    list.push(format(d, options) as string);
  }
  return list;
}

/**
 * 获取默认时区偏移量(小时)。
 *
 * @param {boolean} [dftAsLocal=true] -
 * 在环境变量未定义 TIMEZONE 时，是否返回本地时区偏移量。
 * 如果为 true，则返回本地时区偏移量；否则返回 undefined。
 * @returns {number | undefined} 返回时区偏移量（以小时为单位），
 * 如果未设置时区且 dftAsLocal 为 false，则返回 undefined。
 */
export function getDefaultTimezoneOffset(dftAsLocal = true) {
  let tz = (getEnv(ENV_KEYS.TIMEZONE) as string) ?? "";
  let m = /^(GMT|UTC)([+-]\d{1,2})$/.exec(tz);
  if (m) {
    return parseInt(m[2]);
  }
  if (dftAsLocal) {
    let localOffsetInMin = new Date().getTimezoneOffset();
    return localOffsetInMin / -60;
  }
  return undefined;
}

export function getDefaultTimezoneProp(
  COM_TYPE: string,
  timezone?: DateParseOptionsZone
): DateParseOptionsZone {
  if (!_.isNil(timezone)) {
    return timezone;
  }
  let dft = tiGetDefaultComPropValue(COM_TYPE, "timezone", "auto");
  if ("Z" == dft) {
    return "Z";
  }
  if (/^[+-][0-9]{1,2}$/.test(dft)) {
    return parseInt(dft);
  }
  return getDefaultTimezoneOffset() ?? "Z";
}

/**
 * 格式化输出日期时间对象
 * 
 * @param date 日期值
 * @param fmt 格式化模板
 * @param trimZero 是否自动剪裁，即如果是 `2023-09-21 00:00:00` 会输出 `2023-09-21`

 * @returns 
 */
export function format(
  _date: DateInput,
  options: DateFormatOptions = {}
): string {
  // 防空
  if (_.isNil(_date)) {
    return "";
  }

  let { fmt, as = "datetime", trimZero = false, timezone } = options;

  if (_.isNil(fmt)) {
    let fmt_key =
      as == "date" ? ENV_KEYS.DFT_DATE_FORMAT : ENV_KEYS.DFT_DATETIME_FORMAT;
    fmt = getEnv(fmt_key, "yyyy-MM-dd HH:mm:ss") as string;
  }

  // 未指定 timezone 那么尝试从全局环境变量里获取
  // 这个通常由开发者在连接远程服务器获得正确的时区后
  // 通过类似 setEnv(ENV_KEYS.TIMEZONE,'GMT+8'); 来设置
  if (_.isNil(timezone)) {
    timezone = getDefaultTimezoneOffset(false);
  }
  let date: Date;
  if (!_.isDate(_date)) {
    if (_.isNumber(_date)) {
      date = new Date(_date);
    }
    // 直接解析
    else if (_.isString(_date)) {
      let m = /(Z|[+-]\d{1,2}(:\d{2})?)$/.exec(_date);
      if (m) {
        date = new Date(_date);
      }
      // 那么默认当作 UTC 时间戳
      else {
        date = new Date(_date + "Z");
      }
    }
    // 不知道是什么
    else {
      return "???";
    }

    // 最后防守一道
    if (!_.isDate(date) || isNaN(date.getTime())) {
      return "!!!";
    }
  } else {
    date = _date;
  }

  let _c = genFormatContext(date, timezone);
  let regex = /(y{2,4}|Mmm|M{1,4}|dd?|HH?|mm?|ss?|S{1,3}|E{1,4}|'([^']+)')/g;
  let list = [];
  let last = 0;
  while (true) {
    let ma = regex.exec(fmt);
    if (!ma) {
      break;
    }
    if (last < ma.index) {
      list.push(fmt.substring(last, ma.index));
    }
    let it = ma[2] ?? _.get(_c, ma[1]) ?? ma[1];
    list.push(it);
    last = regex.lastIndex;
  }
  if (last < fmt.length) {
    list.push(fmt.substring(last));
  }
  let re = list.join("");
  // if end by 00:00:00 then auto trim it
  if (trimZero && re.endsWith(" 00:00:00")) {
    return re.substring(0, re.length - 9);
  }
  return re;
}

/**
 * - inMin   : just now   : < 10min
 * - inHour  : 56min      : < 1hour
 * - inDay   : 23hour     : < 1day
 * - inWeek  : 6day       : < 1week
 * - inYear  : Jun 19     : < This Year
 * - anyTime : 2020/12/32 : Any time
 */
export function timeText(
  d: any,
  { justNow = 10, i18n } = {} as {
    justNow: number;
    i18n?: {
      "any-time": string;
      "in-year": string;
      "past-in-min": string;
      "past-in-hour": string;
      "past-in-day": string;
      "past-in-week": string;
      "future-in-min": string;
      "future-in-hour": string;
      "future-in-day": string;
      "future-in-week": string;
    };
  }
) {
  d = parse(d);
  if (!_.isDate(d)) {
    return null;
  }
  //.....................................
  // 准备 i18n 默认值
  i18n = _.assign(i18n ?? {}, {
    "any-time": I18n.get("dt-any-time", "yyyy-MM-dd"),
    "in-year": I18n.get("dt-in-year", "MM-dd"),
    "past-in-min": I18n.get("dt-past-in-min", "Just now"),
    "past-in-hour": I18n.get("dt-past-in-hour", "In ${min}mins"),
    "past-in-day": I18n.get("dt-past-in-day", "In ${hour}hours"),
    "past-in-week": I18n.get("dt-past-in-week", "In ${day}days"),
    "future-in-min": I18n.get("dt-future-in-min", "Soon"),
    "future-in-hour": I18n.get("dt-future-in-hour", "After ${min}mins"),
    "future-in-day": I18n.get("dt-future-in-day", "After ${hour}hours"),
    "future-in-week": I18n.get("dt-future-in-week", "After ${day}days"),
  });
  //.....................................
  let ams = d.getTime();
  let now = Date.now();
  let du_ms = now - ams;
  let at_past = du_ms >= 0;
  //.....................................
  du_ms = Math.abs(du_ms);
  //.....................................
  // Just now
  let du_min = Math.round(du_ms / 60000);
  if (du_min < justNow) {
    return at_past ? i18n["past-in-min"] : i18n["future-in-min"];
  }
  // in-hour
  if (du_min < 60) {
    let tmpl = at_past ? i18n["past-in-hour"] : i18n["future-in-hour"];
    return Str.renderTmpl(tmpl, { min: du_min });
  }
  //.....................................
  // in-day
  let du_hr = Math.round(du_ms / 3600000);
  if (du_hr < 24) {
    let tmpl = at_past ? i18n["past-in-day"] : i18n["future-in-day"];
    return Str.renderTmpl(tmpl, {
      min: du_min,
      hour: du_hr,
    });
  }
  //.....................................
  // in-week
  let du_day = Math.round(du_hr / 24);
  if (du_day < 7) {
    let tmpl = at_past ? i18n["past-in-week"] : i18n["future-in-week"];
    return Str.renderTmpl(tmpl, {
      min: du_min,
      hour: du_hr,
      day: du_day,
    });
  }
  //.....................................
  // in-year
  let year = d.getFullYear();
  let toYear = new Date().getFullYear();
  if (year == toYear) {
    return format(d, { fmt: i18n["in-year"], trimZero: true });
  }
  //.....................................
  // any-time
  return format(d, { fmt: i18n["any-time"], trimZero: true });
  //.....................................
}

/**
 * 根据星期下标 `0-6` 得到星期缩写名。
 * @param day  星期下标 `0-6`。如果小于`0`会被视为`0`；如果大于`6`会被视为`6`
 * @returns `0-6` 表示 `sun...sat`
 */
export function getWeekDayAbbr(day: number) {
  let i = _.clamp(day, 0, I_DAYS.length - 1);
  return I_DAYS[i];
}

/**
 * 根据星期下标 `0-6` 得到星期全名
 * @param day  星期下标 `0-6`。如果小于`0`会被视为`0`；如果大于`6`会被视为`6`
 * @returns `0-6` 表示 `sunday...saturday`
 */
export function getWeekDayName(day: number) {
  let i = _.clamp(day, 0, I_WEEK.length - 1);
  return I_WEEK[i];
}

/**
 * 根据星期缩写(`sun|mon...sat`)转换为星期下标 `0-6`
 * @param name  星期缩写
 * @param dft 默认返回的星期下标，默认为 `-1` 表示输入非法
 * @returns `0-6` 表示 `sun...sat`， `-1` 表示输入非法
 */
export function getWeekDayValue(name: string, dft = -1) {
  let nm: string = _.trim(_.lowerCase(name));
  let re = WEEK_DAYS[nm];
  if (_.isNumber(re)) return re;
  return dft;
}

export function setTime(
  d: Date,
  time: TimeInput = { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 },
  tz?: DateParseOptionsZone
) {
  return setTimeToDate(d, time, tz);
}

/**
 * 将日期对象的时间设置为当天的最后一毫秒（23:59:59.999）。
 * 如果传入时区，则先按该时区偏移后，再设置时间。
 *
 * @param d  要调整的日期对象
 * @param tz 可选时区偏移（小时）或 'Z' 表示 UTC
 * @returns 调整后的日期对象（原对象被修改）
 */
export function setDayLastTime(d: Date, tz?: DateParseOptionsZone) {
  const tm = { hours: 23, minutes: 59, seconds: 59, milliseconds: 999 };
  return setTime(d, tm, tz);
}

/**
 * 获取今天的日期对象，时间部分归零（00:00:00.000）。
 * @param tz 时区，默认本地时区
 * @returns 今天的日期对象，时间部分已归零
 */
export function today(tz?: DateParseOptionsZone): Date {
  return setTimeToDate(new Date(), {}, tz);
}

/**
 * 获取今天零点的时间戳（毫秒）
 * @param tz 时区，默认本地
 * @returns 今天 00:00:00.000 的毫秒时间戳
 */
export function todayInMs(tz?: DateParseOptionsZone): number {
  return today(tz).getTime();
}

export function moveYear(d: Date, offset = 0) {
  d.setFullYear(d.getFullYear() + offset);
  return d;
}

export function moveMonth(d: Date, offset = 0) {
  d.setMonth(d.getMonth() + offset);
  return d;
}

export function moveDate(d: Date, offset = 0) {
  d.setDate(d.getDate() + offset);
  return d;
}

/***
 * @param d 日期对象
 * @return 本月有多少天
 */
export function countMonthDay(d: Date) {
  let d1 = new Date(d);
  d1.setDate(32); // Move to next Month
  d1.setDate(0); // 0 -> back to prev month last day
  return d1.getDate();
}

export function moveToLastDateOfMonth(d: Date) {
  d.setDate(1);
  // Move to next Month
  moveMonth(d, 1);
  // 0 -> back to prev month last day
  d.setDate(0);
  return d;
}

export function createDate(d: Date, offset = 0) {
  let d2 = new Date(d);
  d2.setDate(d2.getDate() + offset);
  return d2;
}

export function isSameDate(
  d1?: Date | null | undefined,
  d2?: Date | null | undefined
) {
  if (!d1 || !d2) {
    return false;
  }
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

export function isInMonth(
  d1?: Date | null | undefined,
  d2?: Date | null | undefined
) {
  if (!d1 || !d2) {
    return false;
  }
  return (
    d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth()
  );
}

export function parseTime(
  input: TimeInput,
  unit: TimeUpdateUnit = "ms",
  tz?: DateParseOptionsZone
): TiTime {
  return new TiTime(input, unit, tz);
}

const I_DAYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
const I_WEEK = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];
const WEEK_DAYS = {
  sun: 0,
  mon: 1,
  tue: 2,
  wed: 3,
  thu: 4,
  fri: 5,
  sat: 6,
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
} as {
  [k: string]: number;
};
const MONTH_ABBR = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const MONTH_NAME = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

///////////////////////////////////////////
