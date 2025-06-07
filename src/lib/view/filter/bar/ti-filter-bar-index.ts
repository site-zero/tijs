import { TiComInfo, TiComRace } from "@site0/tijs";
import { App } from "vue";
import { COM_TYPES } from "../../../lib-com-types";
import TiFilterBar from "./TiFilterBar.vue";
import { FilterBarProps } from "./ti-filter-bar-types";

const COM_TYPE = COM_TYPES.FilterBar;

const en_us = {
  "com-name": "Filter Bar",
  "example-xxx": "XXX",
};
const zh_cn = {
  "com-name": "过滤条",
  "example-xxx": "XXX",
};

const TiFilterBarInfo: TiComInfo = {
  icon: "zmdi-graphic-eq",
  race: TiComRace.VIEW,
  name: COM_TYPE,
  text: "i18n:ti-filter-bar-com-name",
  i18n: {
    en_us: en_us,
    en_uk: en_us,
    zh_cn: zh_cn,
    zh_hk: zh_cn,
  },
  com: TiFilterBar,
  install: (app: App) => {
    app.component("TiFilterBar", TiFilterBar);
  },
  defaultProps: "simple",
  exampleProps: [
    {
      name: "simple",
      text: "i18n:simple",
      comConf: {} as FilterBarProps,
    },
  ],
};

export * from "./ti-filter-bar-types";
export { TiFilterBar, TiFilterBarInfo };
