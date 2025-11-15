import { TiComInfo, TiComRace } from "@site0/tijs";
import { App } from "vue";
import TiWeeks from "./TiWeeks.vue";

const COM_TYPE = "TiWeeks";

const en_us = {
  "com-name": "TiWeeks",
};
const zh_cn = {
  "com-name": "周视图",
};

const TiWeeksInfo: TiComInfo = {
  tags: ["scaffold"],
  icon: "fas-calendar-week",
  race: TiComRace.SHELF,
  name: COM_TYPE,
  text: "i18n:ti-weeks-com-name",
  i18n: {
    en_us: en_us,
    en_uk: en_us,
    zh_cn: zh_cn,
    zh_hk: zh_cn,
  },
  com: TiWeeks,
  install: (app: App) => {
    app.component(COM_TYPE, TiWeeksInfo);
  },
  defaultProps: "",
  exampleProps: [],
};

export * from "./ti-weeks-types";
export { TiWeeks, TiWeeksInfo };
