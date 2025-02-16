import { ComputedRef, Ref } from 'vue';
import { ActionBarProps, TableSelection, TableStrictColumn } from '../../';
import { ActionBarItem, Vars } from '../../../_type';
import { doCustomizeColumn } from './use-customized-columns';
import { TableFeature } from './use-table';
import { TableKeepFeature } from './use-table-keep';

export function useTableHeadMenu(
  selection: TableSelection,
  Table: TableFeature,
  AllTableColumns: ComputedRef<TableStrictColumn[]>,
  _column_sizes: Ref<Record<string, number>>,
  _display_column_keys: Ref<string[]>,
  Keep: TableKeepFeature
): ActionBarProps {
  let items = [
    {
      icon: 'zmdi-check-all',
      text: 'Select All',
      action: () => {
        Table.checkAll(selection);
      },
    },
    {
      icon: 'zmdi-minus',
      text: 'Select None',
      action: () => {
        Table.selectNone(selection);
      },
    },
    {},
    {
      icon: 'zmdi-settings',
      text: 'Customiezed Fields',
      action: async () => {
        await doCustomizeColumn(
          AllTableColumns,
          _column_sizes,
          _display_column_keys,
          Keep
        );
      },
    },
  ] as ActionBarItem[];

  // 获取选中状态以及对应图标
  let rowCheckedStatus = Table.getCheckStatus(selection);
  //   let statusIcon = {
  //     all: 'zmdi-check-square',
  //     part: 'zmdi-minus-square',
  //     none: 'zmdi-square-o',
  //   }[rowCheckedStatus];
  return {
    className: 'cover-parent',
    style: {
      justifyContent: 'center',
      alignItem: 'center',
    },
    barPad: 'none',
    vars: {
      checked: rowCheckedStatus,
    },
    items: [
      {
        icon: 'zmdi-square-o',
        className: 'bg-transparent fit-parent',
        style: {
          justifyContent: 'center',
          alignItem: 'center',
          borderRadius: '2px',
        },
        altDisplay: [
          { icon: 'zmdi-check-square', test: { checked: 'all' } },
          { icon: 'zmdi-minus-square', test: { checked: 'part' } },
        ],
        action: (payload: Vars) => {
          if ('all' == payload.checked) {
            Table.selectNone(selection);
          } else {
            Table.checkAll(selection);
          }
        },
        items,
      },
    ],
  };
}
