import _ from "lodash";
import { computed, ref } from "vue";
import { CodeEditorProps, LogicType, openAppModal } from "../../../";
import { I18n, MoveDirection, Str, Util } from "../../../core";
import {
  InputMultiLinesEmitter,
  InputMultiLinesProps,
} from "./ti-input-multi-lines-types";

export type TiInputMultiLinesApi = ReturnType<typeof useTiInputMultiLinesApi>;

export function useTiInputMultiLinesApi(
  props: InputMultiLinesProps,
  emit: InputMultiLinesEmitter
) {
  //-----------------------------------------------------
  // 状态
  //-----------------------------------------------------
  const _checked_indexes = ref<number[]>([]);
  const _current_index = ref<number>(-1);
  //const _list_items = ref<Vars[]>([]);
  //-----------------------------------------------------
  // 计算属性
  //-----------------------------------------------------
  const LineItems = computed(() => makeListItems());
  //-----------------------------------------------------
  function makeListItems() {
    let checkedIdMap = Util.arrayToMap(_checked_indexes.value);
    let vals = splitValue();
    // console.log(
    //   `makeListItems: value=[${props.value}]; vals.length=${vals.length}`
    // );
    return vals.map((val, index) => {
      let checked = checkedIdMap.has(index);
      let current = _current_index.value === index;
      let type: LogicType | undefined = checked
        ? props.checkedItemType
        : undefined;
      if (Str.isBlank(val)) {
        if (checked) {
          type = props.checkedEmptyItemType ?? props.checkedItemType;
        } else {
          type = props.emptyItemType;
        }
      }
      //console.log(index, val, checked, type);
      return {
        prefixIcon: checked ? "far-circle-check" : "far-circle",
        type,
        className: {
          "is-checked": checked,
          "no-checked": !checked,
          "is-current": current,
          "no-current": !current,
        },
        value: _.trim(val),
        index: index,
      };
    });
  }
  //-----------------------------------------------------
  const isEmpty = computed(() => {
    return LineItems.value.length === 0;
  });
  //-----------------------------------------------------
  const ActionBarVars = computed(() => ({
    hasCurrent: _current_index.value >= 0,
    hasChecked: _checked_indexes.value.length > 0,
  }));
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
  function __rebuild_item_selection(vals: string[]) {
    // 建立就数据索引: Curent Item
    let current_item_val: string | undefined = undefined;
    if (
      _current_index.value >= 0 &&
      _current_index.value < LineItems.value.length
    ) {
      current_item_val = LineItems.value[_current_index.value].value;
    }
    // 建立就数据索引: Checked Items
    let checked_item_vals = new Map<string, boolean>();
    let idxMap = Util.arrayToMap(_checked_indexes.value);
    for (let i = 0; i < LineItems.value.length; i++) {
      let item = LineItems.value[i];
      if (idxMap.get(item.index)) {
        checked_item_vals.set(item.value, true);
      }
    }
    // 准备新的选区值
    let new_cc_idx = -1;
    let new_ck_idxs = [] as number[];
    // 循环值，建立新的选区
    for (let i = 0; i < vals.length; i++) {
      let v = vals[i];
      if (new_cc_idx < 0 && v == current_item_val) {
        new_cc_idx = i;
      }
      if (checked_item_vals.get(v)) {
        new_ck_idxs.push(i);
      }
    }
    // 更新选区
    _current_index.value = new_cc_idx;
    _checked_indexes.value = new_ck_idxs;
  }
  //-----------------------------------------------------
  // 响应操作
  //-----------------------------------------------------
  function selectLines(
    currentIndex: number | undefined | null,
    checkedIndex: number[]
  ) {
    if (
      _current_index.value == currentIndex &&
      _.isEqual(_checked_indexes.value, checkedIndex)
    ) {
      return false;
    }
    _current_index.value = currentIndex ?? -1;
    _checked_indexes.value = checkedIndex;
    //console.log("----------------------checked ids: ", _checked_indexes.value);
    return true;
  }
  //-----------------------------------------------------
  function toggleLine(index: number) {
    let ckIdxs = [..._checked_indexes.value];
    let I = _.findIndex(ckIdxs, (idx) => idx == index);
    if (I >= 0) {
      ckIdxs.splice(I, 1);
      _checked_indexes.value = ckIdxs.sort();
    } else {
      ckIdxs.push(index);
      _checked_indexes.value = ckIdxs.sort();
    }
    if (_current_index.value == index) {
      _current_index.value = -1;
    }
  }
  //-----------------------------------------------------
  function onLineChange(index: number, val: string | null) {
    let vals = LineItems.value.map((item) => item.value);
    //console.log(index, val);
    let list = [...vals];
    list[index] = val || "";
    let newVal = joinValue(list);
    tryNotify(newVal);
  }
  //-----------------------------------------------------
  // 修改数据
  //-----------------------------------------------------
  function addLine() {
    let vals = LineItems.value.map((item) => item.value);
    let list = [...vals, props.newItem ?? ""];
    let newVal = joinValue(list);
    let index = vals.length;
    //console.log(index, newVal);
    tryNotify(newVal);
    selectLines(index, [index]);
  }
  //-----------------------------------------------------
  function removeChecked() {
    if (_.isEmpty(_checked_indexes.value)) return;
    let idxMap = Util.arrayToMap(_checked_indexes.value);
    let vals = LineItems.value.map((item) => item.value);
    let list = [...vals];
    let list2 = _.filter(list, (_li, index) => !idxMap.has(index));
    let newVal = joinValue(list2);
    __rebuild_item_selection(list2);
    tryNotify(newVal);
  }
  //-----------------------------------------------------
  function moveChecked(dir: MoveDirection) {
    // 防空
    if (_.isEmpty(_checked_indexes.value)) return;

    // 为所有的项目分派 ID = 原始下标
    let idxMap = Util.arrayToMap(_checked_indexes.value);
    let list = LineItems.value.map((item, index) => ({
      index,
      val: item.value,
    }));

    // 移动一步
    let list2 = Util.moveChecked(
      list,
      (li) => {
        return idxMap.has(li.index);
      },
      dir
    );

    // 看看新列表， ID 都变成什么了
    // 做一下新下标的转换
    let newVals = _.map(list2, (li) => li.val);
    __rebuild_item_selection(newVals);

    let newVal = joinValue(newVals);
    tryNotify(newVal);
  }
  //-----------------------------------------------------
  async function viewCode() {
    let vals = LineItems.value.map((item) => item.value);
    let str = vals.join("\n");
    let vjson = JSON.stringify(props.value);
    if (vjson.length > 50) {
      vjson = vjson.substring(0, 50) + "...";
    }
    let title = [I18n.get("edit"), `"${vjson}"`].join(": ");
    let res = await openAppModal({
      title,
      type: "primary",
      position: "top",
      width: "640px",
      height: "62%",
      minHeight: "480px",
      clickMaskToClose: true,
      result: str,
      comType: "TiCodeEditor",
      comConf: {} as CodeEditorProps,
    });

    // 用户取消
    if (_.isUndefined(res)) {
      return;
    }

    // 搞一下
    let list = _.trim(res).split(/\r?\n/g);
    let newVal = joinValue(list);
    tryNotify(newVal);
  }
  //-----------------------------------------------------
  // 返回接口
  //-----------------------------------------------------
  return {
    _checked_indexes,
    _current_index,
    // 计算属性
    LineItems,
    isEmpty,
    ActionBarVars,
    // 处理值
    joinValue,
    tryNotify,
    // 响应操作
    toggleLine,
    selectLines,
    onLineChange,
    // 修改数据
    addLine,
    viewCode,
    removeChecked,
    moveChecked,
  };
}
