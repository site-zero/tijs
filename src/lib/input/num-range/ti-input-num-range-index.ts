import { TiComInfo, TiComRace } from "@site0/tijs";
import { App } from "vue";
import TiInputNumRange from "./TiInputNumRange.vue";
import { InputNumRangeProps } from "./inrange-types";

const COM_TYPE = "TiInputNumRange";

const en_us = {
  "com-name": "Number Range",
  "edit-title": "Edit Range",
  "scope": "Range",
  "info-na": "No range",
  "info-eq": "Equals ${minValue}",
  "info-in": "Greater Than ${minValue} and Less Than ${maxValue}",
  "info-in-le":
    "Greater Than Eq ${minValue} and Less Than ${maxValue}",
  "info-in-re":
    "Greater Than ${minValue} and Less Than Eq ${maxValue}",
  "info-in-lre":
    "Greater Than Eq ${minValue} and Less Than Eq ${maxValue}",
  "info-lt": "Less Than ${maxValue}",
  "info-lte": "Less Than Eq ${maxValue}",
  "info-gt": "Greater Than ${minValue}",
  "info-gte": "Greater Than Eq ${minValue}",
  "expt-na": "Unset",
  "expt-eq": "N == ${minValue}",
  "expt-in": "${minValue} < N < ${maxValue}",
  "expt-in-le": "${minValue} ≤ N < ${maxValue}",
  "expt-in-re": "${minValue} < N ≤ ${maxValue}",
  "expt-in-lre": "${minValue} ≤ N ≤ ${maxValue}",
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
  "edit-title": "编辑数值范围",
  "scope": "数值区间",
  "info-na": "未指定数值范围",
  "info-eq": "等于 ${minValue}",
  "info-in": "大于 ${minValue} 并且小于 ${maxValue}",
  "info-in-le": "大于等于 ${minValue} 并且小于 ${maxValue}",
  "info-in-re": "大于 ${minValue} 并且小于等于 ${maxValue}",
  "info-in-lre": "大于等于 ${minValue} 并且小于等于 ${maxValue}",
  "info-lt": "小于 ${maxValue}",
  "info-lte": "小于等于 ${maxValue}",
  "info-gt": "大于 ${minValue}",
  "info-gte": "大于等于 ${minValue}",
  "expt-na": "未设置",
  "expt-eq": "N == ${minValue}",
  "expt-in": "${minValue} < N < ${maxValue}",
  "expt-in-le": "${minValue} ≤ N < ${maxValue}",
  "expt-in-re": "${minValue} < N ≤ ${maxValue}",
  "expt-in-lre": "${minValue} ≤ N ≤ ${maxValue}",
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
  ],
};

export * from "./inrange-types";
export { TiInputNumRange, TiInputNumRangeInfo };
