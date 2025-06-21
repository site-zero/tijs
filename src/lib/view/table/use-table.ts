import _ from "lodash";
import { computed, ComputedRef, Ref } from "vue";
import { SelectableApi, useDataLogicType, useSelectable } from "../../";
import {
  Callback,
  Callback1,
  LogicType,
  TableRowID,
  Vars,
} from "../../../_type";
import { EventUtils } from "../../../core";
import {
  TableEmitter,
  TableEventPayload,
  TableProps,
  TableRowData,
  TableSelectEmitInfo,
  TableSelection,
  TableStrictColumn,
} from "./ti-table-types";

import { TableKeepFeature } from "./use-table-keep";
import { useTableResizing } from "./use-table-resizing";

const debug = false;

export type TableFeature = ReturnType<typeof useTable>;

/**
 * 拖动时的状态
 */
export type ColResizingState = {
  /**
   * 当前是否处于列调整模式
   */
  activated: boolean;
  /**
   * 拖动的列在视口的位置
   */
  left: number;

  /**
   * 拖动的列下标（0Base）
   */
  colIndex: number;

  /**
   * 拖动的列:UniqKey
   */
  colUniqKey: string;
};

/*-------------------------------------------------------

                     Help methods

-------------------------------------------------------*/
/**
 * 获取表格数据
 * @param selectable 选择特性
 * @param data 表格数据
 * @param checkedIds 选中的 ID 表
 * @param currentId 当前的 ID 表
 * @returns 整理后的表格数据
 */
function _get_table_data(
  selectable: SelectableApi<TableRowID>,
  data: Vars[],
  _id_index: Map<TableRowID, number>,
  getRowType?: (data: Vars) => LogicType | undefined
): TableRowData[] {
  // 启用特性
  let { getDataId } = selectable;

  _id_index.clear();

  // 处理数据
  let list: TableRowData[] = [];
  let N = data.length;
  for (let index = 0; index < N; index++) {
    let rawData = data[index];
    let id = getDataId(rawData, index);
    _id_index.set(id, index);
    let row: TableRowData = {
      id: id ?? `row-${index}`,
      index,
      indent: 0,
      rawData,
    };
    if (getRowType) {
      row.type = getRowType(rawData);
    }
    list.push(row);
  }
  return list;
}

