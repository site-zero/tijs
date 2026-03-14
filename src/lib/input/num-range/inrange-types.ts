import {
  AppModalProps,
  CheckProps,
  CommonProps,
  InputNumProps,
  NumRangeObj,
  NumRangeInfo,
} from "@site0/tijs";

export type InputNumRangeEmitter = {
  (event: "change", payload: string | null): void;
};

export type NumRangeInputValue = string | number[] | NumRangeInfo | NumRangeObj;

export type InputNumRangeProps = CommonProps & {
  value?: NumRangeInputValue | null;
  readonly?: boolean;
  numConfig?: InputNumProps;
  checkConfig?: CheckProps;
  dialog?: Omit<AppModalProps, "comType" | "comConf">;
};
