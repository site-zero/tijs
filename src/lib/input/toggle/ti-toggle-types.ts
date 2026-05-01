import {
  AspectSize,
  BooleanProps,
  CommonProps,
  LogicType,
  ReadonlyProps,
  TipableProps,
} from "@site0/tijs";

export type ToggleProps = CommonProps &
  BooleanProps &
  ReadonlyProps & {
    type?: LogicType;
    boxFontSize?: AspectSize;
    tipable?: TipableProps;
    width?: string;
  };
