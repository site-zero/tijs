import {
  AnyRange,
  AppModalProps,
  FieldValueType,
  I18n,
  isRangeInfo,
  isRangeObj,
  MatchValueType,
  RangeApiProps,
  RangeInfo,
  RangeValue,
  RangeValueType,
  Vars,
} from "@site0/tijs";
import _ from "lodash";
import { computed } from "vue";
import { open_range_editor } from "./open-range-editor";
import { get_range_info_msg_key } from "./range-msg-key";

export type InputRangeEmitter<T> = {
  (event: "change", payload: RangeValue<T> | null): void;
};

export type InputRangeApi<T, C extends Vars, V extends Vars> = ReturnType<
  typeof useInputRangeApi<T, C, V>
>;

export type InputRangeApiSetup<T> = {
  //默认值编辑控件
  valueComType: () => string;
  valueToRange: (value: RangeValue<T>) => AnyRange<T>;
  emit: InputRangeEmitter<T>;
  isMatchType: MatchValueType<T>;
  /**
   * 譬如 `ti-input-num`
   */
  msgPrefix: string;
  defaultValue: T;
  editFieldType: FieldValueType;
  /**
   * 编辑对话框的细节配置
   */
  editDialog?: () => AppModalProps;
};

export function useInputRangeApi<T, C extends Vars, V extends Vars>(
  props: RangeApiProps<T, C, V>,
  setup: InputRangeApiSetup<T>
) {
  const { valueToRange, emit, isMatchType, msgPrefix, defaultValue } = setup;
  //-----------------------------------------------------
  // 计算属性
  //-----------------------------------------------------
  const _range = computed(() => {
    return valueToRange(props.value || "()");
  });
  //-----------------------------------------------------
  const Info = computed(() => {
    return _range.value.toRangeInfo();
  });
  //-----------------------------------------------------
  const isEmpty = computed(() => {
    return !Info.value.hasMinValue && !Info.value.hasMinValue;
  });
  //-----------------------------------------------------
  const InfoText = computed(() => {
    const msg = get_range_info_msg_key(Info.value);
    const { maxValue, minValue } = Info.value;
    const msgKey = `i18n:${_.kebabCase(msgPrefix)}-info-${msg}`;
    return I18n.textf(msgKey, { maxValue, minValue });
  });
  //-----------------------------------------------------
  const InputValueType = computed((): RangeValueType | null => {
    if (_.isNil(props.value)) return null;
    if (_.isString(props.value)) return "str";
    if (_.isArray(props.value)) return "array";
    if (isRangeObj(props.value, isMatchType)) return "obj";
    if (isRangeInfo(props.value, isMatchType)) return "info";
    return null;
  });
  //-----------------------------------------------------
  const OutputValueType = computed((): RangeValueType => {
    if (!props.valueType || props.valueType == "auto") {
      return InputValueType.value || "str";
    }
    return props.valueType;
  });
  //-----------------------------------------------------
  // 帮助函数
  //-----------------------------------------------------
  function to_output_value(rv: AnyRange<T>): RangeValue<T> {
    let vt = OutputValueType.value;
    return (
      {
        str: () => rv.toString(),
        array: () => {
          if (rv.invalid || !rv.left || !rv.right) {
            return [];
          }
          return [rv.left?.value, rv.right?.value];
        },
        obj: () => rv.toRangeObj(),
        info: () => rv.toRangeInfo(),
      } as Record<RangeValueType, () => RangeValue<T>>
    )[vt]();
  }
  //-----------------------------------------------------
  async function editRange() {
    if (props.readonly) {
      return;
    }
    let re = await open_range_editor(props, Info.value, setup);
    console.log(re);
    // 用户取消
    if (!re) {
      return;
    }

    let info = re as RangeInfo<T>;

    if (!re.hasMinValue) {
      info.minValue = undefined;
      info.minValueIncluded = undefined;
    } else if (_.isNil(info.minValue)) {
      info.minValue = info.maxValue ?? defaultValue;
    }

    if (!re.hasMaxValue) {
      info.maxValue = undefined;
      info.maxValueIncluded = undefined;
    } else if (_.isNil(info.maxValue)) {
      info.maxValue = info.minValue ?? defaultValue;
    }

    // 删除值
    if (!re.hasMinValue && !re.hasMaxValue) {
      emit("change", null);
      return;
    }

    // 转换
    let rv = valueToRange(info);
    let val = to_output_value(rv);

    // 通知改动
    emit("change", val);
  }
  //-----------------------------------------------------
  function clearRange() {
    emit("change", null);
  }
  //-----------------------------------------------------
  // 返回接口
  //-----------------------------------------------------
  return {
    // 计算属性
    _range,
    InputValueType,
    OutputValueType,
    Info,
    InfoText,
    isEmpty,
    // 数据处理
    // 操作函数
    editRange,
    clearRange,
  };
}
