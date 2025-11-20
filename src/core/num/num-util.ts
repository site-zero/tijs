import _ from "lodash";
import { Limitation } from "../../_type";

/**
 * Translate
 * - "1-50" to {limit:50,skip:0}
 * - "51-80" to {limit:30,skip:50}
 * @param {String} scope: such as "1-50"
 * @param {Object} dft: Return defautly if scope invlaid.
 * throw Error when it is undefined
 */
export function scopeToLimit(scope: string, dft: Limitation): Limitation {
  let m = /^([1-9]\d*)[:,_-](\d+)$/.exec(_.trim(scope));
  if (!m) {
    if (!dft) {
      throw new Error(`e-data-InvalidScope : ${scope}`);
    }
    return dft;
  }
  let n0 = Math.max(parseInt(m[1]), 1);
  let n1 = Math.max(parseInt(m[2]), 0);
  let from = Math.min(n0, n1);
  let to = Math.max(n0, n1);
  let skip = Math.max(0, from - 1);
  let limit = to - skip;
  //console.log(skip, limit);

  if (limit <= 0 || skip < 0) {
    throw new Error(`e-data-InvalidScope : ${scope}`);
  }

  return { limit, skip };
}

/***
 * Fill array from given number.
 * It will mutate the input array
 *
 * @param source - source array
 * @param startValue - The begin number to fill
 * @param len - how may items should be filled
 * @param step - Number increasement
 *
 * @return the source array passed in
 */
export function fillSteps(
  source: any[],
  startValue = 0,
  { len, step = 1 } = {} as {
    len?: number;
    step?: number;
  }
): any[] {
  len = len ?? source.length;
  for (let i = 0; i < len; i++) {
    source[i] = startValue + i * step;
  }
  return source;
}
/***
 *
 * ```
 * scrollIndex( 3, 5) => 3
 * scrollIndex( 0, 5) => 0
 * scrollIndex( 4, 5) => 4
 * scrollIndex( 5, 5) => 0
 * scrollIndex( 6, 5) => 1
 * scrollIndex(-1, 5) => 4
 * scrollIndex(-5, 5) => 0
 * scrollIndex(-6, 5) => 4
 * scrollIndex(-5, 5) => 0
 * ```
 */
export function scrollIndex(index: number, len = 0): number {
  if (len > 0) {
    let md = index % len;
    return md >= 0 ? md : len + md;
  }
  return -1;
}
/***
 * @param n{Number} input number
 * @param p{Number} precise bit
 *
 * @return The number after tidy
 */
export function precise(n: number, p = 2) {
  if (p >= 0) {
    var y = Math.pow(10, p);
    return Math.round(n * y) / y;
  }
  return n;
}

export function round(n: number, precision = 100) {
  if (precision === 0) {
    return n;
  }
  return Math.round(n * precision) / precision;
}

export function floor(n: number, precision = 100) {
  if (precision === 0) {
    return n;
  }
  return Math.floor(n * precision) / precision;
}

export function ceil(n: number, precision = 100) {
  if (precision === 0) {
    return n;
  }
  return Math.ceil(n * precision) / precision;
}

/***
 * @param n{Number} input number
 * @param unit{Number} the number padding unit
 *
 * @return The number pad to unit
 */
export function padTo(n: number, unit = 1) {
  if (unit > 1) {
    let x = Math.round(n / unit);
    return x * unit;
  }
  return n;
}

/***
 * @param v{Number} input number
 * @param unit{Number} number unit
 *
 * @return new ceil value for unit
 */
export function ceilUnit(v: number, unit = 1) {
  if (unit > 1) {
    let n = Math.ceil(v / unit);
    return n * unit;
  }
  return v;
}

/***
 * @param v{Number} input number
 * @param unit{Number} number unit
 *
 * @return new floor value for unit
 */
export function floorUnit(v: number, unit = 1) {
  if (unit > 1) {
    let n = Math.floor(v / unit);
    return n * unit;
  }
  return v;
}
