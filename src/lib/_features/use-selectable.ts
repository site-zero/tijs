import _ from 'lodash';
import { KeyboardStatus, TableRowID, Vars } from '../../_type';
import { Util } from '../../core';
// -----------------------------------------------------
//  Types
export type CheckStatus = 'all' | 'none' | 'part';
// -----------------------------------------------------
export type SelectableState<ID> = {
  currentId?: ID | null;
  checkedIds: Map<ID, boolean>;
  ids: ID[];
  lastSelectId?: ID;
  lastSelectIndex: number;
};
export type SelectEmitInfo<ID> = {
  currentId?: ID | null;
  checkedIds: Map<ID, boolean>;
  current?: Vars;
  checked: Vars[];
  index: number;
  oldCurrentId?: ID | null;
  oldCheckedIds: Map<ID, boolean>;
};
// -----------------------------------------------------
export type CheckedIds<ID extends string | number> =
  | Record<ID, boolean>
  | Map<ID, boolean>
  | ID[];
// -----------------------------------------------------
export type SelectableProps<ID extends string | number> = {
  /**
   * 传入的数据对象
   */
  //data?: Vars[];
  /**
   * 从指定的对象获取 ID
   *
   * - `string` : 表示一个数据键，将通过 `_.get` 获取值，这个值必须是 `T`
   *              或者可以被 `anyConvertor` 转换的值
   * - `Function` : 一个获取 ID 的函数
   */
  getId?: string | ((it: Vars, index: number) => ID);

  /**
   * 如果未能取到 ID 则会默认用 index 拼合 ID，
   * 这时就会用到本属性，譬如， index=3, dftIdPrefix='row'
   * 那么 id 就是 `row-3`
   *
   * 默认本属性值为 "row"
   */
  dftIdPrefix?: string;

  /**
   * 是否支持多重选择
   */
  multi?: boolean;

  /**
   * 最少选定多少选项，如果不是 multi ，最大值就是1
   */
  minChecked?: number;

  /**
   * 最多选定多少
   */
  maxChecked?: number;

  currentId?: ID | null;
  checkedIds?: CheckedIds<ID>;

  // 列表是否可以选择
  canSelect?: boolean;

  canCheck?: boolean;
};

// -----------------------------------------------------
export type SelectableFeature<ID extends TableRowID> = ReturnType<
  typeof useSelectable<ID>
