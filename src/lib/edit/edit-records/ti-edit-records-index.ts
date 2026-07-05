import { EditRecordsProps, TiComInfo, TiComRace } from "@site0/tijs";
import { App } from "vue";
import TiEditRecords from "./TiEditRecords.vue";

const COM_TYPE = "TiEditRecords";

const en_us = {
  "com-name": "Edit Records",
};
const zh_cn = {
  "com-name": "记录对象编辑",
};

const TiEditRecordsInfo: TiComInfo = {
  icon: "fas-table-list",
  race: TiComRace.EDIT,
  name: COM_TYPE,
  text: "i18n:ti-edit-records-com-name",
  i18n: {
    en_us: en_us,
    en_uk: en_us,
    zh_cn: zh_cn,
    zh_hk: zh_cn,
  },
  com: TiEditRecords,
  install: (app: App) => {
    app.component(COM_TYPE, TiEditRecordsInfo);
  },
  defaultProps: "simple",
  exampleProps: [
    {
      name: "simple",
      text: "i18n:simple",
      comConf: {
        table: {
          className: "fit-parent",
          mainScrollMode: "cover",
        },
        newItem: {
          value: "->item-${N}",
          text: "->New Item ${N}",
        },
      } as EditRecordsProps,
    },
  ],
};

export * from "./edit-records-types.js";
export { TiEditRecords, TiEditRecordsInfo };
