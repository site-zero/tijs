import _ from 'lodash';

/**
 * 获取两个数的最大公约数
 * > greatest common divisor(gcd)
 *
 * @param a 数A
 * @param b 数B
 * @returns 最大公约数
 */
export function gcd(a: number, b: number) {
  a = Math.round(a);
  b = Math.round(b);
  if (b) {
    return gcd(b, a % b);
  }
  return a;
}

/**
 * 获取一组数的最大公约数
 *
 * @param args 一组数
 * @returns 最大公约数
 */
export function gcds(...args: number[]) {
  let list = _.flatten(args);
  // 没数
  if (list.length == 0) return NaN;
  // 一个是自己
  if (list.length == 1) {
    return list[0];
  }
  // 两个以上
  let _gcd = gcd(list[0], list[1]);
  for (var i = 2; i < list.length; i++) {
    _gcd = gcd(_gcd, list[i]);
  }
  // 返回
  return _gcd;
}

/**
 * 获取两个数的最小公倍数
 * > lowest common multiple (LCM)
 *
 * @param a 数A
 * @param b 数B
 * @returns 最大公约数
 */
export function lcm(a: number, b: number) {
  a = Math.round(a);
  b = Math.round(b);
  return (a * b) / gcd(a, b);
}

/**
 * 获取一组数的最小公倍数
 *
 * @param args 一组数
 * @returns 最小公倍数
 */
export function lcms(...args: number[]) {
  let list = _.flatten(args);
  // 没数
  if (list.length == 0) return NaN;
  // 一个是自己
  if (list.length == 1) {
    return list[0];
  }
  // 两个以上
  let _lcm = lcm(list[0], list[1]);
  for (var i = 2; i < list.length; i++) {
    _lcm = lcm(_lcm, list[i]);
  }
  // 返回
  return _lcm;
}
