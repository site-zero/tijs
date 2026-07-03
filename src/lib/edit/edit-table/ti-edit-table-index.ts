import { TiComInfo, TiComRace, EditTableProps } from "@site0/tijs";
import { App } from "vue";
import TiEditTable from "./TiEditTable.vue";

const COM_TYPE = "TiEditTable";

const en_us = {
  "com-name": "Object Edit Table",
};
const zh_cn = {
  "com-name": "编辑对象表格",
};

const TiEditTableInfo: TiComInfo = {
  icon: "fas-sheet",
  race: TiComRace.VIEW,
  name: COM_TYPE,
  text: "i18n:ti-edit-table-com-name",
  i18n: {
    en_us: en_us,
    en_uk: en_us,
    zh_cn: zh_cn,
    zh_hk: zh_cn,
  },
  com: TiEditTable,
  install: (app: App) => {
    app.component(COM_TYPE, TiEditTableInfo);
  },
  defaultProps: "simple",
  exampleProps: [
    {
      name: "simple",
      text: "i18n:simple",
      comConf: {} as EditTableProps,
    },
  ],
};

export * from "./edit-table-types";
export { TiEditTable, TiEditTableInfo };
