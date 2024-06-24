import _ from 'lodash';
import { Match, NumRange } from '../';
import { DictImpl } from './dict-impl';
import {
  GetItemText,
  GetItemValue,
  IDict,
  LoadDictItem,
  QueryDictItems,
  IsMatched,
} from './dict-types';

export function dft_get_item<T, V>(): LoadDictItem<T, V> {
  return (dict: IDict<T, V>, val: V, signal?: AbortSignal) => {
    return new Promise((resolve, reject) => {
      dict
        .getData(false, signal)
        .then((list) => {
          for (let li of list) {
            let v = dict.getItemValue(li);
            if (_.isEqual(v, val)) {
              resolve(li);
              return;
            }
          }
          resolve(undefined);
        })
        .catch((reason) => {
          reject(reason);
        });
    });
  };
}

export function dft_query<T, V>(): QueryDictItems<T, V, any> {
  return (dict: IDict<T, V>, val: any, signal?: AbortSignal) => {
    return new Promise((resolve, reject) => {
      dict
        .getData(false, signal)
        .then((list) => {
          let re = [] as T[];
          for (let li of list) {
            if (dict.isMatched(li, val)) {
              re.push(li);
            }
          }
          resolve(re);
        })
        .catch((reason) => {
          reject(reason);
        });
    });
  };
}

export function dft_children<T, V>(): QueryDictItems<T, V, V> {
  // 默认的 get_children 就是什么都不获取
  return (_dict: IDict<T, V>, _v: V, _signal?: AbortSignal) => {
    return new Promise((resolve) => {
      let re = [] as T[];
      resolve(re);
    });
  };
}

export function dft_get_value<T, V>(): GetItemValue<T, V> {
  return (it: T): V => {
    let re = _.get(it, 'value') as V;
    return re;
  };
}

export function dft_get_str<T>(key: string): GetItemText<T> {
  return (it: T): string => {
    let re = _.get(it, key) as string;
    return re;
  };
}

export function dft_is_matched<T, V>(dict: DictImpl<T, V>): IsMatched<T, V> {
  return (it: T, val: V): boolean => {
    let std = dict.toStdItem(it);
    // 字符串
    if (_.isString(val)) {
      let text = std.text.toLowerCase();
      let vals = (std.value + '').toLowerCase();
      // 支持正则
      if (val.startsWith('^')) {
        let reg = new RegExp(val, 'ig');
        return reg.test(text) || reg.test(vals);
      }
      // 支持范围
      if (/^[[(]/.test(val) && /[)\]]$/.test(val)) {
        let rg = new NumRange(val);
        let n = parseFloat(vals);
        return rg.contains(n);
      }
      // 普通字符串
      else {
        let mts = `${val}`.toLowerCase();
        if (text.indexOf(mts) >= 0 || vals.indexOf(mts) >= 0) {
          return true;
        }
      }
      return false;
    }
    // 采用匹配
    let m = Match.parse(val);
    return m.test(std.value) || m.test(std.text);
  };
}
