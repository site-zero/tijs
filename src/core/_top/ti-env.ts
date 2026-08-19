import _ from "lodash";
import * as PKG from "../../../package.json";
import { DateParseOptionsZone, TiBus, Vars } from "../../_type";

export const version = PKG.version;

const _ENV = {
  version,
  dev: false,
  appName: null,
  session: {},
  ALL_BUS: new Map<string, TiBus<any>>(),
  log: {
    ROOT: 0,
  },
} as Vars;

export const ENV_KEYS = {
  DFT_DATETIME_FORMAT: "TI_DFT_DATETIME_FORMAT",
  DFT_DATE_FORMAT: "TI_DFT_DATE_FORMAT",
  TIMEZONE: "TIMEZONE",
  TIMEZONE_OFFSET: "TIMEZONE_OFFSET",
};

export function assignEnv(input: Vars) {
  _.assign(_ENV, input);
}

export function setEnv(key: string, val: any) {
  _.set(_ENV, key, val);
}

export function getEnv<T>(key: string, dft?: T): T {
  return _.get(_ENV, key) ?? dft;
}

export function getAllEnv() {
  return _.cloneDeep(_ENV);
}

/**
 * 获取时区偏移量(小时)。
 *
 * @param tz 时区值，默认值为 "Z"。
 * 可以是 "Z" 表示协调世界时（UTC），
 * 也可以是一个数字表示时区偏移量（以小时为单位）。
 * @returns 返回时区偏移量（以小时为单位）。
 * 如果 tz 为 "Z"，则返回 0；
 * 如果 tz 为数字，则返回该数字；
 * 否则抛出异常。
 */
export function getTimeZoneOffset(tz: DateParseOptionsZone = "Z") {
  if ("Z" == tz) {
    return 0;
  }
  // if("auto" == tz) {
  //   let tz = getEnv(ENV_KEYS.TIMEZONE_OFFSET) as number;
  //   return tz || 0;
  // }
  if (_.isNumber(tz)) {
    return tz;
  }
  throw `Invalid timezone: [${tz}]`;
}
