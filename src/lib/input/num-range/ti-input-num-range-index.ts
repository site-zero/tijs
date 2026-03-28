import { TiComInfo, TiComRace } from "@site0/tijs";
import { App } from "vue";
import TiInputNumRange from "./TiInputNumRange.vue";
import { InputNumRangeProps } from "./inrange-types";

const COM_TYPE = "TiInputNumRange";

// "info-in": "${minValue} < N < ${maxValue}",
// "info-in-le": "${minValue} ≤ N < ${maxValue}",
// "info-in-re": "${minValue} < N ≤ ${maxValue}",
// "info-in-lre": "${minValue} ≤ N ≤ ${maxValue}",
// "info-lt": "N < ${maxValue}",
// "info-lte": "N ≤ ${maxValue}",
// "info-gt": "N > ${minValue}",
// "info-gte": "N ≥ ${minValue}",

const en_us = {
  "com-name": "Number Range",
  "example-as-array": "As Array",
  "example-as-info": "As Info",
  "example-as-obj": "As Object",
  "edit-title": "Edit Range",
  "scope": "Range",
  "info-NA": "No range",
  "info-ne": "Unequals ${minValue}",
  "info-eq": "Equals ${minValue}",
  "info-gtlt": "Greater Than ${minValue} and Less Than ${maxValue}",
  "info-gtelt": "Greater Than Eq ${minValue} and Less Than ${maxValue}",
  "info-gtlte": "Greater Than ${minValue} and Less Than Eq ${maxValue}",
  "info-gtelte": "Greater Than Eq ${minValue} and Less Than Eq ${maxValue}",
  "info-lt": "Less Than ${maxValue}",
  "info-lte": "Less Than Eq ${maxValue}",
  "info-gt": "Greater Than ${minValue}",
  "info-gte": "Greater Than Eq ${minValue}",
  "expt-NA": "Unset",
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
  "max": "Max",
  "max-val": "Max value",
  "max-included": "Include max",
  "min": "Min",
  "min-val": "Min value",
  "min-included": "Include min",
  "included": "Include",
  "excluded": "Exclude",
};
const zh_cn = {
  "com-name": "数字范围",
  "example-as-array": "数组值",
  "example-as-info": "表单信息",
  "example-as-obj": "比较对象",
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

const TiInputNumRangeInfo: TiComInfo = {
  icon: "zmdi-collection-item-2",
  race: TiComRace.INPUT,
  name: COM_TYPE,
  text: "i18n:ti-input-num-range-com-name",
  i18n: {
    en_us: en_us,
    en_uk: en_us,
    zh_cn: zh_cn,
    zh_hk: zh_cn,
  },
  com: TiInputNumRange,
  install: (app: App) => {
    app.component(COM_TYPE, TiInputNumRangeInfo);
  },
  defaultProps: "simple",
  exampleProps: [
    {
      name: "simple",
      text: "i18n:simple",
      comConf: {
        value: "[1,23]",
      } as InputNumRangeProps,
    },
    {
      name: "as-info",
      text: "i18n:ti-input-num-range-example-as-info",
      comConf: {
        value: {
          hasMinValue: true,
          minValue: 1,
          minValueIncluded: true,
          hasMaxValue: true,
          maxValue: 99,
          maxValueIncluded: true,
        },
        valueType: "info",
      } as InputNumRangeProps,
    },
    {
      name: "as-obj",
      text: "i18n:ti-input-num-range-example-as-obj",
      comConf: {
        value: {
          $gte: 1,
          $lte: 99,
        },
        valueType: "obj",
      } as InputNumRangeProps,
    },
    {
      name: "as-array",
      text: "i18n:ti-input-num-range-example-as-array",
      comConf: {
        value: [1, 99],
        valueType: "array",
      } as InputNumRangeProps,
    },
  ],
};

export * from "./inrange-types";
export { TiInputNumRange, TiInputNumRangeInfo };
