import { ComPropExample } from "../../../../_type";
import { ListProps } from "../ti-list-types";
import { getListData } from "./mock_data";

export default {
  name: "multi_with_icon",
  text: "i18n:ti-list-example-multi-with-icon",
  comConf: {
    className: "border-dotted fit-parent",
    size: "b",
    currentId: null,
    checkedIds: {},
    multi: true,
    canSelect: true,
    data: getListData({ icon: true, tip: false }),
  } as ListProps,
} as ComPropExample;
