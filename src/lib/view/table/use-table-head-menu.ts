import { ComputedRef, Ref } from 'vue';
import { ActionBarProps, TableSelection, TableStrictColumn } from '../../';
import { ActionBarItem, Vars } from '../../../_type';
import { doCustomizeColumn } from './use-customized-columns';
import { TableFeature } from './use-table';
import { TableKeepFeature } from './use-table-keep';

export function useTableHeadMenu(
  selection: TableSelection,
  Table: TableFeature,
  RenderedTableColumns: ComputedRef<TableStrictColumn[]>,
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
        // Alert(
        //   `设置包括：
        //    - 表格列布局(显示隐藏哪些列，以及列的顺序)，
        //    - 如何与其他用户分享设置
        //   同时我还没想好这个设置按钮放在哪里比较好，放在这里好像有点丑
        //   我可以有下面的选择:
        //    A. 放到最右侧
        //    B. 不放按钮，右键点击标题栏在菜单中体现
        //    C. 鼠标移动到标题第一栏，显示设置按钮`,
        //   {
        //     bodyIcon: 'far-lightbulb',
        //     clickMaskToClose: true,
        //   }
        // );
        await doCustomizeColumn(
          RenderedTableColumns,
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
