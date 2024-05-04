import _ from 'lodash';
import { ComputedRef, Ref } from 'vue';
import {
  CheckStatus,
  SelectableFeature,
  SelectableState,
  SelectionEmitInfo,
  TableCell,
  TableColumn,
  TableEvent,
  TableProps,
  TableRowData,
  TableRowID,
  getFieldUniqKey,
  useSelectable,
} from '../../';
import {
  Callback,
  Callback1,
  EventUtils,
  I18n,
  Str,
  Vars,
  getLogger,
} from '../../../core';

import { TableKeepFeature } from './use-table-keep';
import { useTableResizing } from './use-table-resizing';

export const COM_TYPE = 'TiTable';
const log = getLogger('TiTable.use-table');
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

export type TableEmit = {
  (eventName: 'select', payload: SelectionEmitInfo<TableRowID>): void;
  (eventName: 'open', payload: TableRowData): void;
  (eventName: 'open:cell', payload: TableEvent): void;
};

/*-------------------------------------------------------

                     Help methods

-------------------------------------------------------*/
function _get_table_columns(props: TableProps) {
  let list = [] as TableColumn[];
  for (let col of props.columns) {
    if (col.candidate) {
      continue;
    }
    // 列唯一键
    let uniqKey = col.uniqKey || getFieldUniqKey(col.name);
    let colItem = { uniqKey, ...col } as TableCell;

    // 列标题
    if (!col.title) {
      colItem.title = _.upperCase(uniqKey);
    } else {
      colItem.title = I18n.text(col.title);
    }

    // 表格默认控件
    colItem.comType = col.comType ?? props.defaultCellComType ?? 'TiLabel';
    colItem.comConf = col.comConf ??
      props.defaultCellComConf ?? {
        className: 'is-nowrap',
      };

    // 记入列表
    list.push(colItem);
  }
  return list;
}

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
  state: SelectableState<TableRowID>,
  data: Vars[]
): TableRowData[] {
  // 启用特性
  let { getDataId, isIDChecked } = selectable;

  // 处理数据
  let list = [] as TableRowData[];
  let N = data.length;
  for (let index = 0; index < N; index++) {
    let rawData = data[index];
    let id = getDataId(rawData);
    list.push({
      id: id ?? `row-${index}`,
      index,
      indent: 0,
      activated: id == state.currentId,
      checked: isIDChecked(state, id),
      rawData,
    });
  }
  return list;
}

/**
 * 表格的行头被点击，通常是需要选择行
 */
function _on_row_select(
  selectable: SelectableFeature<TableRowID>,
  selection: SelectableState<TableRowID>,
  rowEvent: TableEvent
) {
  let { event, row } = rowEvent;
  let se = EventUtils.getKeyboardStatus(event);

  // Toggle Mode
  if (se.ctrlKey || se.metaKey) {
    selectable.toggleId(selection, row.id);
  }
  // shiftKey
  else if (se.shiftKey) {
    log.debug('shift mode');
    let ids = selection.ids;
    selectable.selectRange(selection, ids, [row.id, selection.currentId]);
  }
  // Default Simple Mode
  else {
    selectable.selectId(selection, row.id);
  }
}
/*-----------------------------------------------------

                   Use Feature
                
-----------------------------------------------------*/
export function useTable(props: TableProps, emit: TableEmit) {
  // 启用特性
  let selectable = useSelectable<TableRowID>({
    getId: props.getId!,
    convertToId: Str.anyToStrOrNum,
    data: props.data,
    multi: props.multi,
  });

  function getCurrentRow(
    selection: SelectableState<TableRowID>,
    rows: TableRowData[]
  ) {
    if (!_.isNil(selection.currentId)) {
      for (let row of rows) {
        if (row.id == selection.currentId) {
          return row;
        }
      }
    }
  }

  function getCheckedRows(
    selection: SelectableState<TableRowID>,
    rows: TableRowData[]
  ): TableRowData[] {
    let checked = [] as TableRowData[];
    if (selection.checkedIds.size > 0) {
      for (let row of rows) {
        if (row.checked) {
          checked.push(row);
        }
      }
    }
    return checked;
  }

  return {
    getTableColumns: () => {
      return _get_table_columns(props);
    },
    getTableData: (state: SelectableState<TableRowID>) => {
      return _get_table_data(selectable, state, props.data);
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

    createSelection: () => selectable.createSelection(),

    getRowIds: selectable.getRowIds,

    getCheckStatus(selection: SelectableState<TableRowID>) {
      return selectable.getCheckStatus(selection);
    },

    getCurrentRow,
    getCheckedRows,

    OnTableHeadCheckerClick(
      selection: SelectableState<TableRowID>,
      status: CheckStatus
    ) {
      let { ids, checkedIds } = selection;
      checkedIds.clear();
      if ('all' != status) {
        for (let id of ids) {
          checkedIds.set(id, true);
        }
      }
    },

    OnRowSelect(selection: SelectableState<TableRowID>, rowEvent: TableEvent) {
      // Guard actived
      if (rowEvent.row.activated) {
        return;
      }
      log.debug('OnRowSelect', rowEvent);
      let oldCurrentId = _.cloneDeep(selection.currentId);
      let oldCheckedIds = _.cloneDeep(selection.checkedIds);
      _on_row_select(selectable, selection, rowEvent);
      let emitInfo = selectable.getSelectionEmitInfo(
        selection,
        props.data,
        oldCheckedIds,
        oldCurrentId
      );
      emit('select', emitInfo);
    },

    OnRowCheck(selection: SelectableState<TableRowID>, rowEvent: TableEvent) {
      log.debug('OnRowCheck', rowEvent);
      let oldCurrentId = _.cloneDeep(selection.currentId);
      let oldCheckedIds = _.cloneDeep(selection.checkedIds);
      selectable.toggleId(selection, rowEvent.row.id);
      let emitInfo = selectable.getSelectionEmitInfo(
        selection,
        props.data,
        oldCheckedIds,
        oldCurrentId
      );
      emit('select', emitInfo);
    },

    OnCellSelect(selection: SelectableState<TableRowID>, rowEvent: TableEvent) {
      let { row } = rowEvent;
      if (!selection.checkedIds.get(row.id)) {
        let oldCurrentId = _.cloneDeep(selection.currentId);
        let oldCheckedIds = _.cloneDeep(selection.checkedIds);
        log.debug('OnCellSelect', rowEvent);
        selectable.selectId(selection, row.id);
        let emitInfo: SelectionEmitInfo<TableRowID> =
          selectable.getSelectionEmitInfo(
            selection,
            props.data,
            oldCheckedIds,
            oldCurrentId
          );
        emit('select', emitInfo);
      }
    },

    OnRowOpen(_selection: SelectableState<TableRowID>, rowEvent: TableEvent) {
      log.debug('OnRowOpen', rowEvent);
      emit('open', rowEvent.row);
    },

    OnCellOpen(_selection: SelectableState<TableRowID>, rowEvent: TableEvent) {
      log.debug('OnCellOpen', rowEvent);
      emit('open:cell', rowEvent);
    },
  };
}
