import _ from 'lodash';
import { Ref } from 'vue';
import {
  TableCell,
  TableProps,
  TableRowData,
  TableRowID,
  getFieldUniqKey,
} from '../../';
import {
  Callback,
  Callback1,
  EventUtils,
  I18n,
  Str,
  Vars,
} from '../../../core';
import { TableRowEvent } from './table-types';
import {
  CheckStatus,
  SelectableFeature,
  SelectableState,
  useSelectable,
} from './use-selectable';
import { TableKeepFeature } from './use-table-keep';
import { useTableResizing } from './use-table-resizing';
/*-------------------------------------------------------

                        Types

-------------------------------------------------------*/

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

                     Methods

-------------------------------------------------------*/
function _get_table_columns(props: TableProps) {
  let list = [] as TableCell[];
  for (let col of props.columns) {
    // 列唯一键
    let uniqKey = col.uniqKey || getFieldUniqKey(col.name);
    let colItem = { uniqKey, ...col } as TableCell;

    // 列标题
    if (!col.title) {
      colItem.title = _.upperFirst(uniqKey);
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
  rowEvent: TableRowEvent
) {
  let { event, row } = rowEvent;
  let se = EventUtils.getKeyboardStatus(event);

  // Toggle Mode
  if (se.ctrlKey || se.metaKey) {
    selectable.toggleId(selection, row.id);
  }
  // shiftKey
  else if (se.shiftKey) {
    console.log('shift mode');
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
export function useTable(props: TableProps) {
  // 启用特性
  let selectable = useSelectable<TableRowID>({
    getId: props.getId!,
    convertToId: Str.anyToStrOrNum,
    data: props.data,
    multi: props.multi,
  });

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
      Keep: TableKeepFeature
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

    getCheckStatus: (selection: SelectableState<TableRowID>) => {
      return selectable.getCheckStatus(selection);
    },

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

    OnRowSelect(
      selection: SelectableState<TableRowID>,
      rowEvent: TableRowEvent
    ) {
      _on_row_select(selectable, selection, rowEvent);
    },

    OnRowCheck(
      selection: SelectableState<TableRowID>,
      rowEvent: TableRowEvent
    ) {
      selectable.toggleId(selection, rowEvent.row.id);
    },

    OnRowOpen(
      _selection: SelectableState<TableRowID>,
      rowEvent: TableRowEvent
    ) {
      console.log('row Open', rowEvent);
    },

    OnCellSelect(
      selection: SelectableState<TableRowID>,
      rowEvent: TableRowEvent
    ) {
      let { row } = rowEvent;
      if (!selection.checkedIds.get(row.id)) {
        selectable.selectId(selection, row.id);
      }
      console.log('cell select', rowEvent);
    },

    OnCellOpen(
      _selection: SelectableState<TableRowID>,
      rowEvent: TableRowEvent
    ) {
      console.log('cell open', rowEvent);
    },
  };
}
