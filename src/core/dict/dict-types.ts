import _ from 'lodash';
import { AnyGetter, OptionItem, StdOptionItem, ValGetter, Vars } from '../ti';

export type DictSetup = {
  value?: string | AnyGetter;
  text?: string | ValGetter<any, string>;
  icon?: string | ValGetter<any, string>;
  tip?: string | ValGetter<any, string>;

  data: any;
  query?: any;
  item?: any;
};
export function isDictSetup(it: any): it is DictSetup {
  if (!it.data) {
    return false;
  }
  for (let k of _.keys(it)) {
    if (!/^(data|query|item|value|text|icon|tip)$/.test(k)) {
      return false;
    }
  }
  return true;
}

/**
 * 对一个字典名称的分析结果，字典名称通常有下面几种形式：
 *
 * - `"pet"` : 静态字典
 * - `"pet:.icon"` : 静态字典，但是展现 `icon` 的值，而不是 `text`
 * - `"pet(dog)": 静态字典，通过 `["dog"]` 参会从数据集里过滤出一部分数据
 * - `"pet(dog, 12)": 静态字典，通过 `["dog", 12]` 参数从数据集里过滤出一部分数据
 * - `"pet(=age)" : 动态字典，动态键取自上下文中的 `age` 变量
 * - `"pet(=age):.icon" : 动态字典，动态键取自上下文中的 `age` 变量，
 * 同时仅展现 `icon` 的值，而不是 `text`
 */
export type DictName = {
  /**
   * 字典名
   */
  name: string;
  /**
   * 动态字典参数，如果字典名为 pet(=age) ，那么 args 就是 "=age"
   * 这个`age` 会被记录到 dictKey 里面，会根据这键名从上下文获取字典的动态键值。
   *
   * 如果是静态字典，则会有根据这个参数表，做过滤(采用getChildren)以便获取一个数据集合的子集
   * 以便将一个大数据集可以被定义成多个静态字典
   */
  args?: any[];
  /**
   * 字典显示的是值(`value`)，但有时可能会想显示`icon`或者`tip`
   * 那么指定 `foo:.icon` 就可以指定字典的默认显示值.
   * 同理也适用于动态字典 `pet(=age):.icon`
   */
  vkey?: string;
  /**
   * 指明这个字典名称是否是个动态字典
   */
  dynamic?: boolean;
  /**
   * 如果是动态字典，那么需要从参数里获取一个动态键名，
   * 通过这个名称就可以从上下文里获取动态键值
   */
  dictKey?: string;
};
export function isDictDictName(it: any): it is DictName {
  for (let k of _.keys(it)) {
    if (!/^(name|args|vkey|dynamic|dictKey)$/.test(k)) {
      return false;
    }
  }
  return true;
}

export interface DynDictFactory<T, V> {
  setCreator(name: string, creator: DFMaker<T, V>): void;

  hasDict(name: string, key: any): boolean;
  getDict(name: string, key: any, vars: Vars): IDict<T, V> | undefined;
  checktDict(name: string, key: any, vars: Vars): IDict<T, V>;
}

export type DFMaker<T, V> = {
  (vars: Vars): IDict<T, V>;
};

export interface DictFactory<T, V> {
  createDict(options: DictOptions<T, V>, name?: string): IDict<T, V>;
  setDict(name: string, dict: IDict<T, V>): IDict<T, V> | undefined;
  hasDict(name: string): boolean;
  getDict(name: string): IDict<T, V> | undefined;
  checktDict(name: string): IDict<T, V>;
}

export type TiDict = IDict<any, any>;

/**
 * - `T` : 字典每个项目的类型
 * - `V` : 字典项每个值的类型
 */
export interface IDict<T, V> {
  /*..................................
          Async Part
  ...................................*/
  clearCache(): void;
  getData(force?: boolean, signal?: AbortSignal): Promise<T[]>;
  getItem: LoadItem<T | undefined, V>;
  queryData: QueryItems<T, any>;
  getChildren: QueryItems<T, V>;
  checkItem: LoadItem<T, V>;

  getStdData(force?: boolean, signal?: AbortSignal): Promise<DictItem<V>[]>;
  getStdItem: LoadItem<DictItem<V> | undefined, V>;
  queryStdData: QueryItems<DictItem<V>, any>;
  getStdChildren: QueryItems<DictItem<V>, V>;
  checkStdItem: LoadItem<DictItem<V>, V>;

  /*..................................
          Sync Part
  ...................................*/

  isMatched: IsMatched<T, V>;

  toStdItem(it: T): DictItem<V>;
  getText: LoadText<V>;
  getTip: LoadText<V>;
  getIcon: LoadText<V>;

  getItemValue: GetItemValue<T, V>;
  getItemText: GetItemText<T>;
  getItemTip: GetItemText<T>;
  getItemIcon: GetItemText<T>;
}

export type LoadData<T> = (signal?: AbortSignal) => Promise<T[]>;

export type LoadItem<T, V> = (input: V, signal?: AbortSignal) => Promise<T>;

export type LoadDictItem<T, V> = (
  dict: IDict<T, V>,
  input: V,
  signal?: AbortSignal
) => Promise<T | undefined>;

export type QueryItems<T, A> = (input: A, signal?: AbortSignal) => Promise<T[]>;

export type QueryDictItems<T, V, A> = (
  dict: IDict<T, V>,
  input: A,
  signal?: AbortSignal
) => Promise<T[]>;

export type LoadText<V> = (input: V, signal?: AbortSignal) => Promise<string>;

export type GetItemText<T> = (item: T) => string;

export type GetItemValue<T, V> = (item: T) => V;

export type IsMatched<T, V> = (item: T, val: V) => boolean;

export type DictOptions<T, V> = {
  /* Async function  */
  data: LoadData<T>;
  item?: LoadDictItem<T, V>;
  query?: QueryDictItems<T, V, any[]>;
  children?: QueryDictItems<T, V, V>;
  /* Sync function */
  getValue?: GetItemValue<T, V>;
  getText?: GetItemText<T>;
  getTip?: GetItemText<T>;
  getIcon?: GetItemText<T>;
  isMatched?: IsMatched<T, V>;
};

export class DictItem<V> {
  _icon?: string;
  _text: string;
  _value?: V;
  _tip?: string;

  constructor(value: V, text: string, icon?: string, tip?: string) {
    this._icon = icon;
    this._text = text;
    this._value = value;
    this._tip = tip;
  }

  toOptionItem(): OptionItem<V> {
    return {
      icon: this._icon,
      text: this._text,
      tip: this._tip,
      value: this._value!,
    };
  }

  get icon(): string | undefined {
    return this._icon;
  }

  set icon(icon: string) {
    this._icon = icon;
  }

  get text(): string {
    return this._text;
  }

  set text(text: string) {
    this._text = text;
  }

  get value(): any {
    return this._value;
  }

  set value(value: any) {
    this._value = value;
  }

  get tip(): string | undefined {
    return this._tip;
  }

  set tip(tip: string) {
    this._tip = tip;
  }
}
