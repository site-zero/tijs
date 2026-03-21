import {
  CheckProps,
  CommonProps,
  InputNumProps,
  InputRangeEmitter,
  NumRangeInfo,
  NumRangeObj,
  RangeApiProps,
} from "@site0/tijs";

export type InputNumRangeEmitter = InputRangeEmitter<number>;

export type NumRangeInputValue = string | number[] | NumRangeInfo | NumRangeObj;

export type InputNumRangeProps = CommonProps &
  RangeApiProps<number, CheckProps, InputNumProps>;
