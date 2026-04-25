import { TiComInfo, TiComRace,  } from "@site0/tijs";
import { App } from "vue";
import TiEditPairs from "./TiEditPairs.vue";
import { TiEditPairsProps } from "./edit-pairs-types";

const COM_TYPE = "TiEditPairs";

const en_us = {
  "com-name": "EditPairs",
};
const zh_cn = {
  "com-name": "名值对编辑",
};

const TiEditPairsInfo: TiComInfo = {
  icon: "fas-address-book",
  race: TiComRace.EDIT,
  name: COM_TYPE,
  text: "i18n:ti-edit-pairs-com-name",
  i18n: {
    en_us: en_us,
    en_uk: en_us,
    zh_cn: zh_cn,
    zh_hk: zh_cn,
  },
  com: TiEditPairs,
  install: (app: App) => {
    app.component(COM_TYPE, TiEditPairsInfo);
  },
  defaultProps: "simple",
  exampleProps: [
    {
      name: "simple",
      text: "i18n:simple",
      comConf: {
        value: "{pos:{x:100,y:99}}",
      } as TiEditPairsProps,
    },
  ],
};

export * from "./edit-pairs-types";
export { TiEditPairs, TiEditPairsInfo };
