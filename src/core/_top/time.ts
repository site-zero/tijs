import _ from "lodash";
import { TimeInfo } from "./_types";


type TimeInput = number | string | Date | TimeInfo;

type TimeCache = {
  value?: number;
  valueInMilliseconds?: number;
};

export class TiTime implements TimeInfo {
  hours = 0;
  minutes = 0;
  seconds = 0;
  milliseconds = 0;
  __cached: TimeCache = {};

  //--------------------------------
  constructor(input: TimeInput, unit?: string) {
    this.update(input, unit);
  }
  //--------------------------------
  clone() {
    return new TiTime(this);
  }
  //--------------------------------
  // If move attr into constructor, TBS will be supported
  // But the setter will be invoked infinitely
  setHours(hours = 0) {
    this.__cached = {};
    this.hours = _.clamp(hours, 0, 23);
  }
  setMinutes(minutes = 0) {
    this.__cached = {};
    this.minutes = _.clamp(minutes, 0, 59);
  }
  setSeconds(seconds = 0) {
    this.__cached = {};
    this.seconds = _.clamp(seconds, 0, 59);
  }
  setMilliseconds(ms = 1) {
    this.__cached = {};
    this.milliseconds = _.clamp(ms, 0, 999);
  }
  //--------------------------------
  setTimes(info?: TimeInfo) {
    let { hours, minutes, seconds, milliseconds } = info || {};
    this.__cached = {};
    this.hours = _.clamp(hours ?? this.hours, 0, 23);
    this.minutes = _.clamp(minutes ?? this.minutes, 0, 59);
    this.seconds = _.clamp(seconds ?? this.seconds, 0, 59);
    this.milliseconds = _.clamp(milliseconds ?? this.milliseconds, 0, 999);
  }
  //--------------------------------
  update(input: TimeInput, unit = "ms") {
    this.__cached = {};
    // Date
    if (_.isDate(input)) {
      this.hours = input.getHours();
      this.minutes = input.getMinutes();
      this.seconds = input.getSeconds();
      this.milliseconds = input.getMilliseconds();
    }
    // Time
    else if (input instanceof TiTime) {
      this.hours = input.hours;
      this.minutes = input.minutes;
      this.seconds = input.seconds;
      this.milliseconds = input.milliseconds;
    }
    // Number as Seconds
    else if (_.isNumber(input)) {
      const FNS0 = {
        "ms": (v) => Math.round(v),
        "s": (v) => Math.round(v * 1000),
        "min": (v) => Math.round(v * 1000 * 60),
        "hr": (v) => Math.round(v * 1000 * 60 * 60)
      } as {
        [k: string]: { (v: number): number };
      };
      let ms = FNS0[unit](input);
      ms = _.clamp(ms, 0, 86400000);
      let sec = Math.floor(ms / 1000);
      this.milliseconds = ms - sec * 1000;
      this.hours = Math.floor(sec / 3600);

      sec -= this.hours * 3600;
      this.minutes = Math.floor(sec / 60);
      this.seconds = sec - this.minutes * 60;
    }
    // String
    else if (_.isString(input)) {
      // ISO 8601 Time
      let m = /^PT((\d+)H)?((\d+)M)?((\d+)S)?$/.exec(input);
      if (m) {
        this.hours = m[2] ? parseInt(m[2]) : 0;
        this.minutes = m[4] ? parseInt(m[4]) : 0;
        this.seconds = m[6] ? parseInt(m[6]) : 0;
        this.milliseconds = 0;
        return this;
      }

      // Time string
      m =
        /^([0-9]{1,2}):?([0-9]{1,2})(:?([0-9]{1,2})([.,]([0-9]{1,3}))?)?$/.exec(
          input
        );
      if (m) {
        // Min: 23:59
        if (!m[3]) {
          this.hours = _.clamp(parseInt(m[1]), 0, 23);
          this.minutes = _.clamp(parseInt(m[2]), 0, 59);
          this.seconds = 0;
          this.milliseconds = 0;
        }
        // Sec: 23:59:59
        else if (!m[5]) {
          this.hours = _.clamp(parseInt(m[1]), 0, 23);
          this.minutes = _.clamp(parseInt(m[2]), 0, 59);
          this.seconds = _.clamp(parseInt(m[4]), 0, 59);
          this.milliseconds = 0;
        }
        // Ms: 23:59:59.234
        else {
          this.hours = _.clamp(parseInt(m[1]), 0, 23);
          this.minutes = _.clamp(parseInt(m[2]), 0, 59);
          this.seconds = _.clamp(parseInt(m[4]), 0, 59);
          this.milliseconds = _.clamp(parseInt(m[6]), 0, 999);
        }
      } // if(m)
    } // _.isString(input)

    return this;
  } // update(input, unit="ms")
  //--------------------------------
  get value() {
    if (!_.isNumber(this.__cached.value)) {
      let val =
        this.hours * 3600 +
        this.minutes * 60 +
        this.seconds +
        Math.round(this.milliseconds / 1000);
      this.__cached.value = val;
    }
    return this.__cached.value;
  }
  //--------------------------------
  get valueInMilliseconds() {
    if (!_.isNumber(this.__cached.valueInMilliseconds)) {
      let val =
        this.hours * 3600000 +
        this.minutes * 60000 +
        this.seconds * 1000 +
        this.milliseconds;
      this.__cached.valueInMilliseconds = val;
    }
    return this.__cached.valueInMilliseconds;
  }
  //--------------------------------
  toString(fmt = "auto") {
    // Auto
    if ("auto" == fmt) {
      fmt =
        this.milliseconds > 0
          ? "HH:mm:ss.SSS"
          : this.seconds > 0
          ? "HH:mm:ss"
          : "HH:mm";
    }
    // To Min
    else if ("min" == fmt) {
      fmt = this.hours <= 0 ? "mm:ss" : "HH:mm:ss";
    }
    const _S = (n: number) => n.toString();
    const FNS1 = {
      "a": () => (this.value > 43200 ? "PM" : "AM"), // am|pm
      "H": () => this.hours, // Hour in day (0-23)
      "k": () => this.hours + 1, // Hour in day (1-24)
      "K": () => this.hours % 12, // Hour in am/pm (0-11)
      "h": () => (this.hours % 12) + 1, // Hour in am/pm (1-12)
      "m": () => this.minutes, // Minute in hour
      "s": () => this.seconds, // Second in minute
      "S": () => this.milliseconds, // Millisecond Number
      "HH": () => _.padStart(_S(this.hours), 2, "0"),
      "kk": () => _.padStart(_S(this.hours + 1), 2, "0"),
      "KK": () => _.padStart(_S(this.hours % 12), 2, "0"),
      "hh": () => _.padStart(_S((this.hours % 12) + 1), 2, "0"),
      "mm": () => _.padStart(_S(this.minutes), 2, "0"),
      "ss": () => _.padStart(_S(this.seconds), 2, "0"),
      "SSS": () => _.padStart(_S(this.milliseconds), 3, "0")
    } as {
      [k: string]: { (): number | string };
    };
    // Formatting
    let sb = "";
    let ptn = /a|HH?|KK?|hh?|kk?|mm?|ss?|S(SS)?/g;
    let pos = 0;
    let m;
    while ((m = ptn.exec(fmt))) {
      let l = m.index;
      // Join the prev part
      if (l > pos) {
        sb += fmt.substring(pos, l);
      }
      pos = ptn.lastIndex;

      // Replace
      let s = m[0];
      sb += FNS1[s]();
    } // while (m = reg.exec(fmt))
    // Ending
    if (pos < fmt.length) {
      sb += fmt.substring(pos);
    }
    // Done
    return sb;
  }
  //--------------------------------
}
