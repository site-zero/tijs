import {
  CheckProps,
  CommonProps,
  InputDatetimeProps,
  InputRangeEmitter,
  RangeApiProps,
} from "@site0/tijs";

export type InputDateRangeEmitter = InputRangeEmitter<string>;

/**
 * 日期范围输入值
 *  - 字符串：Str[2022-02-02,2024-09-10]
 *  - 数组：`["2022-02-02","2024-09-10"]`
 *  - 范围对象: `{$gt:"2022-02-02", $lte:"2024-09-10"}`
 *  - 标准对象: `{minValue:"2022-02-02", minValueIncluded:true, maxValue:"2024-09-10", maxValueIncluded:false}`
 */
export type DateRangeInputValue = string | string[];

export type InputDateRangeProps = CommonProps &
  RangeApiProps<string, CheckProps, InputDatetimeProps>;
