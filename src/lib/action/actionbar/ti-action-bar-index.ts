import { App } from "vue";
import { TiComInfo, TiComRace, Vars } from "../../../_type";
import { COM_TYPES } from "../../lib-com-types";
import TiActionBar from "./TiActionBar.vue";
import * as example from "./example";

const en_us = {
  "com-name": "Action Bar",
  "example-visibility": "Visibility",
  "example-mode-v": "Vertical Mode",
  "example-bool": "Bool Items",
};
const zh_cn = {
  "com-name": "动作条",
  "example-visibility": "可见性",
  "example-mode-v": "垂直模式",
  "example-bool": "布尔选项",
};

const COM_TYPE = COM_TYPES.ActionBar;

const TiActionBarInfo: TiComInfo = {
  icon: "fas-bars",
  race: TiComRace.ACTION,
  name: COM_TYPE,
  text: "i18n:ti-action-bar-com-name",
  i18n: {
    en_us: en_us,
    en_uk: en_us,
    zh_cn: zh_cn,
    zh_hk: zh_cn,
  },
  com: TiActionBar,
  install: (app: App) => {
    app.component(COM_TYPE, TiActionBar);
  },
  exampleModel: {
    fire: (val, comConf: Vars): Vars => {
      let fireName = val.name;
      if ("toggle-showDeleted" == fireName) {
        comConf.vars.showDeleted = !comConf.vars.showDeleted;
      } else if ("toggle-showMarkNum" == fireName) {
        comConf.vars.showMarkNum = !comConf.vars.showMarkNum;
      }
      return comConf;
    },
  },
  defaultProps: "simple",
  exampleProps: [
    example.simple,
    example.visiblity,
    example.modeV,
    example.boolItems,
  ],
};

export * from "./ti-action-bar-types";
export { TiActionBar, TiActionBarInfo };
