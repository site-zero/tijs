import _ from 'lodash';
import { I18n, Str, TiTime, getEnv } from '../';
import {
  DateFormatOptions,
  DateInput,
  TimeInput,
  TimeUpdateUnit,
} from '../../_type';

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
  '^((\\d{2,4})([^0-9])?(\\d{1,2})?([^0-9])?(\\d{1,2})?)?([^0-9])?' +
    '(([ T])?' +
    '(\\d{1,2})(:)(\\d{1,2})((:)(\\d{1,2}))?' +
    '((.)(\\d{1,3}))?)?' +
    '(([+-])(\\d{1,2})(:\\d{1,2})?)?' +
    '(Z(\\d*))?$'
);

export function parse(d: undefined | null | []): undefined;
export function parse(d: DateInput): Date;

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
 * @returns  日期对象
 */
export function parse(d: any): Date | undefined {
  if (_.isNil(d) || Str.isBlank(d)) {
    return;
  }
  //console.log("parseDate:", d)
  // Default return today
  if ('now' === d) {
    return new Date();
  }
  if ('today' === d) {
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
  if (_.isString(d)) {
    let str = _.trim(d);

    if ('2024-05-14 19:24:29.000' == str) {
      console.log('!!!DateTime.parse', str);
    }
    // MS
    if (/\d{13,}/.test(str)) {
      return new Date((str as any) * 1);
    }
    // Try to tidy string
    let m = P_DATE.exec(str);
    if (m) {
      let _int = (m: string[], index: number, dft: number) => {
        let s = m[index];
        if (s) {
          return parseInt(s);
        }
        return dft;
      };

      let today = new Date();
      let year = m[2];
      if (year.length == 2) {
        year = '20' + year;
      }
      let yy: number = parseInt(year);
      let MM: number = _int(m, 4, m[2] ? 1 : today.getMonth() + 1);
      let dd: number = _int(m, 6, m[2] ? 1 : today.getDate());
      let HH: number = _int(m, 10, 0);
      let mm: number = _int(m, 12, 0);
      let ss: number = _int(m, 15, 0);
      let ms: number = _int(m, 18, 0);
      let list = [
        _.padStart(yy as unknown as string, 4, '0'),
        '-',
        _.padStart(MM as unknown as string, 2, '0'),
        '-',
        _.padStart(dd as unknown as string, 2, '0'),
        'T',
        _.padStart(HH as unknown as string, 2, '0'),
        ':',
        _.padStart(mm as unknown as string, 2, '0'),
        ':',
        _.padStart(ss as unknown as string, 2, '0'),
        '.',
        _.padStart(ms as unknown as string, 3, '0'),
      ];
      let dateStr = list.join('');
      let date = new Date(dateStr);

      // Compare TimeZone with remote
      let tzDiff = getEnv('TIMEZONE_DIFF');
      if (_.isNumber(tzDiff) && tzDiff !== 0) {
        date = new Date(date.getTime() - tzDiff);
      }

      return date;
    }
  }
  // Invalid date
  console.trace();
  throw `i18n:invalid-date: [${Str.anyToStr(d)}]`;
}

export type DateTimeQuickParseOptions = {
  /**
   * 假设今年是 2024 年
   *
   * 模式: ymd
   * [yy?yy] [mm] [dd]
   *  - 2408 -> 2024-08-01
   *  - 240806 -> 2024-08-06
   *  - 20240806 -> 2024-08-06
   *
   * 模式: dmy
   * [dd] [mm] [yy?yy]
   *  - 1908 -> 2024-08-19
   *  - 190828 -> 2028-08-19
   *  - 19082028 -> 2028-08-19
   */
  mode?: 'ymd' | 'dmy';
};

/**
 * 根据一个简洁的输入，解析出一个日期对象
 *
 * @param input 简洁的日期输入
 * @return  日期对象
 */
export function quickParse(
  _input: string,
  options: DateTimeQuickParseOptions = {}
): Date | undefined {
  let s = _.trim(_input);
  if (!s) return;
  let { mode = 'dmy' } = options;
}

/**
 *
 * @param date  日期值
 * @returns  用来格式化日期的上下文变量
 */
export function genFormatContext(date: any) {
  if (!_.isDate(date)) {
    date = parse(date);
  }
  // Guard it
  if (!date) return {};

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
  let m_i = date.getMonth();
  let yyyy = date.getFullYear();
  let M = m_i + 1;
  let d = date.getDate();
  let H = date.getHours();
  let m = date.getMinutes();
  let s = date.getSeconds();
  let S = date.getMilliseconds();

  let Mmm = MONTH_ABBR[m_i];
  let MMM = Mmm.toUpperCase();
  let MMMM = I18n.get(`month-${Mmm}`);

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
    yy: ('' + yyyy).substring(2, 4),
    MM: _.padStart(M, 2, '0'),
    dd: _.padStart(d, 2, '0'),
    HH: _.padStart(H, 2, '0'),
    mm: _.padStart(m, 2, '0'),
    ss: _.padStart(s, 2, '0'),
    SS: _.padStart(S, 3, '0'),
    SSS: _.padStart(S, 3, '0'),
    E,
    EE: E,
    EEE: E,
    EEEE,
    MMM,
    Mmm,
    MMMM,
  };
}

