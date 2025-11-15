import { TiComInfo, TiComRace } from "@site0/tijs";
import { App } from "vue";
import TiTimeSlots from "./TiTimeSlots.vue";

const COM_TYPE = "TiTimeSlots";

const en_us = {
  "com-name": "TiTimeSlots",
};
const zh_cn = {
  "com-name": "日时间槽",
};

const TiTimeSlotsInfo: TiComInfo = {
  tags: ["scaffold"],
  icon: "zmdi-time-interval",
  race: TiComRace.SHELF,
  name: COM_TYPE,
  text: "i18n:ti-time-slots-com-name",
  i18n: {
    en_us: en_us,
    en_uk: en_us,
    zh_cn: zh_cn,
    zh_hk: zh_cn,
  },
  com: TiTimeSlots,
  install: (app: App) => {
    app.component(COM_TYPE, TiTimeSlotsInfo);
  },
  defaultProps: "",
  exampleProps: [],
};

export * from "./ti-time-slots-types";
export { TiTimeSlots, TiTimeSlotsInfo };
