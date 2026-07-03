import { TableProps } from "@site0/tijs";
import { EditTableProps } from "./edit-table-types";

export function useTiEditTableTableConfig(
  _props: EditTableProps,
  api: TiEditTableApi
): TableProps {
  return {
    className: "cover-parent as-zebra",
    data: api.ListData.value,
    currentId: api.CurrentId.value,
    checkedIds: api.CheckedIds.value,
    keepColumns: "local: GUI-TiEditTable-Table-Columns",
    columns: [],
  };
}