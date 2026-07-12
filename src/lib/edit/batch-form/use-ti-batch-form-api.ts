import { DataChangeMode, FieldChange, Util, Vars } from "@site0/tijs";
import _ from "lodash";
import { computed, ref } from "vue";
import { BatchFormEmitter, BatchFormProps } from "./ti-batch-form-types";

export type TiBatchFormApi = ReturnType<typeof useTiBatchFormApi>;

export function useTiBatchFormApi(
  props: BatchFormProps,
  emit: BatchFormEmitter
) {
  //-----------------------------------------------------
  // 数据模型
  //-----------------------------------------------------
  const _checked_name = ref<Record<string, boolean>>({});
  //-----------------------------------------------------
  // 计算属性
  //-----------------------------------------------------
  const CheckedNames = computed(() => _checked_name.value);
  //-----------------------------------------------------
  function mergeFormData(delta: Vars) {
    let cm: DataChangeMode = props.changeMode ?? "diff";

    // 准备数据
    let data = delta;
    if (cm === "all") {
      data = Util.jsonClone(props.data ?? {});
      _.assign(data, delta);
    }

    // 过滤字段
    let d2 = _.pickBy(data, (_v, k) => isFieldChecked(k));

    return d2;
  }
  //-----------------------------------------------------
  // 判断函数
  //-----------------------------------------------------
  function isFieldChecked(name: string) {
    return _checked_name.value[name] ? true : false;
  }
  //-----------------------------------------------------
  function isFieldDisabled(ctx: any) {
    // 如果是 Field Group 自然就是没有 $field 的
    if (!ctx.$field) {
      return false;
    }
    // 普通字段，需要验证一下
    let fnames = _.concat([], ctx.$field.name);
    //console.log("is_disable", fnames, _checked_name.value);
    for (let fnm of fnames) {
      if (!isFieldChecked(fnm)) {
        return true;
      }
    }
    return false;
  }
  //-----------------------------------------------------
  // 数据改动
  //-----------------------------------------------------
  function onNameChange(payload: FieldChange) {
    let { name, value } = payload;
    let nms = _.concat([], name);
    for (let nm of nms) {
      _checked_name.value[nm] = value;
    }
    onFormChange({});
  }
  //-----------------------------------------------------
  function onFormChange(delta: Vars) {
    // 过滤字段
    let d2 = mergeFormData(delta);

    // 防空
    if (_.isEmpty(d2)) {
      if (!_.isEmpty(props.data)) {
        emit("change", {});
      }
      return;
    }

    // 仅仅寻求改变
    tryNotifyChange(d2);
  }
  //-----------------------------------------------------
  // 通知改动
  //-----------------------------------------------------
  function tryNotifyChange(newData: Vars) {
    // TODO 或许 changeMode 为 diff 的时候，需要用
    // !_.isMatch(props.data || {}, newData)
    // 但是这个批量修改控件，似乎应该总是 'all' 模式
    // 当遇到更鲜活的场景再微调吧
    if (!_.isEqual(props.data || {}, newData)) {
      emit("change", newData);
    }
  }
  //-----------------------------------------------------
  // 返回接口
  //-----------------------------------------------------
  return {
    // 计算属性
    CheckedNames,
    mergeFormData,
    // 操作函数
    // 判断函数
    isFieldChecked,
    isFieldDisabled,
    // 数据改动
    onNameChange,
    onFormChange,
  };
}
