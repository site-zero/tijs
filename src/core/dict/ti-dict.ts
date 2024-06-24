import _ from 'lodash';
import { Str } from '../';
import { Vars } from '../../_type';
import { DictFactoryImpl } from './dict-factory';
import {
  _gen_data_loader,
  _gen_data_query,
  _gen_dict_opt_getter,
  _gen_item_loader,
} from './dict-options';
import {
  DFMaker,
  DictName,
  DictOptions,
  DictSetup,
  TiDict,
} from './dict-types';
import { DynDictFactoryImpl } from './dyn-dict-factory';

export * from './dict-types';

/**
 * 根据一个简单的数据类型，生成标准字典配置对象
 *
 * @param data 静态数据
 * @param setup
 * @returns 字典标准配置对象
 */
export function makeDictOptions(
  setup = {} as DictSetup
): DictOptions<any, any> {
  // 准备返回值
  let re = {} as DictOptions<any, any>;

  // 这个 data 必须是要有值的
  re.data = _gen_data_loader(setup.data);
  if (setup.query) {
    re.query = _gen_data_query(setup.query);
  }
  if (setup.item) {
    re.item = _gen_item_loader(setup.item);
  }

  // 处理静态方法

  re.getValue = _gen_dict_opt_getter(setup.value || 'value');
  re.getText = _gen_dict_opt_getter(setup.text || 'text');
  re.getIcon = _gen_dict_opt_getter(setup.icon || 'icon');
  re.getTip = _gen_dict_opt_getter(setup.tip || 'tip');

  return re;
}

/**
 * 定义一个全局静态字典
 */
const STATIC_DICT = new DictFactoryImpl<any, any>();

/**
 * 创建一个字典，如果这个字典实例已经存在，则直接返回
 *
 * @param options 字典设置参数
 * @param name 如果指定了字典名称，则会缓存实例
 * @returns 字典实例
 */
export function getOrCreate(
  options: DictOptions<any, any>,
  name?: string
): TiDict {
  let dict: TiDict | undefined;
  if (name) {
    dict = STATIC_DICT.getDict(name);
  }
  if (dict) {
    return dict;
  }
  return STATIC_DICT.createDict(options, name);
}

/**
 * 创建一个字典，如果这个字典实例已经存在，则会被替换
 *
 * @param options 字典设置参数
 * @param name 如果指定了字典名称，则会缓存实例
 * @returns 字典实例
 */
export function createDict(
  options: DictOptions<any, any>,
  name?: string
): TiDict {
  return STATIC_DICT.createDict(options, name);
}

/**
 * 设置一个字典实例
 *
 * @param name 字典名称
 * @param dict 要设置的字典实例
 *
 * @return 如果已经存在同名实例，会被新实例覆盖，旧实例则被返回。
 * 否则会返回 `undefined`
 */
export function setDict(name: string, dict: TiDict): TiDict | undefined {
  return STATIC_DICT.setDict(name, dict);
}

/**
 * 判断一个静态字典是否存在
 *
 * @param name 字典名称
 * @returns 字典是否存在
 */
export function hasDict(name: string): boolean {
  return STATIC_DICT.hasDict(name);
}

/**
 * 根据名称获取字典实例
 *
 * @param name 字典名称
 * @returns 字典实例
 */
export function getDict(name: string): TiDict | undefined {
  return STATIC_DICT.getDict(name);
}

/**
 * 根据名称获取字典实例，如果不存在会抛错
 *
 * @param name 字典名称
 * @returns 字典实例
 */
export function checkDict(name: string): TiDict {
  return STATIC_DICT.checktDict(name);
}

/**
 * 解析一个字典引用名，一个引用名可能类似
 *
 * ```
 * #pets
 * - `#` 表示前缀
 * - `pets` 表示字典实例名
 *
 * @Dict:pets
 * - `@Dict` 表示前缀
 * - `pets` 表示字典实例名
 * ```
 *
 * @param str 输入的字典引用名
 * @returns  字典实例名称
 */
export function dictReferName(str: string): string {
  let m = /^(@Dict:|#)(.+)$/.exec(str);
  if (m && m[2]) {
    return _.trim(m[2]);
  }
  return str;
}

export function explainDictName(dictName: string): DictName {
  let re = {} as DictName;
  let m = /^([^:()]+)(\(([^)]*)\))?(:(.+))?$/.exec(dictName);
  if (m) {
    re.name = m[1];
    re.args = Str.joinArgs(m[3]);
    re.vkey = m[5];
    if (re.args.length == 1 && /^=/.test(re.args[0])) {
      re.dynamic = true;
      re.dictKey = _.trim(re.args[0].substring(1));
    }
  }
  return re;
}

/**
 * 定义一个全局动态态字典
 */
const DYN_DICTS = new DynDictFactoryImpl<any, any>();

/**
 * 增加一个动态字典的工厂方法
 *
 * @param creator  动态字典工厂方法
 * @param name  动态字典名称
 */
export function createDynamicDict(
  creator: DFMaker<any, any>,
  name: string
): void {
  DYN_DICTS.setCreator(name, creator);
}

/**
 * 获取一个动态字典，如果这个字典不存在，就创建它。
 * 如果不能创建就返回 undefined
 *
 * @param name 动态字典名称
 * @param key 字典键
 * @param vars 上下文变量
 * @returns 一个字典实例
 */
export function getDynamicDict(
  name: string,
  key: any,
  vars: Vars
): TiDict | undefined {
  return DYN_DICTS.getDict(name, key, vars);
}
/**
 * 获取一个动态字典，如果这个字典不存在，就创建它。
 * 如果不能创建就抛错，以便确保调用者会得到一个非空实例
 *
 * @param name 动态字典名称
 * @param key 字典键
 * @param vars 上下文变量
 * @returns 一个字典实例
 */
export function checkDynamicDict(name: string, key: any, vars: Vars): TiDict {
  return DYN_DICTS.checktDict(name, key, vars);
}
