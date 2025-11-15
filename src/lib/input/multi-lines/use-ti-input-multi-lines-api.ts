import _ from "lodash";
import {
  TiInputMultiLinesProps,
  TiInputMultiLinesEmitter,
} from "./ti-input-multi-lines-types";

export type TiInputMultiLinesApi = ReturnType<typeof useTiInputMultiLinesApi>;

export function useTiInputMultiLinesApi(
  props: TiInputMultiLinesProps,
  _emit: TiInputMultiLinesEmitter
) {
  //-----------------------------------------------------
  // 处理数据
  //-----------------------------------------------------
  function formatValue(): string[] {
    if (_.isNil(props.value)) {
      return [];
    }
    if (_.isArray(props.value)) {
      return props.value;
    }
    let input = `${props.value}`;
    let format = props.format ?? ",";

    if (_.isFunction(format)) {
      return format(input);
    }
    if (_.isString(format) || _.isRegExp(format)) {
      return input.split(format);
    }
    return [input];
  }
  //-----------------------------------------------------
  // 响应操作
  //-----------------------------------------------------
  //-----------------------------------------------------
  // 返回接口
  //-----------------------------------------------------
  return {
    // 处理数据
    formatValue,
  };
}
