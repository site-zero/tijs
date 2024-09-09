import { StrConvertor } from '../../../../_type';

/**
 * 根据配置，返回一个字符串截取函数。
 *
 * @param input - 截取信息的配置字符串，
 * 格式为：`{from}/{len}`，或者
 * @returns 返回一个函数，该函数用于对字符串进行子字符串截取。
 */
export function str_sub(input: string): StrConvertor {
  let poss = input.split('/');
  let [from, len] = poss.map((v) => parseInt(v));
  // @sub=5  表示 substring(0,5)
  if (isNaN(len) || len < 0) {
    len = from;
    from = 0;
  }
  return (s) => s.substring(from, len);
}
