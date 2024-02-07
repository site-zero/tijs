import _ from 'lodash';
import { Str, StrConvertor } from '../../../ti';

export function str_replace(input: string): StrConvertor {
  let args = Str.splitQuote(input, {
    ignoreBlank: true,
    keepQuote: false,
    seps: ',',
  });
  if (_.isEmpty(args)) {
    return (s) => s;
  }
  let [s0, s1] = args;
  let reg = new RegExp(s0, 'g');
  if (1 == args.length) {
    return (s) => s.replace(reg, '');
  }

  return (s) => s.replace(reg, s1);
}
