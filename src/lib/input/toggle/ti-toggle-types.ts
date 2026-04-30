import { BooleanProps, ReadonlyProps } from "../../";
import { AspectSize, CommonProps, LogicType } from "../../../_type";

export type ToggleProps = CommonProps &
  BooleanProps &
  ReadonlyProps & {
    type?: LogicType;
    boxFontSize?: AspectSize;
  };