/*-----------------------------------------------------

                   Use Feature
                
-----------------------------------------------------*/
export function useTable(
  props: TableProps,
  selection: Ref<TableSelection>,
  _table_column_map: ComputedRef<Map<string, TableStrictColumn>>,
  emit: TableEmitter
) {
  // 启用特性
  let selectable = useSelectable<TableRowID>(props, {
    getItem: (id: TableRowID) => {
      let row = getRowDataById(id);
      if (!row) {
        return;
      }
      return {
        id: row.id,
        rawData: row.rawData,
        index: row.index,
      };
    },
  });
  //-----------------------------------------------------
  const getRowType = computed(() => useDataLogicType(props.getRowType));
  //-----------------------------------------------------
  const _id_index = new Map<TableRowID, number>();
  //-----------------------------------------------------
  const TableData = computed(() =>
    _get_table_data(selectable, props.data, _id_index, getRowType.value)
  );
  //-----------------------------------------------------
  function getRowDataByIndex(index: number): TableRowData | undefined {
    return _.nth(TableData.value, index);
  }
  //-----------------------------------------------------
  function getRowDataById(id: TableRowID): TableRowData | undefined {
    let index = _id_index.get(id);
    if (_.isNil(index)) {
      return;
    }
    return _.nth(TableData.value, index);
  }
  //-----------------------------------------------------
  function getCurrentRow(selection: TableSelection, rows: TableRowData[]) {
    if (!_.isNil(selection.currentId)) {
      for (let row of rows) {
        if (row.id == selection.currentId) {
          return row;
        }
      }
    }
  }
  //-----------------------------------------------------
  function getCheckedRows(
    selection: TableSelection,
    rows: TableRowData[]
  ): TableRowData[] {
    let checked = [] as TableRowData[];
    if (selection.checkedIds.size > 0) {
      for (let row of rows) {
        if (selectable.isIDChecked(selection, row.id)) {
          checked.push(row);
        }
      }
    }
    return checked;
  }
  //-----------------------------------------------------
  // 操作函数
  //-----------------------------------------------------
  function trySelect(newSelection: TableSelection) {
    // 当前选区
    let oldSelection = _.cloneDeep(selection.value);
    // 新选区

    // 准备构建事件数据
    let info = selectable.getSelectionEmitInfo(
      newSelection,
      props.data,
      oldSelection.checkedIds,
      oldSelection.currentId
    ) as TableSelectEmitInfo;

    // 没有列信息
    info.colIndex = -1;
    // 获取列信息
    if (newSelection.uniqKey) {
      let col = _table_column_map.value.get(newSelection.uniqKey);
      if (col) {
        info.colIndex = col?.index;
        info.column = col;
      }
    }

    // 改动了 rowId
    if (!_.isEqual(oldSelection, newSelection)) {
      // 检查改动
      if (props.canChangeSelection) {
        let old = selectable.getSelectionEmitInfo(
          oldSelection,
          props.data
        ) as TableSelectEmitInfo;
        if (!props.canChangeSelection(info, old)) {
          return;
        }
      }

      // 修改本地状态
      selection.value = newSelection;

      // 通知改动
      emit("select", info);
    }
  }
  //-----------------------------------------------------
  // 返回特性
  //-----------------------------------------------------
  return {
    selectable,
    TableData,
    getRowDataByIndex,
    getRowDataById,

    getTableHeadClass: (selection: TableSelection, col: TableStrictColumn) => {
      return {
        "is-actived-column": selection.uniqKey == col.uniqKey,
        "has-tip": col.tip ? true : false,
      };
    },
    bindTableResizing: (
      $main: HTMLElement,
      colResizing: ColResizingState,
      _column_sizes: Ref<Record<string, number>>,
      _display_column_keys: Ref<string[]>,
      showRowMarker: boolean,
      onDestroy: Callback1<Callback>,
      Keep: ComputedRef<TableKeepFeature>
    ) => {
      if (props.columnResizable) {
        useTableResizing(
          $main,
          colResizing,
          _column_sizes,
          _display_column_keys,
          showRowMarker,
          onDestroy,
          () => {
            if (_.isBoolean(props.columnResizeInTime)) {
              return props.columnResizeInTime;
            }
            let n = props.columnResizeInTime ?? 50;
            return props.data.length <= n;
          },
          Keep
        );
      }
    },

    getRowIds: selectable.getDataIds,

    getCheckStatus() {
      return selectable.getCheckStatus(selection.value);
    },

    getCurrentRow,
    getCheckedRows,

    checkAll() {
      //console.log('selectAll', selection.ids);
      let newSelection = _.cloneDeep(selection.value);
      selectable.checkAll(newSelection);

      trySelect(newSelection);
    },

    selectNone() {
      let newSelection = _.cloneDeep(selection.value);
      selectable.selectNone(newSelection);

      trySelect(newSelection);
    },

    OnRowSelect(rowEvent: TableEventPayload) {
      if (selection.value.currentId == rowEvent.row.id) {
        return;
      }
      if (debug) console.log("OnRowSelect", rowEvent);
      let newSelection = _.cloneDeep(selection.value);
      newSelection.uniqKey = null; // 清除列选择状态

      if (props.multi) {
        let { event, row } = rowEvent;
        let se = EventUtils.getKeyboardStatus(event);
        selectable.select(newSelection, row.id, se);
      } else {
        selectable.selectId(newSelection, rowEvent.row.id);
      }
      trySelect(newSelection);
    },

    OnRowCheck(rowEvent: TableEventPayload) {
      if (debug) console.log("OnRowCheck", rowEvent);
      let newSelection = _.cloneDeep(selection.value);
      if (props.multi) {
        selectable.toggleId(newSelection, rowEvent.row.id);
      } else {
        selectable.selectId(newSelection, rowEvent.row.id);
      }
      newSelection.uniqKey = null;

      trySelect(newSelection);
    },

    OnCellSelect(rowEvent: TableEventPayload) {
      let { row, colUniqKey } = rowEvent;
      // console.log(
      //   'OnCellSelect',
      //   rowEvent.rowIndex,
      //   colIndex,
      //   'cols：',
      //   columns.length
      // );
      let newSelection = _.cloneDeep(selection.value);
      //console.log('colIndex', colUniqKey);

      if (debug) console.log("OnCellSelect", rowEvent);
      selectable.selectId(newSelection, row.id);
      newSelection.uniqKey = colUniqKey;

      trySelect(newSelection);
    },

    updateSelection: selectable.updateSelection,

    OnRowOpen(rowEvent: TableEventPayload) {
      if (debug) console.log("OnRowOpen", rowEvent);
      emit("open", rowEvent.row);
    },

    OnCellOpen(rowEvent: TableEventPayload) {
      if (debug) console.log("OnCellOpen", rowEvent);
      emit("cell-open", rowEvent);
    },
  };
}

export function getRowActivedColUniqKey(
  selection: TableSelection,
  row: TableRowData
): string | undefined {
  if (row.id == selection.currentId) {
    return selection.uniqKey ?? undefined;
  }
}
