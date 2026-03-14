import { CommonProps } from "@site0/tijs";

export type InputDateRangeEmitter = {
  (event: "change", payload: any): void;
};

export type DataRangeInfo = {
  hasMinValue: boolean;
  minValue: string; //
  minValueIncluded: boolean;
  hasMaxValue: boolean;
  maxValue: string;  // yyyy-MM-dd
  maxValueIncluded: boolean;
}

export type RanSgeObj = {
  $gt?: string;
  $gte?: string;
  $lt?: string;
  $lte?: string;
}

/**
 * 日期范围输入值
 *  - 字符串：Str[2022-02-02,2024-09-10]
 *  - 数组：`["2022-02-02","2024-09-10"]`
 *  - 范围对象: `{$gt:"2022-02-02", $lte:"2024-09-10"}`
 *  - 标准对象: `{minValue:"2022-02-02", minValueIncluded:true, maxValue:"2024-09-10", maxValueIncluded:false}`
 */
export type DateRangeInputValue = string | string[] ;

export type InputDateRangeProps = CommonProps & {
  // 这里放置控件支持的属性
};