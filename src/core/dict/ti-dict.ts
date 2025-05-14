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
  DictName,
  DictOptions,
  DictSetup,
  DynDictMaker,
  TiDict,
} from './dict-types';
import { DictWrapper } from './dict-wrapper';
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
  re.getText = _gen_dict_opt_getter(setup.text || 'text');
  re.getIcon = _gen_dict_opt_getter(setup.icon || 'icon');
  re.getTip = _gen_dict_opt_getter(setup.tip || 'tip');

  if (_.isFunction(setup.value)) {
    re.getValue = setup.value;
  } else {
    let valueKey = setup.value ?? 'value';
    re.getValue = (item: any, index: number): any => {
      //console.log('dict.getValue', item, valueKey, index);
      let v = _.get(item, valueKey);
      if (_.isNil(v) && index >= 0) {
        return `row-${index}`;
      }
      return v;
    };
  }

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
 * 包裹一个字典实例，但是提供不同的标准数据获取办法。
 * 主要是对于动态字典，在控件如果使用，可能会根据需要而修改数据获取方式
 *
 * @param dict 源字典
 * @param options 标准数据获取方式
 * @returns 包裹源字典的实例
 */
export function wrapDict(dict: TiDict, options: DictOptions<any, any>): TiDict {
  return new DictWrapper(dict, options);
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
  creator: DynDictMaker<any, any>,
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
 * 通常，获取动态字典会这么调用:
 *
 * ```
 * let d = checkDynamicDict('Pets', 'dog', { race:'dog' });
 * // 第二个参数 'dog' 被认为是字典键，它会生成一个 `Pets.dog` 的字典实例
 * // 第三个参数作为动态字典的查询函数的输入，以便生成服务器端读取逻辑
 * ```
 *
 * @param name 动态字典名称
 * @param key 字典键
 * @param vars 上下文变量
 * @returns 一个字典实例
 */
export function checkDynamicDict(name: string, key: any, vars: Vars): TiDict {
  return DYN_DICTS.checktDict(name, key, vars);
}
