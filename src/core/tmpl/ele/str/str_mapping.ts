import _ from 'lodash';
import { Str, MessageMap, StrConvertor } from '../../../ti';

export function str_mapping(input: string): StrConvertor {
  let mapping = {} as MessageMap;
  let ss = Str.splitQuote(input, {
    ignoreBlank: false,
    keepQuote: false,
    seps: ',',
  });
  for (let s of ss) {
    let m = /^([^=]+)=(.*)$/.exec(s);
    if (m) {
      let [_, k, v] = m;
      mapping[k] = v;
    }
  }

  return (s) => mapping[s] ?? s;
}
