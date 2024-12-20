import JSON5 from 'json5';
import _ from 'lodash';
import { DateTime, ENV_KEYS, getEnv, Str, Util } from '../core';
import {
  CommonProps,
  ComRef,
  Convertor,
  DateInput,
  FieldChange,
  FieldName,
  InvokePartial,
  NameValue,
  Vars,
} from './core-types';

export type Field = {
  /**
   * 字段的唯一编号，通常，根据 makeFieldUniqKey 函数生成
   */
  uniqKey: string;
  /**
   * 字段名称， 如果是 `string[]` 则会从数据中提取子对象
   * `string` 时，支持 `.` 分割的属性路径
   */
  name: FieldName;
  /**
   * 字段类型
   *
   * @default `String`
   */
  type: FieldValueType;

  /**
   * 如果做类型转换，那么可以指定转换的参数
   * 对应到 getFieldConvertor 函数用到 toXXX 有的函数可以接受参数
   */
  typeTransformOptions?: Vars;
  typeSerializeOptions?: Vars;
  /**
   * 字段默认值
   */
  defaultAs?: any;

  /**
   * 当字段为空时的默认值
   */
  emptyAs?: any;

  transformer?: (val: any, data: Vars, name: FieldName) => any;
  serializer?: (val: any, data: Vars, name: FieldName) => any;
};

export type CellProps = CommonProps &
  Field &
  Omit<FieldComProps, 'readonlyComType' | 'readonlyComConf'> & {
    title?: string;
    tip?: string;
    disabled?: boolean;
    activated?: boolean;
    /**
     * 行下标： 0 BASE
     */
    rowIndex?: number;
    /**
     * 列下标： 0 BASE
     */
    colIndex?: number;

    /**
     * 传入的数据对象
     */
    data: Vars;
    /**
     * 传入的上下文变量字段
     */
    vars?: Vars;

    /**
     * 在字段改动后，是否需要比对一下，不同才通知改动
     *
     * @default true
     */
    checkEquals?: boolean;
  };

/**
 * 抽象字段
 */
export type AbstractField = Field & {
  /**
   * 判断当前字段是否是必须的
   *
   * @param data 整体记录
   * @returns  当前字段对这个记录是不是必须的
   */
  required?: (data: Vars) => any;

  validate?: FieldValidator | AyncFieldValidator;

  // // /**
  // //  * 指定了快捷的验证字段值的方法，在 `validate`属性未定义时，
  // //  * 将采用这个值
  // //  */
  // // valueChecker?: FieldValidateInput;

  // /**
  //  * 异步检查字段值的合法性
  //  */
  // asyncValidate?: AsyncFieldValidator;
};

export type FieldConvertor = {
  transform: (val: any, options?: Vars) => any;
  serialize: (val: any, options?: Vars) => any;
};

export type FieldPair = NameValue<FieldName, any>;

type FieldConvertorSet = {
  String: FieldConvertor;
  Object: FieldConvertor;
  Array: FieldConvertor;
  Number: FieldConvertor;
  Integer: FieldConvertor;
  Float: FieldConvertor;
  Boolean: FieldConvertor;
  Timestamp: FieldConvertor;
  AMS: FieldConvertor;
};
const FIELD_CONVERTERS: FieldConvertorSet = {
  String: { transform: toStr, serialize: toStr },
  Object: { transform: toObject, serialize: toObject },
  Array: { transform: toArray, serialize: toArray },
  Number: { transform: toNumber, serialize: toNumber },
  Integer: { transform: toInteger, serialize: toInteger },
  Float: { transform: toFloat, serialize: toFloat },
  Boolean: { transform: toBoolean, serialize: toBoolean },
  Timestamp: { transform: toDatetimeText, serialize: toAMS },
  AMS: { transform: toDatetimeText, serialize: toAMS },
};

export function isFieldType(type: string): type is FieldValueType {
  let cov = _.get(FIELD_CONVERTERS, type);
  return cov ? true : false;
}

/**
 * 检查结果类型
 *
 * - OK : 检查通过
 * - VALUE_NIL : 必选值不能为空
 * - VALUE_INVALID : 数据格式错误
 * - FIELD_UNDEFINED : 字段未定义
 */
export type ValidateType =
  | 'OK'
  | 'VALUE_INVALID'
  | 'VALUE_NIL'
  | 'FIELD_UNDEFINED';

export type ValidateResult = {
  type: ValidateType;
  message?: string;
};

/**
 * 同步检查字段值的回调函数
 *
 * @param value  字段的值
 * @param field  字段定义
 * @param data  整体数据对象
 * @returns 指定检查结果，如果 undefined 表示检查通过
 */
export type FieldValidator = (
  value: any,
  field: AbstractField,
  data: Vars
) => ValidateResult | undefined;

export type AyncFieldValidator = (
  value: any,
  field: AbstractField,
  data: Vars
) => Promise<ValidateResult | undefined>;

