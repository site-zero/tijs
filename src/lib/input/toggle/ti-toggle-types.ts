import { BooleanProps, ReadonlyProps } from "../../";
import { CommonProps, LogicType } from "../../../_type";

export type ToggleProps = CommonProps &
  BooleanProps &
  ReadonlyProps & {
    texts?: string[];
    type?: LogicType;
  };
