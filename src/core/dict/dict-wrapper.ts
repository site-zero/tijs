import _ from 'lodash';
import { AbstractDict } from './dict-abstract';
import { IDict } from './dict-types';

export class DictFactoryWrapper<T, V>
  extends AbstractDict<T, V>
  implements IDict<T, V>
{
  private _dict: IDict<T, V>;
  private _flt_args?: any[];

  private _cache_data?: T[];

  constructor(dict: IDict<T, V>, filterArgs?: any[]) {
    super();
    this._dict = dict;
    this._flt_args = filterArgs;
  }

  clearCache(): void {
    this._cache_data = [];
  }

  async getData(force = false): Promise<T[]> {
    if (this._cache_data && !force) {
      return new Promise<T[]>((resolve) => {
        let data = _.cloneDeep(this._cache_data);
        if (!data) {
          throw new Error('impossiable');
        }
        resolve(data);
      });
    }
    if (this._flt_args && !_.isEmpty(this._flt_args)) {
      this._cache_data = await this._dict.queryData(this._flt_args);
      return new Promise<T[]>((resolve) => {
        let data = _.cloneDeep(this._cache_data);
        if (!data) {
          throw new Error('impossiable');
        }
        resolve(data);
      });
    }
    return this._dict.getData(force);
  }

  async getItem(val: V): Promise<T | undefined> {
    return this._dict.getItem(val);
  }

  async queryData(args: any[]): Promise<T[]> {
    return this._dict.queryData(args);
  }

  async getChildren(v: V): Promise<T[]> {
    return this._dict.getChildren(v);
  }

  async checkItem(val: V): Promise<T> {
    return this._dict.checkItem(val);
  }

  async getText(val: V): Promise<string> {
    return this._dict.getText(val);
  }

  async getTip(val: V): Promise<string> {
    return this._dict.getTip(val);
  }

  async getIcon(val: V): Promise<string> {
    return this._dict.getIcon(val);
  }

  isMatched(item: T, val: V): boolean {
    return this._dict.isMatched(item, val);
  }

  getItemValue(it: T): V {
    return this._dict.getItemValue(it);
  }

  getItemText(it: T): string {
    return this._dict.getItemText(it);
  }
  getItemTip(it: T): string {
    return this._dict.getItemTip(it);
  }
  getItemIcon(it: T): string {
    return this._dict.getItemIcon(it);
  }
}
