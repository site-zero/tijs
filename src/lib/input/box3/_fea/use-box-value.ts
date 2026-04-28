import {
  AnyOptionItem,
  Convertor,
  isAnyOptionItem,
  Str,
  Vars,
} from "@site0/tijs";
import _ from "lodash";
import { computed } from "vue";
import { BoxValueProps } from "./types-box-value";

export type BoxValueSetup = {
  toOptionItem: Convertor<Vars | null | undefined, AnyOptionItem | null>;
};

export function useBoxValue(props: BoxValueProps, setup: BoxValueSetup) {
  const { toOptionItem } = setup;
  //-----------------------------------------------------
  // 计算属性
  //-----------------------------------------------------
  const BoxValueType = computed(() => props.valueType || "val");
  const PropsRawValue = computed(() => props.value);
  const PropsStrValue = computed(() => {
    if (_.isNil(props.value)) {
      return null;
    }
    if (isAnyOptionItem(props.value)) {
      return Str.anyToStr(props.value.value ?? null);
    }
    if (_.isPlainObject(props.value)) {
      let it = toOptionItem(props.value);
      return Str.anyToStr(it?.value ?? null);
    }
    return Str.anyToStr(props.value);
  });
  //-----------------------------------------------------
  // 帮助函数
  //-----------------------------------------------------
  function unifyValue(val: any, currentItem?: Vars | undefined) {
    let vtype = BoxValueType.value;
    let newVal: any = null;
    if (!_.isNil(val)) {
      // 裸对象
      if ("raw-item" == vtype) {
        if (currentItem) {
          newVal = _.cloneDeep(currentItem);
        } else {
          newVal = val;
        }
      }
      // 标准对象
      else if ("std-item" == vtype) {
        if (currentItem) {
          newVal = toOptionItem(currentItem);
        } else {
          newVal = { value: val };
        }
      }
      // 默认就用值
      else {
        newVal = val;
      }
    }
    return newVal;
  }
  //-----------------------------------------------------
  // 返回接口
  //-----------------------------------------------------
  return {
    BoxValueType,
    PropsRawValue,
    PropsStrValue,
    //--------
    unifyValue,
  };
}
