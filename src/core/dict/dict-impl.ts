import _ from 'lodash';
import { Callback1 } from '../../_type';
import { AbstractDict } from './dict-abstract';
import {
  dft_children,
  dft_get_item,
  dft_get_str,
  dft_get_value,
  dft_is_matched,
  dft_query,
} from './dict-impl-dft';
import {
  DictOptions,
  GetItemText,
  GetItemValue,
  IDict,
  IsMatched,
  LoadData,
  LoadDictItem,
  QueryDictItems,
} from './dict-types';

export class DictImpl<T, V> extends AbstractDict<T, V> implements IDict<T, V> {
  /* Async Function */
  private _data: LoadData<T>;
  private _item: LoadDictItem<T, V>;
  private _query: QueryDictItems<T, V, any>;
  private _children: QueryDictItems<T, V, V>;

  /* Sync function */
  private _get_value: GetItemValue<T, V>;
  private _get_text: GetItemText<T>;
  private _get_tip: GetItemText<T>;
  private _get_icon: GetItemText<T>;
  private _is_matched: IsMatched<T, V>;

  /* Cache */
  _cache_data: T[] = [];
  _cache_item: Map<V, T> = new Map<V, T>();

  /*DebugInfo*/
  __create_name: any = undefined;
  __create_options: any = undefined;

  /**
   * 如果第一个调用来了，那么就让这个队列变成一个数组
   * 以后再有调用，就加入这个数组
   * 等第一个调用完成了，会循环调用这个数组一遍通知回调
   */
  __loading_resolves: Callback1<any>[] | undefined = undefined;

  constructor(info: DictOptions<T, V>) {
    super();
    this._data = info.data;
    this._item = info.item ?? dft_get_item();
    this._query = info.query ?? dft_query();
    this._children = info.children ?? dft_children();

    this._get_value = info.getValue ?? dft_get_value();
    this._get_text = info.getText ?? dft_get_str('text');
    this._get_tip = info.getTip ?? dft_get_str('tip');
    this._get_icon = info.getIcon ?? dft_get_str('icon');
    this._is_matched = info.isMatched ?? dft_is_matched(this);

    this.__create_options = info;
  }

  async getData(force = false, signal?: AbortSignal): Promise<T[]> {
    //console.log('DictImpl.getData', this.__create_name);
    if (_.isEmpty(this._cache_data) || force) {
      // 之前已经有调用在加载了，那么这里就记录一下回调
      if (this.__loading_resolves) {
        let wait_queue = this.__loading_resolves;
        return new Promise<T[]>((resolve) => {
          wait_queue.push(resolve);
        });
      }

      // 标记一下加载
      this.__loading_resolves = [];

      // 存入缓存
      this._cache_data = await this._data(signal);
      for (let it of this._cache_data) {
        let v = this._get_value(it, -1);
        this._cache_item.set(v, it);
      }

      // 循环处理加载完成的回调
      let data = _.cloneDeep(this._cache_data);
      for (let resolve of this.__loading_resolves) {
        resolve(data);
      }

      // 清空加载标记
      this.__loading_resolves = undefined;
    }
    let re = _.cloneDeep(this._cache_data);
    return new Promise<T[]>((resolve) => {
      resolve(re);
    });
  }

  async getItem(val: V, signal?: AbortSignal): Promise<T | undefined> {
    let it = this._cache_item.get(val);
    if (!it) {
      it = await this._item(this, val, signal);
      if (it) {
        this._cache_item.set(val, it);
      }
    }
    return new Promise<T | undefined>((resolve) => {
      resolve(it);
    });
  }

  queryData(args: any[], signal?: AbortSignal): Promise<T[]> {
    if (_.isEmpty(args)) {
      return this.getData(false, signal);
    }
    return this._query(this, args, signal);
  }

  getChildren(v: V, signal?: AbortSignal): Promise<T[]> {
    return this._children(this, v, signal);
  }

  async checkItem(val: V, signal?: AbortSignal): Promise<T> {
    let it = this._cache_item.get(val);
    if (!it) {
      it = await this._item(this, val, signal);
      if (it) {
        this._cache_item.set(val, it);
      }
    }
    if (!it) {
      throw 'Item NoExists: ' + val;
    }
    return new Promise<T>((resolve, reject) => {
      if (!it) {
        reject('Item NoExists: ' + val);
      } else {
        resolve(it);
      }
    });
  }

  getItemValue(it: T): V {
    return this._get_value(it, -1);
  }

  getItemText(it: T): string {
    return this._get_text(it);
  }
  getItemTip(it: T): string {
    return this._get_tip(it);
  }
  getItemIcon(it: T): string {
    return this._get_icon(it);
  }

  getText(val: V): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.checkItem(val)
        .then((it: T) => {
          let s = this._get_text(it);
          resolve(s);
        })
        .catch(reject);
    });
  }
  getTip(val: V): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.checkItem(val)
        .then((it: T) => {
          let s = this._get_tip(it);
          resolve(s);
        })
        .catch(reject);
    });
  }

  getIcon(val: V): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.checkItem(val)
        .then((it: T) => {
          let s = this._get_icon(it);
          resolve(s);
        })
        .catch(reject);
    });
  }

  isMatched(item: T, val: V): boolean {
    return this._is_matched(item, val);
  }

  clearCache(): void {
    this._cache_data = [];
    this._cache_item.clear();
  }
}
