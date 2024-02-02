import _ from "lodash";
import { Match } from "../ti";
import { DictImpl } from "./dict-impl";
import {
  GetItemText,
  GetItemValue,
  IDict,
  LoadDictItem,
  QueryDictItems,
  IsMatched
} from "./dict-types";

export function dft_get_item<T, V>(): LoadDictItem<T, V> {
  return (dict: IDict<T, V>, val: V) => {
    return new Promise((resolve, reject) => {
      dict
        .getData(false)
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
  return (dict: IDict<T, V>, val: any) => {
    return new Promise((resolve, reject) => {
      dict
        .getData(false)
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
  return (_dict: IDict<T, V>, _v: V) => {
    return new Promise((resolve) => {
      let re = [] as T[];
      resolve(re);
    });
  };
}

export function dft_get_value<T, V>(): GetItemValue<T, V> {
  return (it: T): V => {
    let re = _.get(it, "value") as V;
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
    let text = std.text.toLowerCase();
    let vals = (std.value + "").toLowerCase();
    let am = Match.parse(val);
    if (
      am.test(std.text) ||
      am.test(std.value) ||
      am.test(text) ||
      am.test(vals)
    ) {
      return true;
    }
    return false;
  };
}
