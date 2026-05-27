import { EditPairsValueType, StrOptionItem, Vars } from "@site0/tijs";
import JSON5 from "json5";
import _ from "lodash";
import { computed } from "vue";
import { EditPairsEmitter, EditPairsProps } from "./edit-pairs-types";

export type EditPairsApi = ReturnType<typeof useTiEditPairsApi>;

export function useTiEditPairsApi(
  props: EditPairsProps,
  _emit: EditPairsEmitter
) {
  //-----------------------------------------------------
  // 数据模型
  //-----------------------------------------------------

  //-----------------------------------------------------
  // 计算属性
  //-----------------------------------------------------
  // 归一化输入对象
  const ValueObj = computed((): Vars => {
    if (_.isNil(props.value)) {
      return {};
    }
    if (_.isString(props.value)) {
      return JSON5.parse(props.value);
    }
    return props.value;
  });
  //-----------------------------------------------------
  const ValueType = computed((): EditPairsValueType => {
    const vt = props.valueType || "auto";
    if ("auto" == vt) {
      if (_.isNil(props.value)) return "obj";
      if (_.isString(props.value)) return "str";
      return "obj";
    }
    return vt;
  });
  //-----------------------------------------------------
  const FormMode = computed(() => props.formMode || "simple");
  //-----------------------------------------------------
  // 帮助函数
  //-----------------------------------------------------
  //-----------------------------------------------------
  // 操作函数
  //-----------------------------------------------------

  //-----------------------------------------------------
  // 数据校验
  //-----------------------------------------------------

  //-----------------------------------------------------
  // 数据改动
  //-----------------------------------------------------

  //-----------------------------------------------------

  //-----------------------------------------------------
  // 返回接口
  //-----------------------------------------------------
  return {
    // 计算属性
    ValueObj,
    ValueType,
    FormMode,

    // 操作函数
    // 数据校验
    // 数据改动
    // 远程操作
  };
}
