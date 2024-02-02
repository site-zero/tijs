import { DictImpl } from "./dict-impl";
import { DictFactory, IDict, DictOptions } from "./dict-types";

export class DictFactoryImpl<T, V> implements DictFactory<T, V> {
  private _DICTS = new Map<string, IDict<T, V>>();

  createDict(options: DictOptions<T, V>, name?: string): IDict<T, V> {
    let dict = new DictImpl<T, V>(options);
    if (name) {
      this._DICTS.set(name, dict);
    }
    return dict;
  }

  setDict(name: string, dict: IDict<T, V>): IDict<T, V> | undefined {
    let d = this._DICTS.get(name);
    this._DICTS.set(name, dict);
    return d;
  }

  hasDict(name: string): boolean {
    let dict = this._DICTS.get(name);
    return dict ? true : false;
  }

  getDict(name: string): IDict<T, V> | undefined {
    return this._DICTS.get(name);
  }

  checktDict(name: string): IDict<T, V> {
    let dict = this._DICTS.get(name);
    if (!dict) {
      throw new Error(`Dictionay<${name}> NOT Exists!!!`);
    }
    return dict;
  }
}