export type FieldValidateMatcher = {
  not?: boolean;
  test: any;
  message: string;
};

/**
 * 根据这个输入能生成一个 FieldValidator
 */
export type FieldValidation =
  | RegExp
  | string
  | FieldValidateMatcher
  | FieldValidator
  | AyncFieldValidator;

/**
 * 异步检查字段值的回调函数
 */
export type AsyncFieldValidator = (
  value: any,
  field: AbstractField,
  data: Vars
) => Promise<ValidateResult | undefined>;

export type FieldValueType = keyof FieldConvertorSet;

export function getFieldUniqKey(name: FieldName): string {
  if (_.isString(name)) {
    return name;
  }
  return name.join('-');
}

export function makeFieldUniqKey(
  indexes: number[],
  fieldName?: FieldName,
  uniqKey?: string
): string {
  if (uniqKey) {
    return uniqKey;
  }
  if (fieldName) {
    return getFieldUniqKey(fieldName);
  }
  return `_F${indexes.join('_')}`;
}

export function mergeFieldChanges(changes: FieldChange[], data?: Vars): Vars {
  let meta = _.cloneDeep(data) || {};
  for (let change of changes) {
    let { name, value } = change;
    setFieldValue(name, value, meta);
  }
  return meta;
}

export function convertChangesToMeta(changed: Vars | FieldChange[]): Vars {
  if (_.isArray(changed)) {
    return mergeFieldChanges(changed);
  }
  return changed ?? {};
}

export function useFieldChangeDiff(
  changes: FieldChange[] | Vars,
  data: Vars = {}
) {
  if (_.isArray<FieldChange>(changes)) {
    return mergeFieldChanges(changes, data);
  }
  // 已经合并过了
  return _.assign(data, changes);
}

export function setFieldValue(name: FieldName, value: any, data?: Vars): Vars {
  data = data ?? {};
  // 组合字段
  if (_.isArray(name)) {
    for (let k of name) {
      let v = _.get(value, k);
      _.set(data, k, v);
    }
  }
  // 简单值
  else {
    _.set(data, name, value);
  }

  return data;
}

export function getFieldValue(name: FieldName, data: Vars): any {
  if (_.isString(name)) {
    return _.get(data, name);
  }
  // 获取子对象
  return _.pick(data, name);
}

export function getFieldConvertor(type: FieldValueType): FieldConvertor {
  return FIELD_CONVERTERS[type];
}

export function getFieldTypeByValue(input?: any): FieldValueType {
  if (_.isUndefined(input) || _.isString(input)) {
    return 'String';
  }
  if (_.isNumber(input)) {
    if (Number.isInteger(input)) {
      return 'Integer';
    }
    return 'Number';
  }
  if (_.isBoolean(input)) {
    return 'Boolean';
  }
  if (_.isArray(input)) {
    return 'Array';
  }
  if (_.isNull(input) || _.isPlainObject(input)) {
    return 'Object';
  }
  return 'String';
}

export function parseFieldConverter(
  type: FieldValueType,
  mode: keyof FieldConvertor,
  typeOptions: Vars | undefined,
  context: Vars,
  converter?: string | Function,
  args?: any[],
  partial?: InvokePartial
): (val: any, data: Vars, name: FieldName) => any {
  // 自定义转换器
  if (converter) {
    let conv = Util.genInvoking(converter, {
      context,
      args,
      partial: partial || 'right',
    });
    return conv as (val: any, data: Vars, name: FieldName) => any;
  }
  // 默认类型转换器
  let cov = getFieldConvertor(type);
  let covFn = cov[mode];
  if (typeOptions) {
    return (val: any) => {
      return covFn(val, typeOptions);
    };
  }
  return covFn;
}

function toStr(input: any) {
  return Str.anyToStr(input);
}

function toObject(input: any): Vars {
  if (_.isNil(input)) {
    return {};
  }
  // Parse Array
  if (_.isArray(input)) {
    return _.fromPairs(input);
  }
  // For String
  if (_.isString(input)) {
    // Parse JSON
    if (/^\{/.test(input) && /\}$/.test(input)) {
      try {
        return JSON5.parse(input);
      } catch (err) {}
    }
    // Json Array
    if (/^\[/.test(input) && /\]$/.test(input)) {
      try {
        let array = JSON5.parse(input);
        return _.fromPairs(array);
      } catch (err) {}
    }

    // Parse String
    return Str.toObject(input);
  }

  // Translate Object
  if (_.isPlainObject(input)) {
    return input;
  }

  throw new Error(`Can not transform {${input}} to Object`);
}

function toArray(input: any) {
  return Str.toArray(input);
}

function toNumber(input: any) {
  if (_.isBoolean(input)) {
    return input ? 1 : 0;
  }
  if (_.isDate(input)) {
    return input.getTime();
  }
  if (Str.isBlank(input)) {
    return NaN;
  }
  let n = 1 * input;
  if (isNaN(n)) {
    // console.log("invalid number")
    // throw 'i18n:invalid-number'
    return NaN;
  }
  return n;
}

