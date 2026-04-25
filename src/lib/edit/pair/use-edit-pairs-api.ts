import {
  DataValidation,
  FieldStatus,
  KeepInfo,
  TableSelectEmitInfo,
  useValidateResults,
  V,
  ValidateOptions,
  Vars,
} from "@site0/tijs";
import _ from "lodash";
import { computed } from "vue";
import JSON5 from "json5";
import { TiEditPairsProps, TiEditPairsEmitter } from "./edit-pairs-types";

export type TiEditPairsApi = ReturnType<typeof useTiEditPairsApi>;

export function useTiEditPairsApi(
  props: TiEditPairsProps,
  _emit: TiEditPairsEmitter
) {
  //-----------------------------------------------------
  // 数据模型
  //-----------------------------------------------------

  //-----------------------------------------------------
  // 计算属性
  //-----------------------------------------------------
  const InputObj = computed((): Vars => {
    if (_.isNil(props.value)) {
      return {};
    }
    if (_.isString(props.value)) {
      return JSON5.parse(props.value);
    }
    return props.value;
  });
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
    // 操作函数
    // 数据校验
    // 数据改动
    // 远程操作
  };
}