export function format(
  date: undefined | null,
  options?: DateFormatOptions
): undefined;
export function format(date: DateInput, options?: DateFormatOptions): string;
export function format(
  date: DateInput[],
  options?: DateFormatOptions
): string[];

/**
 * 格式化输出日期时间对象
 * 
 * @param date 日期值
 * @param fmt 格式化模板
 * @param trimZero 是否自动剪裁，即如果是 `2023-09-21 00:00:00` 会输出 `2023-09-21`

 * @returns 
 */
export function format(
  date: DateInput | DateInput[] | null | undefined,
  options: DateFormatOptions = {}
): string | string[] | undefined {
  if (_.isNil(date)) {
    return;
  }

  let { fmt = 'yyyy-MM-dd HH:mm:ss', trimZero = false } = options;
  // Date Range or a group of date
  if (_.isArray(date)) {
    //console.log("formatDate", date, fmt)
    let list = [] as string[];
    for (let d of date) {
      list.push(format(d, { fmt, trimZero }) as string);
    }
    return list;
  }

  if (!_.isDate(date)) {
    date = parse(date);
  }
  // Guard it
  if (!date) {
    return;
  }

  // Compare TimeZone with remote
  let tzDiff = getEnv('TIMEZONE_DIFF');
  if (_.isNumber(tzDiff) && tzDiff !== 0) {
    date = new Date(date.getTime() + tzDiff);
  }

  let _c = genFormatContext(date);
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
  let re = list.join('');
  // if end by 00:00:00 then auto trim it
  if (trimZero && re.endsWith(' 00:00:00')) {
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
      'any-time': string;
      'in-year': string;
      'past-in-min': string;
      'past-in-hour': string;
      'past-in-day': string;
      'past-in-week': string;
      'future-in-min': string;
      'future-in-hour': string;
      'future-in-day': string;
      'future-in-week': string;
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
    'any-time': I18n.get('dt-any-time', 'yyyy-MM-dd'),
    'in-year': I18n.get('dt-in-year', 'MM-dd'),
    'past-in-min': I18n.get('dt-past-in-min', 'Just now'),
    'past-in-hour': I18n.get('dt-past-in-hour', 'In ${min}mins'),
    'past-in-day': I18n.get('dt-past-in-day', 'In ${hour}hours'),
    'past-in-week': I18n.get('dt-past-in-week', 'In ${day}days'),
    'future-in-min': I18n.get('dt-future-in-min', 'Soon'),
    'future-in-hour': I18n.get('dt-future-in-hour', 'After ${min}mins'),
    'future-in-day': I18n.get('dt-future-in-day', 'After ${hour}hours'),
    'future-in-week': I18n.get('dt-future-in-week', 'After ${day}days'),
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
    return at_past ? i18n['past-in-min'] : i18n['future-in-min'];
  }
  // in-hour
  if (du_min < 60) {
    let tmpl = at_past ? i18n['past-in-hour'] : i18n['future-in-hour'];
    return Str.renderTmpl(tmpl, { min: du_min });
  }
  //.....................................
  // in-day
  let du_hr = Math.round(du_ms / 3600000);
  if (du_hr < 24) {
    let tmpl = at_past ? i18n['past-in-day'] : i18n['future-in-day'];
    return Str.renderTmpl(tmpl, {
      min: du_min,
      hour: du_hr,
    });
  }
  //.....................................
  // in-week
  let du_day = Math.round(du_hr / 24);
  if (du_day < 7) {
    let tmpl = at_past ? i18n['past-in-week'] : i18n['future-in-week'];
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
    return format(d, { fmt: i18n['in-year'], trimZero: true });
  }
  //.....................................
  // any-time
  return format(d, { fmt: i18n['any-time'], trimZero: true });
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

/**
 *
 * @param d 日期对象
 * @param hours 时 `0-23`
 * @param minutes  分 `0-59`
 * @param seconds 秒 `0-59`
 * @param milliseconds 毫秒 `0-999`
 * @returns 日期对象自身
 */
export function setTime(
  d: Date,
  hours = 0,
  minutes = 0,
  seconds = 0,
  milliseconds = 0
) {
  if (_.inRange(hours, 0, 24)) {
    d.setHours(hours);
  }
  if (_.inRange(minutes, 0, 60)) {
    d.setMinutes(minutes);
  }
  if (_.inRange(seconds, 0, 60)) {
    d.setSeconds(seconds);
  }
  if (_.inRange(milliseconds, 0, 1000)) {
    d.setMilliseconds(milliseconds);
  }
  return d;
}

/**
 * 将日期对象的时间设置为当天的最后一个毫秒
 *
 * @param d 日期对象
 * @returns 日期对象自身
 */
export function setDayLastTime(d: Date) {
  return setTime(d, 23, 59, 59, 999);
}

/**
 * 得到今天的开始时间对象
 *
 * @returns 日期对象自身
 */
export function today() {
  return setTime(new Date());
}

/**
 * 得到今天的开始时间的绝对毫秒数
 *
 * @returns 绝对毫秒数
 */
export function todayInMs() {
  return today().getTime();
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

export function parseTime(
  input: TimeInput,
  unit: TimeUpdateUnit = 'ms'
): TiTime {
  return new TiTime(input, unit);
}

const I_DAYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
const I_WEEK = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
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
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

///////////////////////////////////////////
