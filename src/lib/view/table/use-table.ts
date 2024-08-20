import _ from 'lodash';
import { ComputedRef, Ref } from 'vue';
import {
  CheckStatus,
  CheckedIds,
  SelectableFeature,
  SelectableState,
  useSelectable,
} from '../../';
import { Callback, Callback1, TableRowID, Vars } from '../../../_type';
import { EventUtils } from '../../../core';
import { getLogger } from '../../../core/log/ti-log';
import {
  TableEmitter,
  TableEventPayload,
  TableProps,
  TableRowData,
  TableSelectEmitInfo,
  TableSelection,
  TableStrictColumn,
} from './ti-table-types';

import { TableKeepFeature } from './use-table-keep';
import { useTableResizing } from './use-table-resizing';

const log = getLogger('TiTable.use-table');

export type TableFeature = {
  selectable: SelectableFeature<TableRowID>;
  getRowIds: (data: Vars[]) => TableRowID[];
  getTableHeadClass: (selection: TableSelection, colIndex: number) => Vars;
  getTableData: () => TableRowData[];
  bindTableResizing: (
    $main: HTMLElement,
    colResizing: ColResizingState,
    columnSizes: Ref<number[]>,
    showRowMarker: boolean,
    onDestroy: Callback1<Callback>,
    Keep: ComputedRef<TableKeepFeature>
  ) => void;
  getCheckStatus(selection: TableSelection): CheckStatus;
  getCurrentRow: (
    selection: TableSelection,
    rows: TableRowData[]
  ) => TableRowData | undefined;
  getCheckedRows: (
    selection: TableSelection,
    rows: TableRowData[]
  ) => TableRowData[];
  // OnTableHeadCheckerClick: (
  //   selection: TableSelection,
  //   status: CheckStatus
  // ) => void;
  checkAll: (selection: TableSelection) => void;
  selectNone: (selection: TableSelection) => void;
  OnRowSelect: (selection: TableSelection, rowEvent: TableEventPayload) => void;
  OnRowCheck: (selection: TableSelection, rowEvent: TableEventPayload) => void;
  OnCellSelect: (
    selection: TableSelection,
    rowEvent: TableEventPayload,
    columns: TableStrictColumn[]
  ) => void;
  updateSelection: (
    selection: SelectableState<TableRowID>,
    data: Vars[],
    currentId?: TableRowID | null,
    checkedIds?: CheckedIds<TableRowID>
  ) => void;
  OnRowOpen: (_selection: TableSelection, rowEvent: TableEventPayload) => void;
  OnCellOpen: (_selection: TableSelection, rowEvent: TableEventPayload) => void;
};

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
  selectable: SelectableFeature<TableRowID>,
  data: Vars[]
): TableRowData[] {
  // 启用特性
  let { getRowId: getDataId } = selectable;

  // 处理数据
  let list = [] as TableRowData[];
  let N = data.length;
  for (let index = 0; index < N; index++) {
    let rawData = data[index];
    let id = getDataId(rawData, index);
    list.push({
      id: id ?? `row-${index}`,
      index,
      indent: 0,
      rawData,
    });
  }
  return list;
}

