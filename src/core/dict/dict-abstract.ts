import _ from 'lodash';
import { DictItem, IDict } from './dict-types';

export abstract class AbstractDict<T, V> implements IDict<T, V> {
  abstract clearCache(): void;
  abstract getData(force: boolean, signal?: AbortSignal): Promise<T[]>;
  abstract getItem(val: V, signal?: AbortSignal): Promise<T | undefined>;
  abstract queryData(args: any[], signal?: AbortSignal): Promise<T[]>;
  abstract getChildren(v: V, signal?: AbortSignal): Promise<T[]>;
  abstract checkItem(val: V, signal?: AbortSignal): Promise<T>;

  abstract getItemValue(it: T, index: number): V;
  abstract getItemText(it: T): string;
  abstract getItemTip(it: T): string;
  abstract getItemIcon(it: T): string;
  abstract isMatched(item: T, val: V): boolean;

  async getStdData(
    force: boolean,
    signal?: AbortSignal
  ): Promise<DictItem<V>[]> {
    return new Promise<DictItem<V>[]>((resolve, reject) => {
      this.getData(force, signal)
        .then((items) => {
          let list = _.map(items, (it) => this.toStdItem(it));
          resolve(list);
        })
        .catch(reject);
    });
  }

  async queryStdData(
    args: any[],
    signal?: AbortSignal
  ): Promise<DictItem<V>[]> {
    return new Promise<DictItem<V>[]>((resolve, reject) => {
      this.queryData(args, signal)
        .then((items) => {
          let list = _.map(items, (it) => this.toStdItem(it));
          resolve(list);
        })
        .catch(reject);
    });
  }

  async getStdChildren(v: V, signal?: AbortSignal): Promise<DictItem<V>[]> {
    return new Promise<DictItem<V>[]>((resolve, reject) => {
      this.getChildren(v, signal)
        .then((items) => {
          let list = _.map(items, (it) => this.toStdItem(it));
          resolve(list);
        })
        .catch(reject);
    });
  }

  async checkStdItem(val: V, signal?: AbortSignal): Promise<DictItem<V>> {
    return new Promise<DictItem<V>>((resolve, reject) => {
      this.checkItem(val, signal)
        .then((it) => {
          let re = this.toStdItem(it);
          resolve(re);
        })
        .catch(reject);
    });
  }

  async getStdItem(
    val: V,
    signal?: AbortSignal
  ): Promise<DictItem<V> | undefined> {
    return new Promise<DictItem<V> | undefined>((resolve, reject) => {
      this.getItem(val, signal)
        .then((it) => {
          let re = it ? this.toStdItem(it) : undefined;
          resolve(re);
        })
        .catch(reject);
    });
  }

  async getText(val: V, signal?: AbortSignal): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.checkItem(val, signal)
        .then((it: T) => {
          let s = this.getItemText(it);
          resolve(s);
        })
        .catch(reject);
    });
  }
  async getTip(val: V, signal?: AbortSignal): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.checkItem(val, signal)
        .then((it: T) => {
          let s = this.getItemTip(it);
          resolve(s);
        })
        .catch(reject);
    });
  }
  async getIcon(val: V, signal?: AbortSignal): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.checkItem(val, signal)
        .then((it: T) => {
          let s = this.getItemIcon(it);
          resolve(s);
        })
        .catch(reject);
    });
  }

  toStdItem(it: T, index: number = -1): DictItem<V> {
    let icon = this.getItemIcon(it);
    let text = this.getItemText(it);
    let value = this.getItemValue(it, index);
    let tip = this.getItemTip(it);
    return new DictItem<V>(value, text, icon, tip);
  }
}
