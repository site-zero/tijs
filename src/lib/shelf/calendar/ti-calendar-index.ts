import { TiComInfo, TiComRace } from "@site0/tijs";
import { App } from "vue";
import TiCalendar from "./TiCalendar.vue";

const COM_TYPE = "TiCalendar";

const en_us = {
  'com-name': 'TiCalendar',
};
const zh_cn = {
  'com-name': '日历',
};

const TiCalendarInfo: TiComInfo = {
  icon: "fas-calendar-days",
  race: TiComRace.SHELF,
  name: COM_TYPE,
  text: "i18n:ti-calendar-com-name",
  i18n: {
    en_us: en_us,
    en_uk: en_us,
    zh_cn: zh_cn,
    zh_hk: zh_cn,
  },
  com: TiCalendar,
  install: (app: App) => {
    app.component(COM_TYPE, TiCalendarInfo);
  },
  defaultProps: "",
  exampleProps: [],
};

export * from "./ti-calendar-types";
export { TiCalendar, TiCalendarInfo };