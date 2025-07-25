import { ComputedRef, Ref } from "vue";
import { ActionBarProps, TableStrictColumn } from "../../";
import { ActionBarItem, Vars } from "../../../_type";
import { doCustomizeColumn } from "./use-customized-columns";
import { TableFeature } from "./use-table";
import { TableKeepFeature } from "./use-table-keep";

export function useTableHeadMenu(
  _table: TableFeature,
  AllTableColumns: ComputedRef<TableStrictColumn[]>,
  _column_sizes: Ref<Record<string, number>>,
  _display_column_keys: Ref<string[]>,
  Keep: TableKeepFeature
): ActionBarProps {
  let items = [
    {
      icon: "zmdi-check-all",
      text: "i18n:ti-table-select-all",
      action: () => {
        _table.checkAll();
      },
    },
    {
      icon: "zmdi-minus",
      text: "i18n:ti-table-select-none",
      action: () => {
        _table.selectNone();
      },
    },
    {},
    {
      icon: "zmdi-settings",
      text: "i18n:ti-table-customized",
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
  let rowCheckedStatus = _table.getCheckStatus();
  //   let statusIcon = {
  //     all: 'zmdi-check-square',
  //     part: 'zmdi-minus-square',
  //     none: 'zmdi-square-o',
  //   }[rowCheckedStatus];
  return {
    className: "cover-parent",
    barPad: "none",
    vars: {
      checked: rowCheckedStatus,
    },
    items: [
      {
        icon: "zmdi-square-o",
        className: "bg-transparent fit-parent",
        style: {
          gridTemplateColumns: "1fr auto",
          justifyContent: "flex-start",
          alignItem: "center",
          borderRadius: "2px",
        },
        altDisplay: [
          { icon: "zmdi-check-square", test: { checked: "all" } },
          { icon: "zmdi-minus-square", test: { checked: "part" } },
        ],
        action: (_uniqKey, vars: Vars) => {
          if ("all" == vars.checked) {
            _table.selectNone();
          } else {
            _table.checkAll();
          }
        },
        items,
      },
    ],
  };
}
