import {
  I18n,
  IconInput,
  Icons,
  isIconInput,
  ReadonlyProps,
  useReadonly,
} from "@site0/tijs";
import _ from "lodash";
import { computed } from "vue";

export type BooleanProps = {
  value?: any;
  // [falseValue, trueValue]
  values?: [any, any];
  isTrue?: (val: any) => boolean;
  text?: string[] | string;
  icon?: IconInput | [IconInput, IconInput];
  tip?: string[] | string;
};

export type BooleanEmitter = {
  (eventName: "change", payload: any): void;
};

export type BooleanOptions = {
  emit: BooleanEmitter;
};

/**
 * 布尔值输入组件逻辑处理 hook
 * 用于处理布尔值类型的输入状态管理、文本显示及切换交互
 * 支持自定义真值/假值、判断函数和显示文本
 *
 * 当值为数字时，默认使用 [0, 1] 作为真值/假值
 * 当值为布尔值时，默认使用 [false, true] 作为真值/假值
 *
 * @param props 组件属性，包含值、自定义值、判断函数和显示文本
 * @param options 事件回调选项，包含 change 事件回调
 * @returns 布尔值输入组件逻辑处理接口对象
 */
export function useBooleanInput(
  props: BooleanProps & ReadonlyProps,
  options: BooleanOptions
) {
  let { emit } = options;
  //-----------------------------------------------------
  const _readonly = computed(() => useReadonly(props));
  const rawValue = computed(() => props.value);
  //-----------------------------------------------------
  const Yes = computed(() => isTrue(props.value));
  //-----------------------------------------------------
  const hasText = computed(() => (Text.value ? true : false));
  const hasIcon = computed(() => (Icon.value ? true : false));
  const hasTip = computed(() => (Tip.value ? true : false));
  //-----------------------------------------------------
  const Icon = computed(() => getBoolIcon());
  //-----------------------------------------------------
  const IconHtml = computed(() => {
    if (Icon.value) {
      return Icons.fontIconHtml(Icon.value);
    }
  });
  //-----------------------------------------------------
  const Text = computed(() => {
    let str = getBoolText();
    if (str) {
      return I18n.text(str);
    }
  });
  //-----------------------------------------------------
  const Tip = computed(() => {
    let str = getBoolTip();
    if (str) {
      return I18n.text(str);
    }
  });
  //-----------------------------------------------------
  const Readonly = computed(() => _readonly.value.isReadonly(props.value));
  //-----------------------------------------------------
  const DomClass = computed(() => {
    return {
      "is-on": Yes.value,
      "is-off": !Yes.value,
      "is-readonly": Readonly.value,
    };
  });
  //-----------------------------------------------------
  // 帮助函数
  //-----------------------------------------------------
  function getBoolIcon() {
    if (isIconInput(props.icon)) {
      return props.icon;
    }
    if (_.isArray(props.icon) && props.icon.length > 0) {
      let icons = props.icon;
      if (icons.length > 1) {
        return Yes.value ? icons[1] : icons[0];
      }
      return icons[0];
    }
  }
  //-----------------------------------------------------
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
  }
  //-----------------------------------------------------
  function getBoolTip() {
    if (_.isString(props.tip)) {
      return props.tip;
    }
    if (_.isArray(props.tip) && props.tip.length > 0) {
      let ts = props.tip;
      if (ts.length > 1) {
        return Yes.value ? ts[1] : ts[0];
      }
      return ts[0];
    }
  }
  //-----------------------------------------------------
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
  //-----------------------------------------------------
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
  //-----------------------------------------------------
  // 通知改动
  //-----------------------------------------------------
  function emitToggle(force: boolean = false) {
    if (Readonly.value) {
      return;
    }
    const BoolValues = getBoolValues();
    let I = isTrue(props.value) ? 0 : 1;
    let val = BoolValues[I];
    if (force || !_.isEqual(val, props.value)) {
      emit("change", val);
    }
  }
  //-----------------------------------------------------
  // 返回接口
  //-----------------------------------------------------
  return {
    rawValue,
    Yes,
    hasText,
    hasIcon,
    hasTip,
    Icon,
    IconHtml,
    Text,
    Tip,
    DomClass,
    Readonly,
    emitToggle,
  };
}