/*-----------------------------------------------------

                   Use Feature
                
-----------------------------------------------------*/
export function useTable(props: TableProps, emit: TableEmitter): TableFeature {
  // 启用特性
  let selectable = useSelectable<TableRowID>(props);

  function getCurrentRow(selection: TableSelection, rows: TableRowData[]) {
    if (!_.isNil(selection.currentId)) {
      for (let row of rows) {
        if (row.id == selection.currentId) {
          return row;
        }
      }
    }
  }

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

  return {
    selectable,
    getTableHeadClass: (selection: TableSelection, colIndex: number) => {
      return {
        'is-actived-column': selection.columnIndex == colIndex,
      };
    },
    getTableData: () => {
      return _get_table_data(selectable, props.data);
    },
    bindTableResizing: (
      $main: HTMLElement,
      colResizing: ColResizingState,
      columnSizes: Ref<number[]>,
      showRowMarker: boolean,
      onDestroy: Callback1<Callback>,
      Keep: ComputedRef<TableKeepFeature>
    ) => {
      if (props.columnResizable) {
        useTableResizing(
          $main,
          colResizing,
          columnSizes,
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

    getRowIds: selectable.getRowIds,

    getCheckStatus(selection: TableSelection) {
      return selectable.getCheckStatus(selection);
    },

    getCurrentRow,
    getCheckedRows,

    checkAll(selection: TableSelection) {
      let oldCurrentId = _.cloneDeep(selection.currentId);
      let oldCheckedIds = _.cloneDeep(selection.checkedIds);
      console.log('selectAll', selection.ids);
      selectable.checkAll(selection);

      let info = selectable.getSelectionEmitInfo(
        selection,
        props.data,
        oldCheckedIds,
        oldCurrentId
      ) as TableSelectEmitInfo;

      emit('select', info);
    },

    selectNone(selection: TableSelection) {
      let oldCurrentId = _.cloneDeep(selection.currentId);
      let oldCheckedIds = _.cloneDeep(selection.checkedIds);
      selectable.selectNone(selection);
      let info = selectable.getSelectionEmitInfo(
        selection,
        props.data,
        oldCheckedIds,
        oldCurrentId
      ) as TableSelectEmitInfo;

      emit('select', info);
    },

    OnRowSelect(selection: TableSelection, rowEvent: TableEventPayload) {
      console.log('OnRowSelect', rowEvent);
      selection.columnIndex = -1;
      // Guard actived
      if (selection.currentId == rowEvent.row.id) {
        return;
      }
      log.debug('OnRowSelect', rowEvent);
      let oldCurrentId = _.cloneDeep(selection.currentId);
      let oldCheckedIds = _.cloneDeep(selection.checkedIds);

      if (props.multi) {
        let { event, row } = rowEvent;
        let se = EventUtils.getKeyboardStatus(event);
        selectable.select(selection, row.id, se);
      } else {
        selectable.selectId(selection, rowEvent.row.id);
      }

      //
      // Prepare the emit info
      //
      let info = selectable.getSelectionEmitInfo(
        selection,
        props.data,
        oldCheckedIds,
        oldCurrentId
      ) as TableSelectEmitInfo;

      emit('select', info);
    },

    OnRowCheck(selection: TableSelection, rowEvent: TableEventPayload) {
      log.debug('OnRowCheck', rowEvent);
      let oldCurrentId = _.cloneDeep(selection.currentId);
      let oldCheckedIds = _.cloneDeep(selection.checkedIds);
      if (props.multi) {
        selectable.toggleId(selection, rowEvent.row.id);
      } else {
        selectable.selectId(selection, rowEvent.row.id);
      }
      selection.columnIndex = -1;

      //
      // Prepare the emit info
      //
      let info = selectable.getSelectionEmitInfo(
        selection,
        props.data,
        oldCheckedIds,
        oldCurrentId
      ) as TableSelectEmitInfo;

      emit('select', info);
    },

    OnCellSelect(
      selection: TableSelection,
      rowEvent: TableEventPayload,
      columns: TableStrictColumn[]
    ) {
      let { row, colIndex } = rowEvent;
      console.log(
        'OnCellSelect',
        rowEvent.rowIndex,
        colIndex,
        'cols：',
        columns.length
      );
      selection.columnIndex = colIndex ?? -1;
      //if (!selection.checkedIds.get(row.id)) {
      if (selection.currentId != row.id) {
        let oldCurrentId = _.cloneDeep(selection.currentId);
        let oldCheckedIds = _.cloneDeep(selection.checkedIds);
        log.debug('OnCellSelect', rowEvent);
        selectable.selectId(selection, row.id);

        //
        // Prepare the emit info
        //
        let info = selectable.getSelectionEmitInfo(
          selection,
          props.data,
          oldCheckedIds,
          oldCurrentId
        ) as TableSelectEmitInfo;

        // add Column info
        if (colIndex && colIndex >= 0) {
          info.colIndex = colIndex;
          info.column = columns[colIndex];
        }

        emit('select', info);
      }
    },

    updateSelection: selectable.updateSelection,

    OnRowOpen(_selection: TableSelection, rowEvent: TableEventPayload) {
      log.debug('OnRowOpen', rowEvent);
      emit('open', rowEvent.row);
    },

    OnCellOpen(_selection: TableSelection, rowEvent: TableEventPayload) {
      log.debug('OnCellOpen', rowEvent);
      emit('cell-open', rowEvent);
    },
  };
}

export function getRowActivedColIndex(
  selection: TableSelection,
  row: TableRowData
): number {
  if (row.id == selection.currentId) {
    return selection.columnIndex;
  }
  return -1;
}
