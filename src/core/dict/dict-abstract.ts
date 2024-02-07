import _ from 'lodash';
import { DictItem, IDict } from './dict-types';

export abstract class AbstractDict<T, V> implements IDict<T, V> {
  abstract clearCache(): void;
  abstract getData(force: boolean): Promise<T[]>;
  abstract getItem(val: V): Promise<T | undefined>;
  abstract queryData(args: any[]): Promise<T[]>;
  abstract getChildren(v: V): Promise<T[]>;
  abstract checkItem(val: V): Promise<T>;

  abstract getItemValue(it: T): V;
  abstract getItemText(it: T): string;
  abstract getItemTip(it: T): string;
  abstract getItemIcon(it: T): string;
  abstract isMatched(item: T, val: V): boolean;

  async getStdData(force: boolean): Promise<DictItem<V>[]> {
    return new Promise<DictItem<V>[]>((resolve, reject) => {
      this.getData(force)
        .then((items) => {
          let list = _.map(items, (it) => this.toStdItem(it));
          resolve(list);
        })
        .catch(reject);
    });
  }

  async queryStdData(args: any[]): Promise<DictItem<V>[]> {
    return new Promise<DictItem<V>[]>((resolve, reject) => {
      this.queryData(args)
        .then((items) => {
          let list = _.map(items, (it) => this.toStdItem(it));
          resolve(list);
        })
        .catch(reject);
    });
  }

  async getStdChildren(v: V): Promise<DictItem<V>[]> {
    return new Promise<DictItem<V>[]>((resolve, reject) => {
      this.getChildren(v)
        .then((items) => {
          let list = _.map(items, (it) => this.toStdItem(it));
          resolve(list);
        })
        .catch(reject);
    });
  }

  async checkStdItem(val: V): Promise<DictItem<V>> {
    return new Promise<DictItem<V>>((resolve, reject) => {
      this.checkItem(val)
        .then((it) => {
          let re = this.toStdItem(it);
          resolve(re);
        })
        .catch(reject);
    });
  }

  async getStdItem(val: V): Promise<DictItem<V> | undefined> {
    return new Promise<DictItem<V> | undefined>((resolve, reject) => {
      this.getItem(val)
        .then((it) => {
          let re = it ? this.toStdItem(it) : undefined;
          resolve(re);
        })
        .catch(reject);
    });
  }

  async getText(val: V): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.checkItem(val)
        .then((it: T) => {
          let s = this.getItemText(it);
          resolve(s);
        })
        .catch(reject);
    });
  }
  async getTip(val: V): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.checkItem(val)
        .then((it: T) => {
          let s = this.getItemTip(it);
          resolve(s);
        })
        .catch(reject);
    });
  }
  async getIcon(val: V): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.checkItem(val)
        .then((it: T) => {
          let s = this.getItemIcon(it);
          resolve(s);
        })
        .catch(reject);
    });
  }

  toStdItem(it: T): DictItem<V> {
    let icon = this.getItemIcon(it);
    let text = this.getItemText(it);
    let value = this.getItemValue(it);
    let tip = this.getItemTip(it);
    return new DictItem<V>(value, text, icon, tip);
  }
}
