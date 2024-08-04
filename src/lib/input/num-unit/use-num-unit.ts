import _ from 'lodash';
import { Vars } from '../../../_type';
import {
  InputNumUnitEmitter,
  InputNumUnitProps,
} from './ti-input-num-unit-types';

function _get_key(
  input: (string | Function | undefined)[],
  dftKey: string
): string {
  for (let k of input) {
    if (_.isString(k)) {
      return k;
    }
  }
  return dftKey;
}

function _any_to_number(val: any, dft: number = 0): number {
  if (_.isNil(val)) {
    return dft;
  }
  if (_.isNumber(val)) {
    return val;
  }
  return val * 1;
}

export function useNumUnit(
  props: InputNumUnitProps,
  emit: InputNumUnitEmitter
) {
  //------------------------------------------
  // 数字部分的默认值
  //------------------------------------------
  const _dft_num = _any_to_number(props.defaultNumber);
  //------------------------------------------
  // 如何获取数字部分
  //------------------------------------------
  let getNumber: (vars: Vars) => number;
  if (!props.getNumber || _.isString(props.getNumber)) {
    let key = _get_key([props.getNumber], 'number');
    getNumber = (vars: Vars): number => {
      let v = _.get(vars, key);
      return _any_to_number(v, _dft_num);
    };
  }
  // 自定义获取方法
  else {
    getNumber = props.getNumber;
  }

  //------------------------------------------
  // 设置数字部分
  let setNumber: (vars: Vars, num: number) => void;
  if (!props.setNumber || _.isString(props.setNumber)) {
    let key = _get_key([props.setNumber, props.getNumber], 'number');
    setNumber = (vars: Vars, num: number) => {
      let val = props.numAsStr ? `${num}` : num;
      _.set(vars, key, val);
    };
  }
  // 自定义设置方法
  else {
    setNumber = props.setNumber;
  }

  //------------------------------------------
  // 如何获取单位部分
  //------------------------------------------
  let getUnit: (vars: Vars) => string;
  if (!props.getUnit || _.isString(props.getUnit)) {
    let key = _get_key([props.getUnit], 'unit');
    getUnit = (vars: Vars): string => {
      return _.get(vars, key);
    };
  }
  // 自定义获取方法
  else {
    getUnit = props.getUnit;
  }

  function hasUnit(vars: Vars): boolean {
    let u = getUnit(vars);
    return !_.isNil(u);
  }
  //------------------------------------------
  // 设置单位部分
  let setUnit: (vars: Vars, unit: string) => void;
  if (!props.setUnit || _.isString(props.setUnit)) {
    let key = _get_key([props.setUnit, props.getUnit], 'unit');
    setUnit = (vars: Vars, unit: string) => {
      let val = unit || null;
      _.set(vars, key, val);
    };
  }
  // 自定义设置方法
  else {
    setUnit = props.setUnit;
  }

  //------------------------------------------
  // 通知改动
  //------------------------------------------
  function emitNumberChange(num: number) {
    console.log('emitNumberChange', num);
    let data = _.cloneDeep(props.value ?? {});
    setNumber(data, num);
    if (!hasUnit(data) && props.defaultUnit) {
      setUnit(data, props.defaultUnit);
    }
    if (!_.isEqual(data, props.value)) {
      emit('change', data);
    }
  }
  //------------------------------------------
  function emitUnitChange(unit: string) {
    let data = _.cloneDeep(props.value ?? {});
    setUnit(data, unit);
    if (!_.isEqual(data, props.value)) {
      emit('change', data);
    }
  }

  //------------------------------------------
  // 输出特性
  //------------------------------------------
  return {
    getNumber,
    setNumber,
    getUnit,
    setUnit,
    emitNumberChange,
    emitUnitChange,
  };
}
