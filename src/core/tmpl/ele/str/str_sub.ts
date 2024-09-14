import { StrConvertor } from '../../../../_type';

/**
 * 根据配置，返回一个字符串截取函数。
 *
 * 它的规则如下
 *
 * - `@sub=2/` => [2,NaN] 表示 substring(2)
 * - `@sub=5` => [5]  表示 substring(0,5)
 * - `@sub=/5` => [NaN,5] 表示 substring(0,5)
 * - `@sub=2/8` => [2,8] 表示 substring(2,8)
 *
 * @param input - 截取信息的配置字符串，
 * 格式为：`{from}/{len}`，或者
 * @returns 返回一个函数，该函数用于对字符串进行子字符串截取。
 */
export function str_sub(input: string): StrConvertor {
  let poss = input.split('/').map((v) => parseInt(v, 10));
  let [from, to] = poss;

  // @sub=2/ => [2,NaN] 表示 substring(2)
  if (poss.length > 1 && isNaN(to)) {
    return (s) => s.substring(from);
  }

  // @sub=5 => [5]  表示 substring(0,5)
  if (poss.length == 1) {
    to = from;
    from = 0;
  }
  // @sub=/5 => [NaN, 5]  表示 substring(0,5)
  // @sub=2/8` => [2,8] 表示 substring(2,8)
  else if (isNaN(from)) {
    from = 0;
  }

  // @sub=2/8 => [2,8] 表示 substring(2,8)
  return (s) => s.substring(from, to);
}
