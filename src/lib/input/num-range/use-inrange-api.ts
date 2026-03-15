import { I18n, NumRange, NumRangeInfo } from "@site0/tijs";
import _ from "lodash";
import { computed } from "vue";
import { InputNumRangeEmitter, InputNumRangeProps } from "./inrange-types";
import { open_inrange_editor } from "./support/open-inrange-editor";
import { getNumRangeInfoMsgKey } from "./support/parse-inrange";

export type TiInputNumRangeApi = ReturnType<typeof useTiInputNumRangeApi>;

export function useTiInputNumRangeApi(
  props: InputNumRangeProps,
  emit: InputNumRangeEmitter
) {
  //-----------------------------------------------------
  // 计算属性
  //-----------------------------------------------------
  const _range = computed(() => {
    return new NumRange(props.value);
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
    const msg = getNumRangeInfoMsgKey(Info.value);
    const { maxValue, minValue } = Info.value;
    const msgKey = `i18n:ti-input-num-range-info-${msg}`;
    return I18n.textf(msgKey, { maxValue, minValue });
  });
  //-----------------------------------------------------
  // 数据处理
  //-----------------------------------------------------
  //-----------------------------------------------------
  // 操作函数
  //-----------------------------------------------------
  async function editRange() {
    if (props.readonly) {
      return;
    }
    let re = await open_inrange_editor(props, Info.value);
    console.log(re);
    // 用户取消
    if (!re) {
      return;
    }

    let info = re as NumRangeInfo;

    if (!re.hasMinValue) {
      info.minValue = undefined;
      info.minValueIncluded = undefined;
    } else if (_.isNil(info.minValue)) {
      info.minValue = info.maxValue ?? 0;
    }

    if (!re.hasMaxValue) {
      info.maxValue = undefined;
      info.maxValueIncluded = undefined;
    } else if (_.isNil(info.maxValue)) {
      info.maxValue = info.minValue ?? 0;
    }

    // 删除值
    if (!re.hasMinValue && !re.hasMaxValue) {
      emit("change", null);
      return;
    }

    // 转换
    let nr = new NumRange(info);
    let val = nr.toString() || null;

    console.log(val, re);
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
    Info,
    InfoText,
    isEmpty,
    // 数据处理
    // 操作函数
    editRange,
    clearRange,
  };
}
