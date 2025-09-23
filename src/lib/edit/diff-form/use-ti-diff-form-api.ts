import _ from "lodash";
import { FormFieldItem } from "../../shelf/all-shelf";
import { TiDiffFormEmitter, TiDiffFormProps } from "./ti-diff-form-types";

export type DiffFormResult = {};

export type TiDiffFormApi = ReturnType<typeof useTiDiffFormApi>;

export function useTiDiffFormApi(
  _props: TiDiffFormProps,
  _emit: TiDiffFormEmitter
) {
  //-----------------------------------------------------
  // 数据模型
  //-----------------------------------------------------
  function buildDiffResult(fields: FormFieldItem[]) {
    // 防空
    if (_.isEmpty(fields)) {
      return;
    }
  }
  //-----------------------------------------------------
  // 返回接口
  //-----------------------------------------------------
  return {};
}
