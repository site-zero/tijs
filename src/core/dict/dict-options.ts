import _ from 'lodash';
import { Match, AnyGetter, Util } from '../ti';
import { IDict, LoadData, LoadDictItem, QueryDictItems } from './dict-types';

export function _gen_item_loader(input: any): LoadDictItem<any, any> {
  // 如果是个函数
  if (_.isFunction(input)) {
    return (_dict: IDict<any, any>, val: any) =>
      new Promise<any[]>(async (resolve) => {
        let item = await input(val);
        resolve(item);
      });
  }
  // 其他的变成匹配条件
  let am = Match.parse(input);
  return (dict: IDict<any, any>, _val: any) =>
    new Promise<any[]>(async (resolve) => {
      let list = await dict.getData();
      let re: any;
      for (let li of list) {
        if (am.test(li)) {
          re = li;
          return;
        }
      }
      resolve(re);
    });
}

export function _gen_data_query(query: any): QueryDictItems<any, any, any> {
  // 如果是个函数
  if (_.isFunction(query)) {
    return (_dict: IDict<any, any>, input: any, signal?: AbortSignal) =>
      new Promise<any[]>(async (resolve) => {
        let list = await query(input, signal);
        resolve(list);
      });
  }
  // 其他的变成匹配条件
  return (dict: IDict<any, any>, input: any, signal?: AbortSignal) =>
    new Promise<any[]>(async (resolve) => {
      let str = _.trim(input).toLowerCase();
      let list = await dict.getData(false, signal);
      let re = [] as any[];
      for (let li of list) {
        if (!li) {
          continue;
        }
        if (dict.isMatched(li, str)) {
          re.push(li);
        }
      }
      resolve(re);
    });
}

export function _gen_data_loader(input: any): LoadData<any> {
  // 对于数组，静态值，直接返回
  if (_.isArray(input)) {
    return () => Util.wrapPromise(input as any[]);
  }
  // 如果是个函数
  if (_.isFunction(input)) {
    return (signal?: AbortSignal) =>
      new Promise<any[]>(async (resolve) => {
        let data = await input(signal);
        resolve(data);
      });
  }
  // 其他的不支持
  throw new Error('Fail to _gen_data_loader by ' + input);
}

export function _gen_dict_opt_getter(input: string | AnyGetter): AnyGetter {
  if (_.isFunction(input)) {
    return input;
  }
  return Util.genObjGetter(input, {
    test: (v: any) => !_.isNil(v),
    enableKeyPath: true,
    dft: undefined,
  });
}