>;
// -----------------------------------------------------
//
// Use Feature
//
export function useSelectable<ID extends TableRowID>(
  props: SelectableProps<ID>
) {
  let { getId = (data: any) => data?.id ?? data?.value } = props ?? {};
  //console.log('use selectable', props.currentId, props.checkedIds);
  /**
   * 获取数据的 ID
   */
  function getDataId(it: Vars, index: number): ID {
    let prefix = props.dftIdPrefix ?? 'row';
    if (getId) {
      if (_.isString(getId)) {
        return _.get(it, getId) ?? (`${prefix}-${index}` as ID);
      }
      //console.log('getRowId',  getId(it, index))
      return getId(it, index) ?? (`${prefix}-${index}` as ID);
    }
    return `${prefix}-${index}` as ID;
  }

  function getDataIndex(selection: SelectableState<ID>, id?: ID) {
    if (!_.isNil(id)) {
      for (let i = 0; i < selection.ids.length; i++) {
        if (selection.ids[i] == id) {
          return i;
        }
      }
    }
    return -1;
  }

  /**
   * @returns  当前行是否被选中
   */
  function isIDChecked(selection: SelectableState<ID>, id?: ID) {
    if (_.isNil(id)) {
      return false;
    }
    if (!selection.checkedIds) {
      return false;
    }
    if (selection.checkedIds.get(id)) {
      return true;
    }
    let s_id = `${id}` as ID;
    if (selection.checkedIds.get(s_id)) {
      return true;
    }
    return false;
  }

  /**
   * @returns  当前行是否被选中
   */
  function isDataChecked(
    selection: SelectableState<ID>,
    index: number,
    data?: Vars
  ) {
    if (!data) {
      return false;
    }
    let id = getDataId(data, index);
    return isIDChecked(selection, id);
  }

  /**
   * 判断当前行是否为当前激活行
   *
   * @param currentId 激活行的 ID
   * @param data 行数据
   * @returns  当前行是否激活
   */
  function isDataActived(
    selection: SelectableState<ID>,
    index: number,
    data?: Vars
  ) {
    if (!data) {
      return false;
    }
    let id = getDataId(data, index);
    return id == selection.currentId;
  }

  function getCheckedData(
    list: Vars[],
    selection: SelectableState<ID>
  ): Vars[] {
    let re = [] as Vars[];
    for (let i = 0; i < list.length; i++) {
      let li = list[i];
      if (isDataChecked(selection, i, li)) {
        re.push(li);
      }
    }
    return re;
  }
  function getCurrentData(
    list: Vars[],
    selection: SelectableState<ID>
  ): Vars | undefined {
    for (let i = 0; i < list.length; i++) {
      let li = list[i];
      if (isDataChecked(selection, i, li)) {
        return li;
      }
    }
  }

  function getSelectionEmitInfo(
    selection: SelectableState<ID>,
    list: Vars[],
    oldCheckedIds: Map<ID, boolean>,
    oldCurrentId?: ID | null
  ): SelectEmitInfo<ID> {
    let currentId = selection.currentId ?? null;
    let ckIds = Util.mapTruthyKeys(selection.checkedIds);
    let checkedIds = Util.arrayToMap(ckIds);
    let current = _.isNil(currentId)
      ? undefined
      : getCurrentData(list, selection);
    let checked = getCheckedData(list, selection);
    return {
      currentId,
      checkedIds,
      current,
      checked,
      index: selection.lastSelectIndex,
      oldCurrentId,
      oldCheckedIds,
    };
  }

  function updateSelection(
    selection: SelectableState<ID>,
    data: Vars[],
    currentId?: ID | null,
    checkedIds?: CheckedIds<ID>
  ) {
    selection.ids = getDataIds(data);
    let ids = new Map<ID, boolean>();
    //console.log(selection.ids);

    // allow multi
    if (props.multi) {
      if (!_.isNil(currentId)) {
        ids.set(currentId, true);
      }

      let _is_checked = (_id: ID) => false;
      if (checkedIds) {
        let idMap: Map<ID, boolean>;
        // Use Array
        if (_.isArray(checkedIds)) {
          idMap = Util.arrayToMap(checkedIds);
        }
        // Use Map
        else if (checkedIds instanceof Map) {
          idMap = checkedIds;
        }
        // Use Record
        else {
          idMap = Util.objToMap(checkedIds);
        }
        // 准备判断函数
        _is_checked = (id: ID) => {
          let key = `${id}` as ID;
          return idMap.get(key) ?? false;
        };
      }

      for (let id of selection.ids) {
        if (_is_checked(id)) {
          ids.set(id, true);
        }
      }
    }
    // Single selection
    else {
      //..........................................
      // use currentId
      if (!_.isNil(currentId)) {
        ids.set(currentId, true);
      }
      //..........................................
      // use checkedIds
      else {
        // Use Array
        if (_.isArray(checkedIds)) {
          if (checkedIds.length > 0) {
            ids.set(checkedIds[0], true);
          }
        }
        // Use Map
        else if (checkedIds instanceof Map) {
          if (checkedIds.size > 0) {
            for (let k of checkedIds.keys()) {
              currentId = k;
              ids.set(k, true);
              break;
            }
          } else {
            currentId = undefined;
          }
          checkedIds.keys();
        }
        // Use Record
        else {
          if (!_.isEmpty(checkedIds)) {
            for (let k in checkedIds) {
              currentId = k;
              ids.set(k, true);
              break;
            }
          } else {
            currentId = undefined;
          }
        }
      }
      //..........................................
    }

    selection.checkedIds = ids;
    selection.currentId = currentId;
    if (!_.isNil(currentId)) {
      selection.lastSelectId = currentId;
      selection.lastSelectIndex = getDataIndex(selection, currentId);
    }
  }

  /*-----------------------------------------------------

                       State
                
  -----------------------------------------------------*/
  function getDataIds(data: Vars[]): ID[] {
    let ids = [] as ID[];
    if (data) {
      for (let i = 0; i < data.length; i++) {
        let it = data[i];
        let id = getDataId(it, i);
        if (!_.isUndefined(id)) {
          ids.push(id);
        }
      }
    }
    return ids;
  }

  function resetSelection(selection: SelectableState<ID>, data?: Vars[]) {
    selection.currentId = undefined;
    selection.checkedIds.clear();
    selection.ids = getDataIds(data ?? []);
    selection.lastSelectId = undefined;
  }

  // function createSelection(): SelectableState<ID> {
  //   let state = {
  //     ids: getRowIds(),
  //   } as SelectableState<ID>;
  //   updateSelection(state, props.currentId, props.checkedIds);
  //   return state;
  // }

  /*-----------------------------------------------------

                     Evalue Status
                
  -----------------------------------------------------*/
  function getCheckStatus(selection: SelectableState<ID>): CheckStatus {
    // 有选中的 ID，那就深入看看
    if (selection.checkedIds.size > 0) {
      // 看看是否是全部
      let checkedIds = selection.checkedIds;
      for (let id of selection.ids) {
        if (!checkedIds.get(id)) {
          return 'part';
        }
      }
      // 通过了，那就是全选
      return 'all';
    }
    return 'none';
  }

  /*-----------------------------------------------------

                   Action Handler
                
  -----------------------------------------------------*/
  /**
   * 处理一下 minChecked/maxChecked
   * @param selection 选区
   */
  function clampSelect(selection: SelectableState<ID>) {
    let lastId = selection.lastSelectId;
    // 防守
    if (_.isNil(lastId)) {
      return;
    }
    // 对于多选
    if (props.multi) {
      let ckIds = Util.mapTruthyKeys(selection.checkedIds);
      // 选少了
      if (_.isNumber(props.minChecked) && ckIds.length < props.minChecked) {
        let n = props.minChecked - ckIds.length;
        // 最后一个选中的，恢复上
        if (!selection.checkedIds.get(lastId)) {
          selection.checkedIds.set(lastId, true);
          n--;
        }
        // 从头开始高满
        for (let id of selection.ids) {
          if (n <= 0) {
            break;
          }
          if (!selection.checkedIds.get(id)) {
            selection.checkedIds.set(id, true);
            n--;
          }
        }
      }
      // 选多了
      if (_.isNumber(props.maxChecked) && ckIds.length > props.maxChecked) {
        let n = ckIds.length - props.maxChecked;
        let removeIds = [] as ID[];
        for (let [id, _v] of selection.checkedIds) {
          if (n <= 0) {
            break;
          }
          if (id != lastId) {
            removeIds.push(id);
            n--;
          }
        }
        for (let id of removeIds) {
          selection.checkedIds.delete(id);
        }
      }
    }
    // 对于单选，仅仅考虑 minChecked
    else if (_.isNumber(props.minChecked)) {
      // 至少要保证一个选中
      if (props.minChecked > 0) {
        let ckIds = Util.mapTruthyKeys(selection.checkedIds);
        if (ckIds.length == 0) {
          selection.checkedIds.set(lastId, true);
          selection.currentId = lastId;
        }
      }
    }
    // 更新一下下标
    selection.lastSelectIndex = getDataIndex(selection, lastId);
  }

  function checkAll(selection: SelectableState<ID>) {
    for (let id of selection.ids) {
      selection.checkedIds.set(id, true);
    }
    clampSelect(selection);
  }

  function selectNone(selection: SelectableState<ID>) {
    selection.checkedIds.clear();
    selection.currentId = undefined;
    clampSelect(selection);
  }

  function select(
    selection: SelectableState<ID>,
    rowId: ID,
    se: KeyboardStatus
  ) {
    let need_clamp = false;
    if (!props.canCheck && !props.canSelect) {
      return;
    }
    // shiftKey
    if (se.shiftKey) {
      let ids = selection.ids;
      selectRange(selection, ids, [
        rowId,
        selection.currentId ?? selection.lastSelectId,
      ]);
      need_clamp = true;
    }
    // 只能选择的话，优先用 toggle
    else if (!props.canSelect && props.canCheck) {
      // 除非按下了 ctrl，就变成单选模式·
      if (se.ctrlKey) {
        selectId(selection, rowId);
      } else {
        toggleId(selection, rowId);
      }
    }
    // Toggle Mode
    else if (se.ctrlKey || se.metaKey) {
      toggleId(selection, rowId);
    }
    // Default Simple Mode
    else {
      selectId(selection, rowId);
    }
    selection.lastSelectId = rowId;
    if (need_clamp) {
      clampSelect(selection);
    }
  }

  function selectId(selection: SelectableState<ID>, id: ID) {
    selection.checkedIds.clear();
    if (props.canSelect) {
      selection.currentId = id;
    } else {
      selection.currentId = undefined;
    }

    selection.checkedIds.set(id, true);
    selection.lastSelectId = id;
    clampSelect(selection);
  }

  function toggleId(selection: SelectableState<ID>, id: ID) {
    let checked: boolean = selection.checkedIds.get(id) ?? false;
    checked = checked ? false : true;
    selection.checkedIds.set(id, checked);
    if (!checked && selection.currentId === id) {
      selection.currentId = undefined;
    }
    selection.lastSelectId = id;
    clampSelect(selection);
  }

  function selectRange(
    selection: SelectableState<ID>,
    ids: ID[],
    range: [ID, ID | undefined | null]
  ) {
    // 没有内容
    if (_.isEmpty(ids)) {
      return;
    }

    // 仅仅是单选
    if (!props.multi) {
      let id = range[1] ?? range[0];
      selectId(selection, id);
      return;
    }

    // 首先让我们确定选择的下标
    let [fromId, toId] = range;
    // 嗯，只给了一个 ID，就从 currentId 出发
    if (_.isUndefined(toId)) {
      toId = fromId;
      // 从 currentId 出发
      if (selection.currentId) {
        fromId = selection.currentId;
      }
      // 从第一个 ID 出发
      else if (ids.length > 0) {
        fromId = ids[0];
      }
      // 没有合适的 range
      else {
        return;
      }
    }

    // 再防守一遍
    if (fromId === toId) {
      return;
    }

    // 获取两个ID 的下标
    let fromIndex = _.findIndex(ids, (id) => id === fromId);
    let toIndex = _.findIndex(ids, (id) => id === toId);
    if (fromIndex === toIndex) {
      return;
    }
    if (fromIndex < 0) {
      fromIndex = ids.length - 1;
    }
    if (toIndex < 0) {
      toIndex = ids.length - 1;
    }
    let idx: [number, number];
    if (fromIndex < toIndex) {
      idx = [fromIndex, toIndex];
    } else {
      idx = [toIndex, fromIndex];
    }
    fromIndex = idx[0];
    toIndex = idx[1];

    // 这种特殊模式，需要与起始条目设置相同
    let yes = true;
    if (!props.canSelect && props.canCheck && toId) {
      console.log('toId=', toId);
      yes = selection.checkedIds.get(toId) ? true : false;
    }

    // 准备要选择的 ids
    let idMap = new Map<ID, boolean>();
    for (let i = fromIndex; i <= toIndex; i++) {
      let id = ids[i];
      idMap.set(id, yes);
    }

    // 更新
    if (idMap.size > 0) {
      Util.assignMap(selection.checkedIds, idMap);
    }
  }

  return {
    getDataIds,
    ////createSelection,

    getDataId,
    getDataIndex,
    isIDChecked,
    isDataChecked,
    isDataActived,

    getCheckedData,
    getCurrentData,
    getSelectionEmitInfo,

    getCheckStatus,

    updateSelection,
    resetSelection,

    checkAll,
    selectNone,
    select,
    selectId,
    toggleId,
    selectRange,
  };
}
