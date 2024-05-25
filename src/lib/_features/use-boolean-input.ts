import _ from 'lodash';
import { ReadonlyProps, useReadonly } from './use-readonly';

export type BooleanProps = {
  value?: any;
  // [falseText, trueText]
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
  function getTrueValue() {
    return _.nth(props.values, 1) ?? true;
  }

  function isTrue(val: any) {
    if (_.isFunction(props.isTrue)) {
      return props.isTrue(val);
    }
    return val ? true : false;
  }

  function emitToggle() {
    if (Readonly.isReadonly()) {
      return;
    }
    let I = isTrue(props.value) ? 0 : 1;
    let vals = props.values ?? [];
    let val = vals[I];
    emit('change', val);
  }

  return {
    yes: isTrue(props.value),
    getTrueValue,
    isTrue,
    emitToggle,
  };
}
