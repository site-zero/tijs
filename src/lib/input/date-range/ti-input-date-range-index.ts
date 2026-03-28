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
  "example-as-array": "数组值",
  "example-as-info": "表单信息",
  "example-as-obj": "比较对象",
  "edit-title": "编辑日期范围",
  "scope": "日期区间",
  "info-NA": "未指定日期范围",
  "info-eq": "等于 ${minValue}",
  "info-ne": "不等于 ${minValue}",
  "info-gtlt": "从不包括 ${minValue} 至不包括 ${maxValue}",
  "info-gtelt": "从包括 ${minValue} 至不包括 ${maxValue}",
  "info-gtlte": "从不包括 ${minValue} 至包括 ${maxValue}",
  "info-gtelte": "从包括 ${minValue} 至包括 ${maxValue}",
  "info-lt": "早于且不包括 ${maxValue}",
  "info-lte": "早于且包括 ${maxValue}",
  "info-gt": "晚于且不包括 ${minValue}",
  "info-gte": "晚于且包括 ${minValue}",
  "expt-NA": "未设置日期范围",
  "expt-eq": "Date == ${minValue}",
  "expt-ne": "Date != ${minValue}",
  "expt-gtlt": "${minValue} < Date < ${maxValue}",
  "expt-gtelt": "${minValue} ≤ Date < ${maxValue}",
  "expt-gtlte": "${minValue} < Date ≤ ${maxValue}",
  "expt-gtelte": "${minValue} ≤ Date ≤ ${maxValue}",
  "expt-lt": "Date < ${maxValue}",
  "expt-lte": "Date ≤ ${maxValue}",
  "expt-gt": "Date > ${minValue}",
  "expt-gte": "Date ≥ ${minValue}",
  "max": "最晚",
  "max-val": "最晚日期",
  "max-included": "包含最晚日期",
  "min": "最早",
  "min-val": "最早日期",
  "min-included": "包含最早日期",
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
      comConf: {
        value: "[2026-03-01,2026-03-31]",
        valueType: "array",
      } as InputDateRangeProps,
    },
    {
      name: "as-info",
      text: "i18n:ti-input-date-range-example-as-info",
      comConf: {
        value: {
          hasMinValue: true,
          minValue: "2026-04-01",
          minValueIncluded: true,
          hasMaxValue: true,
          maxValue: "2026-04-30",
          maxValueIncluded: true,
        },
        valueType: "info",
      } as InputDateRangeProps,
    },
    {
          name: "as-obj",
          text: "i18n:ti-input-date-range-example-as-obj",
          comConf: {
            value: {
              $gte: "2026-05-01",
              $lte: "2026-05-31",
            },
            valueType: "obj",
          } as InputDateRangeProps,
        },
        {
          name: "as-array",
          text: "i18n:ti-input-date-range-example-as-array",
          comConf: {
            value: ["2026-06-01", "2026-06-30"],
            valueType: "array",
          } as InputDateRangeProps,
        },
  ],
};

export * from "./daterange-types";
export { TiInputDateRange, TiInputDateRangeInfo };
