import { EditPairsValueType, StrOptionItem, Vars } from "@site0/tijs";
import JSON5 from "json5";
import _ from "lodash";
import { computed } from "vue";
import { TiEditPairsEmitter, TiEditPairsProps } from "./edit-pairs-types";

export type EditPairsApi = ReturnType<typeof useTiEditPairsApi>;

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
  const ValueMode = computed(() => props.valueMode || "flat");
  const FormMode = computed(() => props.formMode || "simple");
  //-----------------------------------------------------
  const OtherGroup = computed(() => {
    return (
      props.otherGroup || {
        text: "Others",
        value: "others",
      }
    );
  });
  //-----------------------------------------------------
  const TabItams = computed(() => {
    let re = [] as StrOptionItem[];
    if (props.groups) {
      re.push(...props.groups);
      if (props.otherGroup) {
        re.push(props.otherGroup);
      }
    }
    // 动态分组
    else if (ValueMode.value == "nested") {
      const titles = props.titles || {};
      for (let key of _.keys(ValueObj.value)) {
        const text = titles[key] || key;
        re.push({ text, value: key });
      }
    }
    // simple 对象，且没有指定分组方式，且还要按照 TabForm 显示
    // 这个场景，通常是调用者脑壳被挤了一下导致的，凑合显示一下，
    // 他看到结果自然就会认识到自己是犯了一个错误
    // 不管怎么样，就用 Others 来收集所有的字段吧
    else {
      re.push(OtherGroup.value);
    }

    return re;
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
    ValueObj,
    ValueType,
    ValueMode,
    FormMode,
    OtherGroup,

    // 操作函数
    // 数据校验
    // 数据改动
    // 远程操作
  };
}
