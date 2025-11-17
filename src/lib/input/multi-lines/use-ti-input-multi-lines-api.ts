import _ from "lodash";
import {
  TiInputMultiLinesEmitter,
  TiInputMultiLinesProps,
} from "./ti-input-multi-lines-types";
import { computed } from "vue";

export type TiInputMultiLinesApi = ReturnType<typeof useTiInputMultiLinesApi>;

export function useTiInputMultiLinesApi(
  props: TiInputMultiLinesProps,
  emit: TiInputMultiLinesEmitter
) {
  //-----------------------------------------------------
  // 计算属性
  //-----------------------------------------------------
  const LineItems = computed(() => {
    let vals = splitValue();
    return vals.map((val, index) => ({
      value: val,
      index: index,
    }));
  });
  //-----------------------------------------------------
  // 处理数据
  //-----------------------------------------------------
  function splitValue(): string[] {
    if (_.isNil(props.value)) {
      return [];
    }
    if (_.isArray(props.value)) {
      return props.value;
    }
    let input = `${props.value}`;
    let format = props.splitValue ?? ",";

    if (_.isFunction(format)) {
      return format(input);
    }
    if (_.isString(format) || _.isRegExp(format)) {
      return input.split(format);
    }
    return [input];
  }
  //-----------------------------------------------------
  // 处理值
  //-----------------------------------------------------
  function joinValue(vals: string[]) {
    // 过滤空值
    if (props.autoFilterNilItem) {
      vals = vals.filter((item) => !_.isNil(item));
    }
    // 处理空数组
    if (props.emptyAsNull && vals.length === 0) {
      return null;
    }

    // 拼合字符串
    if (_.isString(props.joinValue)) {
      return vals.join(props.joinValue);
    }

    // 自定义拼合
    if (_.isFunction(props.joinValue)) {
      return props.joinValue(vals);
    }

    // 根据输入内容: 数组
    if (_.isArray(props.value)) {
      return [...vals];
    }

    // 默认输入内容为字符串
    let sep = props.joinValue ?? ",";
    return vals.join(sep);
  }
  //-----------------------------------------------------
  function tryNotify(newVal: string | string[] | null) {
    if (!_.isEqual(newVal, props.value)) {
      emit("change", newVal);
    }
  }
  //-----------------------------------------------------
  // 响应操作
  //-----------------------------------------------------
  function onLineChange(index: number, val: string | null) {
    let vals = LineItems.value.map((item) => item.value);
    console.log(index, val);
    let list = [...vals];
    // null 表示移除
    if (_.isNil(val)) {
      list.splice(index, 1);
    }
    // 其他的是更新
    else {
      list[index] = val;
    }
    let newVal = joinValue(list);
    tryNotify(newVal);
  }

  //-----------------------------------------------------
  // 返回接口
  //-----------------------------------------------------
  return {
    // 计算属性
    LineItems,
    // 处理值
    joinValue,
    tryNotify,
    // 响应操作
    onLineChange,
  };
}
