import _ from "lodash";
import { Vars } from "../ti";
import { DFMaker, DynDictFactory, IDict } from "./dict-types";

/**
 * 获取一个动态字典实例的键,这个键格式，类似：
 *
 * ```json5
 * {
 *    "pet.cat": IDict,
 *    "pet.dog": IDict,
 *    "foo.A": IDict,
 *    "foo.B": IDict,
 *    "bar.x.3" :IDict,
 *    "bar.x.6" :IDict,
 *    "bar.y.1" :IDict
 *    "bar.y.2" :IDict
 * }
 * ```
 *
 * @param name 动态字典名称
 * @param key 字典键，可以是任何值，如果是个数组，则可以表示多级动态字典
 * @returns 动态字典的实例键
 */
function _DK(name: string, key: any) {
  let ks;
  if (_.isArray(key)) {
    ks = key.join(".");
  } else {
    ks = key;
  }
  return `${name}.${ks}`;
}

export class DynDictFactoryImpl<T, V> implements DynDictFactory<T, V> {
  /**
   * 存放每个动态字典实例的创建方法
   * ```json5
   * {
   *    "pet": (vars)=>IDict
   *    "foo": (vars)=>IDict
   * }
   * ```
   */
  private _creators: Map<string, DFMaker<T, V>> = new Map<
    string,
    DFMaker<T, V>
  >();
  /**
   * 缓存已经生成的字典实例:
   *
   * ```json5
   * {
   *    "pet.cat": TiDict,
   *    "pet.dog": TiDict,
   *    "foo.A": TiDict,
   *    "foo.B": TiDict,
   *    "bar.x.3" :TiDict,
   *    "bar.x.6" :TiDict,
   *    "bar.y.1" :TiDict
   *    "bar.y.2" :TiDict
   * }
   * ```
   */
  private _dicts: Map<string, IDict<T, V>> = new Map<string, IDict<T, V>>();

  setCreator(name: string, creator: DFMaker<T, V>) {
    this._creators.set(name, creator);
  }

  hasDict(name: string, key: any): boolean {
    let dkey = _DK(name, key);
    let dict = this._dicts.get(dkey);
    return dict ? true : false;
  }
  getDict(name: string, key: any, vars: Vars): IDict<T, V> | undefined {
    let dkey = _DK(name, key);
    let dfa = this._dicts.get(dkey);
    if (!dfa) {
      let creator = this._creators.get(name);
      if (!creator) {
        return;
      }
      dfa = creator(vars);
      if (!dfa) {
        return;
      }
      this._dicts.set(dkey, dfa);
    }
    return dfa;
  }

  checktDict(name: string, key: any, vars: Vars): IDict<T, V> {
    let dict = this.getDict(name, key, vars);
    if (!dict) {
      throw new Error(`Dynamic Dictionary<${_DK(name, key)}> NOT Exists!!!`);
    }
    return dict;
  }
}
