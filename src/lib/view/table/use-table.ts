import _ from 'lodash';
import { computed, ComputedRef, Ref } from 'vue';
import { SelectableApi, useDataLogicType, useSelectable } from '../../';
import {
  Callback,
  Callback1,
  LogicType,
  TableRowID,
  Vars,
} from '../../../_type';
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
  selection: TableSelection,
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
  const getRowType = computed(()=>useDataLogicType(props.getRowType));
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
  // 返回特性
  //-----------------------------------------------------
  return {
    selectable,
    TableData,
    getRowDataByIndex,
    getRowDataById,

    getTableHeadClass: (selection: TableSelection, col: TableStrictColumn) => {
      return {
        'is-actived-column': selection.uniqKey == col.uniqKey,
        'has-tip': col.tip ? true : false,
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
      return selectable.getCheckStatus(selection);
    },

    getCurrentRow,
    getCheckedRows,

    checkAll() {
      let oldCurrentId = _.cloneDeep(selection.currentId);
      let oldCheckedIds = _.cloneDeep(selection.checkedIds);
      //console.log('selectAll', selection.ids);
      selectable.checkAll(selection);

      let info = selectable.getSelectionEmitInfo(
        selection,
        props.data,
        oldCheckedIds,
        oldCurrentId
      ) as TableSelectEmitInfo;

      emit('select', info);
    },

    selectNone() {
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

    OnRowSelect(rowEvent: TableEventPayload) {
      selection.uniqKey = null;
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

    OnRowCheck(rowEvent: TableEventPayload) {
      log.debug('OnRowCheck', rowEvent);
      let oldCurrentId = _.cloneDeep(selection.currentId);
      let oldCheckedIds = _.cloneDeep(selection.checkedIds);
      if (props.multi) {
        selectable.toggleId(selection, rowEvent.row.id);
      } else {
        selectable.selectId(selection, rowEvent.row.id);
      }
      selection.uniqKey = null;

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
      rowEvent: TableEventPayload,
      columnMap: Map<string, TableStrictColumn>
    ) {
      let { row, colUniqKey } = rowEvent;
      // console.log(
      //   'OnCellSelect',
      //   rowEvent.rowIndex,
      //   colIndex,
      //   'cols：',
      //   columns.length
      // );

      //console.log('colIndex', colUniqKey);
      selection.uniqKey = colUniqKey;
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

        info.colIndex = -1;

        // add Column info
        if (colUniqKey) {
          let col = columnMap.get(colUniqKey);
          if (col) {
            info.colIndex = col.index;
            info.column = col;
          }
        }
        emit('select', info);
      }
    },

    updateSelection: selectable.updateSelection,

    OnRowOpen(rowEvent: TableEventPayload) {
      log.debug('OnRowOpen', rowEvent);
      emit('open', rowEvent.row);
    },

    OnCellOpen(rowEvent: TableEventPayload) {
      log.debug('OnCellOpen', rowEvent);
      emit('cell-open', rowEvent);
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
