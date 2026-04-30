import _ from "lodash";
import { computed } from "vue";
import { ReadonlyProps, useReadonly } from "./use-readonly";

export type BooleanProps = {
  value?: any;
  // [falseValue, trueValue]
  values?: [any, any];
  isTrue?: (val: any) => boolean;
  text?: string[] | string;
};

export type BooleanEmitter = {
  (eventName: "change", payload: any): void;
};

export type BooleanOptions = {
  emit: BooleanEmitter;
};

export function useBooleanInput(
  props: BooleanProps & ReadonlyProps,
  options: BooleanOptions
) {
  let { emit } = options;
  const _readonly = computed(() => useReadonly(props));
  // function getTrueValue() {
  //   return _.nth(props.values, 1) ?? true;
  // }

  const rawValue = computed(() => props.value);
  const Yes = computed(() => isTrue(props.value));
  const Text = computed(() => getBoolText());
  const Readonly = computed(() => _readonly.value.isReadonly(props.value));

  function getBoolText() {
    if (_.isString(props.text)) {
      return props.text;
    }
    if (_.isArray(props.text) && props.text.length > 0) {
      let ts = props.text;
      if (ts.length > 1) {
        return Yes.value ? ts[1] : ts[0];
      }
      return ts[0];
    }
    return "";
  }

  function getBoolValues() {
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
  }

  function isTrue(val: any) {
    // console.log("isTrue", val);
    if (_.isFunction(props.isTrue)) {
      return props.isTrue(val);
    }
    const BoolValues = getBoolValues();
    if (BoolValues.length > 1) {
      return _.isEqual(BoolValues[1], val);
    }
    return val ? true : false;
  }

  function emitToggle() {
    if (Readonly.value) {
      return;
    }
    const BoolValues = getBoolValues();
    let I = isTrue(props.value) ? 0 : 1;
    let val = BoolValues[I];
    emit("change", val);
  }

  return {
    rawValue,
    Yes,
    Text,
    emitToggle,
    Readonly,
  };
}
