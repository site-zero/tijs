import { AspectSize, CommonProps, LogicType, TipableProps } from "@site0/tijs";
import { BooleanProps, ReadonlyProps } from "@site0/tijs";

export type CheckProps = CommonProps &
  BooleanProps &
  ReadonlyProps & {
    type?: LogicType;
    boxFontSize?: AspectSize;
    tipable?: TipableProps;
  };
