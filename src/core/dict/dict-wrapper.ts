import { AbstractDict } from './dict-abstract';
import { GetItemText, GetItemValue, IDict, IsMatched } from './dict-types';

export type DictWrapperOptions<T, V> = {
  getValue?: GetItemValue<T, V>;
  getText?: GetItemText<T>;
  getTip?: GetItemText<T>;
  getIcon?: GetItemText<T>;
  isMatched?: IsMatched<T, V>;
};

export class DictWrapper<T, V>
  extends AbstractDict<T, V>
  implements IDict<T, V>
{
  private _inner_dict: IDict<T, V>;
  private _getter: DictWrapperOptions<T, V>;

  constructor(dict: IDict<T, V>, options: DictWrapperOptions<T, V>) {
    super();
    this._inner_dict = dict;
    this._getter = options;
  }

  clearCache(): void {
    this._inner_dict.clearCache();
  }
  getData(force: boolean, signal?: AbortSignal): Promise<T[]> {
    return this._inner_dict.getData(force, signal);
  }
  getItem(val: V, signal?: AbortSignal): Promise<T | undefined> {
    return this._inner_dict.getItem(val, signal);
  }
  queryData(args: any[], signal?: AbortSignal): Promise<T[]> {
    return this._inner_dict.queryData(args, signal);
  }
  getChildren(v: V, signal?: AbortSignal): Promise<T[]> {
    return this._inner_dict.getChildren(v, signal);
  }
  checkItem(val: V, signal?: AbortSignal): Promise<T> {
    return this._inner_dict.checkItem(val, signal);
  }
  getItemValue(it: T, index: number): V {
    if (this._getter.getValue) {
      return this._getter.getValue(it, index);
    }
    return this._inner_dict.getItemValue(it, index);
  }
  getItemText(it: T): string {
    if (this._getter.getText) {
      return this._getter.getText(it);
    }
    return this._inner_dict.getItemText(it);
  }
  getItemTip(it: T): string {
    if (this._getter.getTip) {
      return this._getter.getTip(it);
    }
    return this._inner_dict.getItemTip(it);
  }
  getItemIcon(it: T): string {
    if (this._getter.getIcon) {
      return this._getter.getIcon(it);
    }
    return this._inner_dict.getItemIcon(it);
  }
  isMatched(item: T, val: V): boolean {
    if (this._getter.isMatched) {
      return this._getter.isMatched(item, val);
    }
    return this._inner_dict.isMatched(item, val);
  }
}
