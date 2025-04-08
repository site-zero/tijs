import { anyToStr, splitIgnoreBlank } from './text/ti-str';

const _API = {
  anyToStrArray: (input: any) => {
    let str = anyToStr(input);
    return splitIgnoreBlank(str, ',');
  },
  arrayToStr: (arr: any[]) => {
    let ss = [];
    for (let v of arr) {
      ss.push(anyToStr(v));
    }
    return ss.join(',');
  },
};

export function getGUIExplainContext() {
  return _API;
}
