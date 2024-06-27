import _ from 'lodash';
import { ReadonlyProps, useReadonly } from './use-readonly';
import { computed } from 'vue';

export type BooleanProps = {
  value?: any;
  // [falseValue, trueValue]
  values?: [any, any];
  isTrue?: (val: any) => boolean;
};

export type BooleanEmitter = {
  (eventName: 'change', payload: any): void;
};

export type BooleanOptions = {
  emit: BooleanEmitter;
};

export function useBooleanInput(
  props: BooleanProps & ReadonlyProps,
  options: BooleanOptions
) {
  let { emit } = options;
  const Readonly = useReadonly(props);
  // function getTrueValue() {
  //   return _.nth(props.values, 1) ?? true;
  // }

  const BoolValues = computed(() => {
    if (props.values) {
      return props.values;
    }
    if (_.isNumber(props.value)) {
      return [0, 1];
    }
    if (_.isBoolean(props.value)) {
      return [false, true];
    }
    // 默认
    return [false, true];
  });

  function isTrue(val: any) {
    //console.log('isTrue', val);
    if (_.isFunction(props.isTrue)) {
      return props.isTrue(val);
    }
    if (BoolValues.value.length > 1) {
      return _.isEqual(BoolValues.value[1], val);
    }
    return val ? true : false;
  }

  function emitToggle() {
    if (Readonly.isReadonly()) {
      return;
    }
    let I = isTrue(props.value) ? 0 : 1;
    let val = BoolValues.value[I];
    emit('change', val);
  }

  return {
    yes: isTrue(props.value),
    //getTrueValue,
    isTrue,
    emitToggle,
  };
}
