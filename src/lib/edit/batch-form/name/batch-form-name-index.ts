import { TiComInfo, TiComRace } from "@site0/tijs";
import { App } from "vue";
import BatchFormName from "./BatchFormName.vue";

const COM_TYPE = "BatchFormName";

const en_us = {
  "com-name": "BatchFormName",
};
const zh_cn = {
  "com-name": "BatchFormName",
};

const BatchFormNameInfo: TiComInfo = {
  icon: "fas-address-book",
  race: TiComRace.INNER,
  asInner: true,
  name: COM_TYPE,
  text: "i18n:batch-form-name-com-name",
  i18n: {
    en_us: en_us,
    en_uk: en_us,
    zh_cn: zh_cn,
    zh_hk: zh_cn,
  },
  com: BatchFormName,
  install: (app: App) => {
    app.component(COM_TYPE, BatchFormNameInfo);
  },
  defaultProps: "",
  exampleProps: [],
};

export * from "./batch-form-name-types";
export { BatchFormName, BatchFormNameInfo };
