import { TiComInfo, TiComRace } from "@site0/tijs";
import { App } from "vue";
import TiInputBox3 from "./TiInputBox3.vue";

const COM_TYPE = "TiInputBox3";

const en_us = {
  "com-name": "TiInputBox3",
};
const zh_cn = {
  "com-name": "TiInputBox3",
};

const TiInputBox3Info: TiComInfo = {
  icon: "fas-address-book",
  race: TiComRace.VIEW,
  name: COM_TYPE,
  text: "i18n:ti-input-box3-com-name",
  i18n: {
    en_us: en_us,
    en_uk: en_us,
    zh_cn: zh_cn,
    zh_hk: zh_cn,
  },
  com: TiInputBox3,
  install: (app: App) => {
    app.component(COM_TYPE, TiInputBox3Info);
  },
  defaultProps: "",
  exampleProps: [],
};

export * from "./ti-input-box3-types";
export * from "./types";
export { TiInputBox3, TiInputBox3Info };
