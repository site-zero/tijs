import JSON5 from 'json5';
import _ from 'lodash';
import {
  Convertor,
  DateInput,
  DateTime,
  FuncA2,
  FuncA3,
  NameValue,
  Str,
  Vars,
} from '../../core';
import { CommonProps, FieldComProps } from '..';

export type Field = {
  /**
   * 字段唯一键，如果未定义，则会根据 name 来生成
   *
   * @see getFieldUniqKey
   */
  uniqKey?: string;
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
  type?: FieldValueType;
  /**
   * 字段默认值
   */
  defaultAs?: any;

  /**
   * 当字段为空时的默认值
   */
  emptyAs?: any;

  transformer?: FuncA2<any, Vars, any>;
  serializer?: FuncA3<any, Vars, FieldName, any>;
};

export type CellProps = CommonProps &
  Field &
  Omit<FieldComProps, 'redonlyComType' | 'redonlyComConf'> & {
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
 * 单元格定义
 */
export type TableCell = Omit<
  CellProps,
  'activated' | 'rowIndex' | 'colIndex' | 'data' | 'vars'
>;

export type FieldConvertor = {
  transform: Convertor<any, any>;
  serialize: Convertor<any, any>;
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
  Timestamp: { transform: toDate, serialize: toAMS },
  AMS: { transform: toDate, serialize: toAMS },
};

export function isFieldType(type: string): type is FieldValueType {
  let cov = _.get(FIELD_CONVERTERS, type);
  return cov ? true : false;
}

export type FieldValueType = keyof FieldConvertorSet;

export type FieldName = string | string[];

export function getFieldUniqKey(name: FieldName): string {
  if (_.isString(name)) {
    return name;
  }
  return name.join('-');
}

export function getFieldConvertor(type: FieldValueType): FieldConvertor {
  return FIELD_CONVERTERS[type];
}

function toStr(input: any) {
  return Str.anyToStr(input);
}

function toObject(input: any): Vars {
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

function toInteger(
  input: any,
  { mode = 'int', dft = -1, range = [], border = [true, true] } = {} as {
    mode: IntConverterName;
    dft: number;
    range?: [number, number];
    border?: [boolean, boolean];
  }
) {
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
function toFloat(
  input: any,
  { precision = 2, dft = NaN } = {} as {
    precision: number;
    dft: number;
  }
) {
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
