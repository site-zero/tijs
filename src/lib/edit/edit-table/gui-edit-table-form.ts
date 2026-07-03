import { FormProps } from "@site0/tijs";
import { EditTableProps } from "./edit-table-types";
import { EditTableApi } from "./use-edit-table-api";

export function useTiEditTableForm(
  _props: EditTableProps,
  api: EditTableApi
): FormProps {
  return {
    className: "cover-parent",
    title: "TiEditTable DETAIL",
    titleIcon: "fas-hand-holding-dollar",
    titleClass: "bunya-form-title-1",
    layoutHint: 1,
    maxFieldNameWidth: 100,
    data: api.CurrentData.value,
    emptyRoadblock: {
      text: "i18n:nil-item",
      icon: "fas-arrow-left",
    },
    fields: [],
  };
}