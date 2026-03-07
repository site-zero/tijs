import { TiComInfo, TiComRace } from "@site0/tijs";
import { App } from "vue";
import TiInputDateRange from "./TiInputDateRange.vue";
import { InputDateRangeProps } from "./daterange-types";

const COM_TYPE = "TiInputDateRange";

const en_us = {
  'com-name': 'Date Range',
};
const zh_cn = {
  'com-name': '日期范围',
};

const TiInputDateRangeInfo: TiComInfo = {
  icon: "zmdi-calendar-note",
  race: TiComRace.INPUT,
  name: COM_TYPE,
  text: "i18n:ti-input-date-range-com-name",
  i18n: {
    en_us: en_us,
    en_uk: en_us,
    zh_cn: zh_cn,
    zh_hk: zh_cn,
  },
  com: TiInputDateRange,
  install: (app: App) => {
    app.component(COM_TYPE, TiInputDateRangeInfo);
  },
  defaultProps: "simple",
  exampleProps: [{
    name: 'simple',
    text: 'i18n:simple',
    comConf: {
    } as InputDateRangeProps
  }],
};

export * from "./daterange-types";
export { TiInputDateRange, TiInputDateRangeInfo };