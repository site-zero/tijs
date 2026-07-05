import { colInput, TableProps } from "@site0/tijs";
import { EditRecordsProps } from "./edit-records-types";
import { EditRecordsApi } from "./use-edit-records-api";

export function useTiEditRecordsTableConfig(
  props: EditRecordsProps,
  api: EditRecordsApi
): TableProps {
  return {
    className: "as-zebra",
    columns: [
      colInput("value", "Value"),
      colInput("text", "Text"),
      colInput("tip", "Tip"),
    ],
    mainFontSize: "s",
    mainScrollMode: "stretch",
    ...props.table,
    getId: api.getItemId,
    data: api.ListData.value,
    currentId: api.CurrentId.value,
    checkedIds: api.CheckedIds.value,
    keepColumns: "local: GUI-EditRecords-Table-Columns",
  };
}