const INT_CONVERTERS = {
  round: (v: any) => Math.round(v),
  ceil: (v: any) => Math.ceil(v),
  floor: (v: any) => Math.floor(v),
  int: (v: any) => parseInt(v),
} as {
  [k: string]: Convertor<any, number>;
};

type IntConverterName = keyof typeof INT_CONVERTERS;

export type ToIntegerOptions = {
  mode?: IntConverterName;
  dft?: number;
  range?: [number, number];
  border?: [boolean, boolean];
};

function toInteger(input: any, options: ToIntegerOptions = {}) {
  let { mode = 'round', dft = -1, range = [], border = [true, true] } = options;
  let n = INT_CONVERTERS[mode](input);
  // Apply the default
  if (isNaN(n)) {
    //throw 'i18n:invalid-integer'
    n = dft;
  }
  // Apply Range
  if (range.length == 2) {
    // Eval the border
    if (!_.isArray(border)) {
      border = [border, border];
    }
    let [b_left, b_right] = border;
    let [min_left, max_right] = range;
    // Guard the NaN
    if (isNaN(n)) {
      return Math.round((min_left + max_right) / 2);
    }
    // Left Range
    if (!_.isNull(min_left)) {
      if (b_left && n < min_left) return min_left;
      if (!b_left && n <= min_left) return min_left + 1;
    }
    // Right Range
    if (!_.isNull(max_right)) {
      if (b_right && n > max_right) return max_right;
      if (!b_right && n >= max_right) return max_right - 1;
    }
  }
  // Return Directly
  return n;
}

export type ToFloatOptions = {
  precision?: number;
  dft?: number;
};

function toFloat(input: any, options: ToFloatOptions = {}) {
  let { precision = 2, dft = NaN } = options;
  //console.log("toFloat", val, precision, dft)
  if (_.isNil(input)) {
    return dft;
  }
  let n = input * 1;
  if (isNaN(n)) {
    return dft;
  }
  if (precision >= 0) {
    let y = Math.pow(10, precision);
    return Math.round(n * y) / y;
  }
  return n;
}
function toBoolean(input: any) {
  if (false == input) {
    return false;
  }
  if (_.isNull(input) || _.isUndefined(input)) {
    return false;
  }
  if (/^(no|off|false)$/i.test(input)) {
    return false;
  }

  return true;
}

function toAMS(input: any) {
  let dt = DateTime.parse(input as DateInput);
  if (_.isDate(dt)) {
    return dt.getTime();
  }
  return null;
}

function toDate(input: any) {
  return DateTime.parse(input);
}

export const TI_DFT_DATETIME_FORMAT = '';

function toDatetimeText(input: any) {
  if (_.isNil(input)) {
    return '';
  }
  let fmt = getEnv(ENV_KEYS.DFT_DATETIME_FORMAT, 'yyyy-MM-dd HH:mm:ss');
  let d = DateTime.parse(input);
  if (_.isDate(d)) {
    return DateTime.format(d, { fmt });
  }
  return input;
}

/*-------------------------------------------------------

                     Props

-------------------------------------------------------*/
export type FieldComProps = ComRef & {
  /**
   * 指定了控件的那个属性用来接收“值”。
   * 如果未指定，则相当于 `value`。
   * 如果指定为 `null` 则表示不要为控件自动设置值。
   *
   * @default `"value"`
   */
  autoValue?: string | null;

  /**
   * 动态解释字段
   */
  dynamic?: boolean;

  /**
   * 动态解释字段时，默认上下文就是 data
   * 这里可以额外补充一个 vars
   *
   * ```
   * {
   *   value : any   // 字段值
   *   data  : {..}  // 对象
   *   vars  : {..}  // 额外补充变量
   * }
   * ```
   */
  vars?: Vars;

  /**
   * 只读模式时的显示控件。如果未指定，则采用 `TiLabel`
   * 不过会自动为 `comConf` 附加 `readonly` 属性
   *
   * @default `TiLabel`
   */
  readonlyComType?: string | null;
  /**
   * 只读模式时的控件属性，默认的，会自动分析 `comType/comConf`
   * 提取必要的属性
   */
  readonlyComConf?: Vars;

  /**
   * 激活式时的显示控件。如果未指定，则采用 `TiInput`
   *
   * @default `TiLabel`
   */
  activatedComType?: string | null;
  /**
   * 激活模式时的控件属性，如果未指定，则默认采用 `comConf`
   */
  activatedComConf?: Vars;

  /**
   * 捕获字段控件修改事件的名称，默认的，如果你声明了 `activatedComType`
   * 那么这个属性就是 "change"，否则将不会捕获子控件的修改事件。
   * 当然，像 TiForm 这样的控件会有自己的定制，它无论是否有 `activatedComType`
   * 都会捕获 "change" 事件
   */
  changeEventName?: string;
};
