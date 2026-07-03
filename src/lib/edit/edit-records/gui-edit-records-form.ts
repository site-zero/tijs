import { FormProps } from "@site0/tijs";
import { EditRecordsProps } from "./edit-records-types";
import { EditRecordsApi } from "./use-edit-records-api";

export function useTiEditTableForm(
  _props: EditRecordsProps,
  api: EditRecordsApi
): FormProps {
  return {
    className: "cover-parent",
    title: "TiEditTable DETAIL",
    titleIcon: "fas-hand-holding-dollar",
    titleClass: "bunya-form-title-1",
    layoutHint: 1,
    maxFieldNameWidth: 100,
    data: api.CurrentItem.value,
    emptyRoadblock: {
      text: "i18n:nil-item",
      icon: "fas-arrow-left",
    },
    fields: [],
  };
}
