import _ from 'lodash';
import { splitIgnoreBlank, splitQuote } from '../text/ti-str';
import { AnyTester, AnyGetter } from '../ti';

export type GetOptions = {
  test?: AnyTester;
  enableKeyPath?: boolean;
  dft?: any;
};

/**
 * 根据输入的键路径，生成对象的值获取函数，支持的路径格式如下:
 *
 * - `abc` :  一个键名称，会获取对象下面该键的值
 * - `abc[1]` :  获取 abc 键下第二个元素
 * - `a.b.c` : 一个键路径，用半角点分隔，表示读取对象下 `a` 下的 `b` 的 `c` 键的值
 * - `a[0].names[4].val` : 可以支持混合模式
 *
 * @param input 对象键路径
 *
 * @return 获取对象键值的包裹函数
 */
export function genObjPathGetter(input: string): AnyGetter {
  let keyPath = splitQuote(input, {
    seps: '.',
    keepQuote: false,
    ignoreBlank: true,
  });
  let getters = [] as AnyGetter[];
  for (let key of keyPath) {
    // 数组形式 name[3]
    let m = /^([^[\]]+)\[(\d+)\]$/.exec(key);
    if (m) {
      let k = m[1];
      let I = parseInt(m[2]);
      getters.push((obj) => obj[k]);
      getters.push((obj) => obj[I]);
    }
    // 普通获取模式
    else {
      getters.push((obj) => obj[key]);
    }
  }
  return (obj) => {
    let re = obj;
    for (let getter of getters) {
      re = getter(re);
      if (!re) {
        return re;
      }
    }
    return re;
  };
}

/**
 * 根据输入的键路径，生成对象的值获取函数，支持的路径格式如下:
 *
 * - `a|b|c` :  竖线分隔的键名，表示 fallback 尝试，
 *   一旦一个键对应的值被回调函数 `test` 判断为 `true` 则立即返回
 * - `a.b.c|x.y.z` : 每个 fallback 的键名，都支持路径获取的方式，
 *   如果你想关闭这个特性，可以把 enableKeyPath 设置为 `true`
 * @param input 对象键路径
 * @param options 函数的行为配置，它支持下面的配置项：
 *
 *  - `test` 判断对象的值是否可以返回，默认，只要不是 `undefined` 和 `null` 都返回 `true`。
 *    这个函数签名为 `(v:any):boolean`
 *  - `enableKeyPath` 是否开启路径键的支持，默认为 `true`
 *  - `dft` 如果最终获取不到任何值（test失败），那么返回什么默认值，默认为 `undefined`
 *
 * @return 获取对象键值的包裹函数
 */
export function genObjGetter(
  input: string,
  options = {} as GetOptions,
): AnyGetter {
  let { test = (v) => !_.isNil(v), enableKeyPath = true, dft } = options;

  let keyFallback = splitIgnoreBlank(input, '|');
  let keyGetters = [] as AnyGetter[];
  for (let key of keyFallback) {
    let getter: AnyGetter;
    if (enableKeyPath) {
      getter = genObjPathGetter(key);
    } else {
      getter = (obj) => obj[key];
    }
    keyGetters.push(getter);
  }

  return (obj) => {
    for (let getter of keyGetters) {
      let v = getter(obj);
      if (test(v)) {
        return v;
      }
    }
    return dft;
  };
}
