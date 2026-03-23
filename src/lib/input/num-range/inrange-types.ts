import {
  CheckProps,
  CommonProps,
  InputNumProps,
  InputRangeEmitter,
  RangeApiProps,
} from "@site0/tijs";

export type InputNumRangeEmitter = InputRangeEmitter<number>;

export type InputNumRangeProps = CommonProps &
  RangeApiProps<number, CheckProps, InputNumProps>;
