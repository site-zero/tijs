import { Str, usePlaceholder, useReadonly } from "@site0/tijs";
import JSON5 from "json5";
import _ from "lodash";
import { computed, ref } from "vue";
import { InputTextEmitter, InputTextProps } from "./ti-input-text-types";

type InputTextApiSetup = {
  getElement: () => HTMLDivElement | null;
  getTextElement: () => HTMLTextAreaElement | null;
  emit: InputTextEmitter;
};

export function useInputTextApi(
  props: InputTextProps,
  setup: InputTextApiSetup
) {
  const { getElement, getTextElement, emit } = setup;
  //-----------------------------------------------------
  // 数据模型
  //-----------------------------------------------------
  const _focused = ref(false);
  const _readonly = computed(() => useReadonly(props));
  //-----------------------------------------------------
  // 计算属性
  //-----------------------------------------------------
  const isFocused = computed(() => _focused.value);
  const hasValue = computed(() => !_.isNil(props.value));
  //-----------------------------------------------------
  const isReadonly = computed(() => _readonly.value.isReadonly(props.value));
  const Placeholder = computed(() => usePlaceholder(props));
  //-----------------------------------------------------
  function getTextValue() {
    let input = props.value;

    if (_.isNil(input)) {
      return "";
    }

    if (_.isString(input)) {
      return input;
    }

    if (_.isArray(input)) {
      let ss = _.map(input, (it) => Str.anyToStr(it));
      return ss.join("\n");
    }

    if (_.isError(input)) {
      return [input.name, input.message].join(": ");
    }

    if (_.isObject(input)) {
      return JSON5.stringify(input, null, "    ");
    }

    return input + "";
  }
  //-----------------------------------------------------
  // 操作函数
  //-----------------------------------------------------
  function setFocus(focus: boolean) {
    _focused.value = focus;
  }
  //-----------------------------------------------------
  function onTextChange(evt: Event) {
    let $t = evt.target as HTMLTextAreaElement;
    let v = $t.value;
    tryNotify(v);
  }
  //-----------------------------------------------------
  function tryNotify(newVal: any) {
    let v2 = newVal;

    // 简单文本值: Trim
    if (props.trimed) {
      v2 = _.trim(newVal);
    }

    // 处理列表类型的值
    if ("list" == props.valueType) {
      v2 = Str.splitIgnoreBlank(v2, /\r?\n/g);
    }

    if (!_.isEqual(v2, props.value)) {
      emit("change", v2);
    }
  }
  //-----------------------------------------------------
  // 输出接口
  //-----------------------------------------------------
  return {
    getElement,
    getTextElement,
    hasValue,
    isReadonly,
    isFocused,
    Placeholder,
    getTextValue,
    onTextChange,
    setFocus,
    tryNotify,
  };
}
