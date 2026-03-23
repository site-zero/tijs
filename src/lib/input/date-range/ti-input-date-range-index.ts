import { TiComInfo, TiComRace } from "@site0/tijs";
import { App } from "vue";
import TiInputDateRange from "./TiInputDateRange.vue";
import { InputDateRangeProps } from "./daterange-types";

const COM_TYPE = "TiInputDateRange";

const en_us = {
  "com-name": "Date Range",
};
const zh_cn = {
  "com-name": "日期范围",
  "edit-title": "编辑数值范围",
  "scope": "数值区间",
  "info-NA": "未指定数值范围",
  "info-eq": "等于 ${minValue}",
  "info-ne": "不等于 ${minValue}",
  "info-gtlt": "大于 ${minValue} 并且小于 ${maxValue}",
  "info-gtelt": "大于等于 ${minValue} 并且小于 ${maxValue}",
  "info-gtlte": "大于 ${minValue} 并且小于等于 ${maxValue}",
  "info-gtelte": "大于等于 ${minValue} 并且小于等于 ${maxValue}",
  "info-lt": "小于 ${maxValue}",
  "info-lte": "小于等于 ${maxValue}",
  "info-gt": "大于 ${minValue}",
  "info-gte": "大于等于 ${minValue}",
  "expt-NA": "未设置",
  "expt-eq": "N == ${minValue}",
  "expt-ne": "N != ${minValue}",
  "expt-gtlt": "${minValue} < N < ${maxValue}",
  "expt-gtelt": "${minValue} ≤ N < ${maxValue}",
  "expt-gtlte": "${minValue} < N ≤ ${maxValue}",
  "expt-gtelte": "${minValue} ≤ N ≤ ${maxValue}",
  "expt-lt": "N < ${maxValue}",
  "expt-lte": "N ≤ ${maxValue}",
  "expt-gt": "N > ${minValue}",
  "expt-gte": "N ≥ ${minValue}",
  "max": "最大",
  "max-val": "最大数值",
  "max-included": "包含最大数值",
  "min": "最小",
  "min-val": "最小数值",
  "min-included": "包含最小数值",
  "included": "包含",
  "excluded": "不包含",
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
  exampleProps: [
    {
      name: "simple",
      text: "i18n:simple",
      comConf: {} as InputDateRangeProps,
    },
  ],
};

export * from "./daterange-types";
export { TiInputDateRange, TiInputDateRangeInfo };
