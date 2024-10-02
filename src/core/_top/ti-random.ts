import _ from 'lodash';

const CHAR_62 =
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghijklmnopqrstuvwxyz'.split('');
const CHAR_36 = '0123456789abcdefghijklmnopqrstuvwxtz'.split('');
/***
 * Generator `N` length random string
 */
export function getRandomStr(n = 4) {
  let s = '';
  for (let i = 0; i < n; i++) {
    let index = _.random(0, CHAR_62.length - 1);
    s += CHAR_62[index];
  }
  return s;
}

export function getRandomS36(n = 4) {
  let s = '';
  for (let i = 0; i < n; i++) {
    let index = _.random(0, CHAR_36.length - 1);
    s += CHAR_36[index];
  }
  return s;
}

export function getRandomObj<T>(dict: T[]) {
  let index = _.random(0, dict.length - 1);
  return dict[index];
}

export function getRandomList<T>(input: T[] = [], n = input.length) {
  let last = Math.min(n, input.length) - 1;
  for (; last > 0; last--) {
    let index = _.random(0, last);
    let lo = input[last];
    let li = input[index];
    input[last] = li;
    input[index] = lo;
  }
  return input;
}
