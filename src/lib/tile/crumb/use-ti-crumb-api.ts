import _ from "lodash";
import { StdOptionItem, StrOptionItem, TableRowID, Vars } from "../../../_type";
import { useStdListItem } from "../../_features";
import { CrumbEmitter, CrumbProps } from "./ti-crumb-types";
import { computed } from "vue";
import { CssUtils } from "../../../core";

export type TiCrumbApi = ReturnType<typeof useTiCrumbApi>;

export function useTiCrumbApi(props: CrumbProps, emit: CrumbEmitter) {
  //-----------------------------------------------------
  // 归一化获取项 ID 的方法
  //-----------------------------------------------------
  let _get_id: (it: Vars) => TableRowID;
  if (props.getValue) {
    // 用户指定了键
    if (_.isString(props.getValue)) {
      let k = props.getValue;
      _get_id = (it: Vars) => _.get(it, k);
    }
    // 用户指定了 getter
    else {
      let getter = props.getValue;
      _get_id = (it: Vars) => getter(it);
    }
  }
  //-----------------------------------------------------
  const { toStdItem } = useStdListItem({
    ...props,
    getValue: (it: Vars, _index: number) => {
      return _get_id(it);
    },
  });
  //-----------------------------------------------------
  // 计算属性
  //-----------------------------------------------------
  const RawItems = computed(() => props.data || []);
  //-----------------------------------------------------
  const StdItems = computed(() => {
    let stdItems: StdOptionItem[] = [];
    for (let i = 0; i < RawItems.value.length; i++) {
      let it = RawItems.value[i];
      let stdItem = { ...toStdItem(it, i) };
      let current = props.currentItemId == stdItem.value;
      if (current) {
        stdItem.className = CssUtils.mergeClassName(it.className, {
          "is-current": current,
        });
      }
      stdItems.push(stdItem);
    }
    return stdItems;
  });
  //-----------------------------------------------------
  // 响应函数
  //-----------------------------------------------------
  function onClickItem(id: TableRowID | undefined | null) {
    if (_.isNil(id)) {
      emit("change", null);
    }
    // 传递 ID
    else if ("id" == props.emitValueType) {
      emit("change", id);
    }
    // 传递 原始项
    else if ("raw-item" == props.emitValueType) {
      let rawItem = _.cloneDeep(
        _.find(RawItems.value, (it) => {
          return id == _get_id(it);
        })
      );
      emit("change", rawItem);
    }
    // 传递 标准项
    else if ("std-item" == props.emitValueType) {
      let stdItem = _.cloneDeep(
        _.find(StdItems.value, (it: StrOptionItem) => {
          return id == it.value;
        })
      );
      emit("change", stdItem);
    }
    // 未知值类型，那就简单警告一下吧
    else {
      console.warn(`Unsupported emitValueType: '${props.emitValueType}'`);
    }
  }
  //-----------------------------------------------------
  // 返回接口
  //-----------------------------------------------------
  return {
    RawItems,
    StdItems,
    onClickItem,
  };
}
