import {
  FieldStatus,
  TableRowID,
  TableSelectEmitInfo,
  Util,
  ValidateOptions,
  Vars,
} from "@site0/tijs";
import _ from "lodash";
import { computed, ref } from "vue";
import { EditTableEmitter, EditTableProps } from "./edit-table-types";

export type EditTableApi = ReturnType<typeof useEditTableApi>;

export function useEditTableApi(props: EditTableProps, emit: EditTableEmitter) {
  const _get_item_id = computed(() =>
    Util.genItemGetter<TableRowID>(props.getId, {})
  );
  //-----------------------------------------------------
  // 数据模型
  //-----------------------------------------------------
  const _list_data = ref<Vars[]>([]);
  const _current_id = ref<TableRowID | null>();
  const _checked_ids = ref<TableRowID[]>([]);
  //-----------------------------------------------------
  // 计算属性
  //-----------------------------------------------------
  const ListData = computed(() => _list_data.value);
  const CurrentId = computed(() => _current_id.value);
  const CheckedIds = computed(() => _checked_ids.value);
  //-----------------------------------------------------
  const hasCurrent = computed(() =>
    _.isNil(_current_id.value) ? false : true
  );
  const hasChecked = computed(() => !_.isEmpty(_checked_ids.value));
  //-----------------------------------------------------
  const ActionBarVars = computed((): Vars => {
    return {
      hasCurrent: hasCurrent.value,
      hasChecked: hasChecked.value,
    };
  });
  //-----------------------------------------------------
  // 查询函数
  //-----------------------------------------------------
  function getItemIndex(id: TableRowID | undefined | null) {
    if (_.isNil(id)) return -1;
    return _.findIndex(_list_data.value, (it, index) => {
      let itId = _get_item_id.value(it, index);
      return itId === id;
    });
  }
  //-----------------------------------------------------
  // 操作函数
  //-----------------------------------------------------
  function selectItem(id: string | null) {
    if (_.isNil(id)) {
      _current_id.value = undefined;
      _checked_ids.value = [];
    } else {
      _current_id.value = id;
      _checked_ids.value = [id];
    }
  }
  //-----------------------------------------------------
  function onSelect(payload: TableSelectEmitInfo) {
    _current_id.value = payload.currentId;
    _checked_ids.value = payload.checkedIds;
  }
  //-----------------------------------------------------
  function updateItemByIndex(delta: Vars, index: number) {
    let it = _.nth(_list_data.value, index);
    if (it) {
      _.assign(it, delta);
    }
  }
  //-----------------------------------------------------
  function updateItemById(delta: Vars, id: TableRowID | undefined | null) {
    if (_.isNil(id)) return;
    let index = getItemIndex(id);
    if (index < 0) return;
    return updateItemByIndex(delta, index);
  }
  //-----------------------------------------------------
  function updateCurrentItem(delta: Vars) {
    return updateItemById(delta, CurrentId.value);
  }
  //-----------------------------------------------------
  // 数据改动
  //-----------------------------------------------------
  async function addNewItem() {
    throw "No implements";
  }
  //-----------------------------------------------------
  function removeChecked() {
    _rds.removeChecked();
  }

  //-----------------------------------------------------
  // 返回接口
  //-----------------------------------------------------
  return {
    // 计算属性
    ListData,
    CurrentData,
    CurrentId,
    CheckedIds,
    FilterData,
    SorterData,
    Pager,
    Changed,
    ActionBarVars,
    getKeepInfo,
    // 操作函数
    selectItem,
    onSelect,
    updateItemById,
    updateItemByIndex,
    updateCurrentItem,
    // 数据校验
    CurrentVarifyResult,
    validateCurrent,
    validateCurrentDelta,
    // 数据改动
    addNewItem,
    removeChecked,
    setPager,
    setSorter,
    setFilter,
    makeChanges,
    joinChanges,
    dropChange,
    reset,
    // 远程操作
    saveChange,
    refresh,
    applyPager,
    applySorter,
    applyFilter,
  };
}
