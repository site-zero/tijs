import {
  KeepInfo,
  MoveDirection,
  TableRowID,
  TableSelectEmitInfo,
  Util,
  Vars,
} from "@site0/tijs";
import _ from "lodash";
import { computed, ref } from "vue";
import { EditRecordsEmitter, EditRecordsProps } from "./edit-records-types";

export type EditRecordsApi = ReturnType<typeof useEditRecordsApi>;

export function useEditRecordsApi(props: EditRecordsProps, emit: EditRecordsEmitter) {
  const _get_item_id = computed(() =>
    Util.genItemGetter<TableRowID>(props.table?.getId || "id|value", {})
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
  const CurrentItem = computed(() => getItemById(_current_id.value));
  const CheckedItems = computed(() => getCheckedItems());
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
  function getKeepInfo(prefix: string): KeepInfo | undefined {
    if (props.keepName && prefix) {
      return {
        keepMode: "local",
        keepAt: ["GUI-EditTable", prefix, props.keepName].join("-"),
      };
    }
  }
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
  function getItemById(id: TableRowID | undefined | null) {
    let index = getItemIndex(id);
    if (index < 0) return undefined;
    return _.nth(_list_data.value, index);
  }
  //-----------------------------------------------------
  function getItemsById(ids: TableRowID[]) {
    let idMap = Util.arrayToMap(ids);
    return _.filter(_list_data.value, (it, index) => {
      let itId = _get_item_id.value(it, index);
      return idMap.get(itId);
    });
  }
  //-----------------------------------------------------
  function getCheckedItems() {
    return getItemsById(_checked_ids.value);
  }
  //-----------------------------------------------------
  function getNextId() {
    return Util.getNextId(
      _list_data.value,
      _checked_ids.value,
      _get_item_id.value
    );
  }
  //-----------------------------------------------------
  // 操作函数
  //-----------------------------------------------------
  function selectItem(id: TableRowID | null | undefined) {
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
    debounceTryNotifyChange();
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
    // 首先查找一下可能是否需要高亮下一个的 ID
    let nextId = getNextId();

    // 重新建立一个列表
    let idMap = Util.arrayToMap(_checked_ids.value);
    let list = _.filter(_list_data.value, (it, index) => {
      let itId = _get_item_id.value(it, index);
      return !idMap.get(itId);
    });
    _list_data.value = list;

    // 选择下一个对象
    if (nextId) {
      selectItem(nextId);
    }
    // 没有后续可选的 id
    else {
      _current_id.value = undefined;
      _checked_ids.value = [];
    }

    // 通知改动
    debounceTryNotifyChange();
  }
  //-----------------------------------------------------
  function moveCheckedTo(dir: MoveDirection) {
    let list = Util.moveCheckedById(
      _list_data.value,
      _checked_ids.value,
      dir,
      (it) => {
        return _get_item_id.value(it, -1);
      }
    );
    _list_data.value = list;
    debounceTryNotifyChange();
  }
  //-----------------------------------------------------
  // 数据交互
  //-----------------------------------------------------
  function initData() {
    _list_data.value = _.cloneDeep(props.value || []);
  }
  //-----------------------------------------------------
  function tryNotifyChange() {
    if (!_.isEqual(props.value, _list_data.value)) {
      emit("change", _list_data.value);
    }
  }
  //-----------------------------------------------------
  function debounceTryNotifyChange() {
    let delayInMs = props.emitDelay ?? 500;
    _.debounce(tryNotifyChange, delayInMs, {
      trailing: true,
      leading: true,
    });
  }
  //-----------------------------------------------------
  // 返回接口
  //-----------------------------------------------------
  return {
    // 计算属性
    ListData,
    CurrentId,
    CheckedIds,
    CurrentItem,
    CheckedItems,
    ActionBarVars,
    getKeepInfo,
    getItemIndex,
    getItemById,
    getItemsById,
    getCheckedItems,
    getNextId,
    // 操作函数
    selectItem,
    onSelect,
    updateItemById,
    updateItemByIndex,
    updateCurrentItem,
    moveCheckedTo,
    // 数据改动
    addNewItem,
    removeChecked,
    // 数据交互
    initData,
    tryNotifyChange,
    debounceTryNotifyChange,
  };
}
