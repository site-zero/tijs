import _ from "lodash";
import { computed, ref } from "vue";
import { CodeEditorProps, openAppModal, TableRowID } from "../../../";
import { MoveDirection, Util } from "../../../core";
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
  const _checked_ids = ref<string[]>([]);
  const _current_id = ref<string>();
  //-----------------------------------------------------
  // 计算属性
  //-----------------------------------------------------
  const LineItems = computed(() => {
    let checkedIdMap = Util.arrayToMap(_checked_ids.value);
    let vals = splitValue();
    return vals.map((val, index) => {
      let checked = checkedIdMap.has(`${index}`);
      //console.log(index,val, checked)
      return {
        prefixIcon: checked ? "far-circle-check" : "far-circle",
        type: checked ? "primary" : undefined,
        value: val,
        index: index,
      };
    });
  });
  //-----------------------------------------------------
  const ActionBarVars = computed(() => ({
    hasCurrent: !_.isNil(_current_id.value),
    hasChecked: _checked_ids.value.length > 0,
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
  // 响应操作
  //-----------------------------------------------------
  function selectLines(
    currentId: TableRowID | undefined | null,
    checkedIds: TableRowID[]
  ) {
    _current_id.value = _.isNil(currentId) ? undefined : `${currentId}`;
    _checked_ids.value = _.map(checkedIds, (id) => `${id}`);
  }
  //-----------------------------------------------------
  function onLineChange(index: number, val: string | null) {
    let vals = LineItems.value.map((item) => item.value);
    //console.log(index, val);
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
  // 修改数据
  //-----------------------------------------------------
  function addLine() {
    let vals = LineItems.value.map((item) => item.value);
    let list = [...vals, "New_Item"];
    let newVal = joinValue(list);
    let index = vals.length;
    //console.log(index, newVal);
    tryNotify(newVal);
    selectLines(index, [index]);
  }
  //-----------------------------------------------------
  function removeChecked() {
    if (_.isEmpty(_checked_ids.value)) return;
    let idMap = Util.arrayToMap(_checked_ids.value);
    let vals = LineItems.value.map((item) => item.value);
    let list = [...vals];
    let list2 = _.filter(list, (_li, index) => !idMap.has(`${index}`));
    let newVal = joinValue(list2);
    tryNotify(newVal);
    _current_id.value = undefined;
    _checked_ids.value = [];
  }
  //-----------------------------------------------------
  function moveChecked(dir: MoveDirection) {
    // 防空
    if (_.isEmpty(_checked_ids.value)) return;

    // 为所有的项目分派 ID = 原始下标
    let idMap = Util.arrayToMap(_checked_ids.value);
    let currentId = `${_current_id.value ?? ""}`;
    let list = LineItems.value.map((item, index) => ({
      id: `${index}`,
      val: item.value,
    }));

    // 移动一步
    let list2 = Util.moveChecked(
      list,
      (li) => {
        return idMap.has(li.id);
      },
      dir
    );

    // 看看新列表， ID 都变成什么了
    // 做一下新下标的转换
    let newCurrentId: string | undefined = undefined;
    let newCheckedIds: string[] = [];
    let newVals: string[] = [];
    _.forEach(list2, (li, index) => {
      if (currentId == li.id) {
        newCurrentId = `${index}`;
      }
      if (idMap.has(li.id)) {
        newCheckedIds.push(`${index}`);
      }
      newVals.push(li.val);
    });

    let newVal = joinValue(newVals);
    tryNotify(newVal);
    _current_id.value = newCurrentId;
    _checked_ids.value = newCheckedIds;
  }
  //-----------------------------------------------------
  async function viewCode() {
    let vals = LineItems.value.map((item) => item.value);
    let str = vals.join("\n");
    let res = await openAppModal({
      title: "i18n:edit",
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
    _checked_ids,
    _current_id,
    // 计算属性
    LineItems,
    ActionBarVars,
    CurrentId: computed(() => _current_id.value),
    CheckedIds: computed(() => _checked_ids.value),
    // 处理值
    joinValue,
    tryNotify,
    // 响应操作
    selectLines,
    onLineChange,
    // 修改数据
    addLine,
    viewCode,
    removeChecked,
    moveChecked
  };
}
