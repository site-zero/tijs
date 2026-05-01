import {
  AspectSize,
  BooleanProps,
  CommonProps,
  IconInput,
  LogicType,
  ReadonlyProps,
} from "@site0/tijs";

export type ToggleProps = CommonProps &
  BooleanProps &
  ReadonlyProps & {
    type?: LogicType;
    boxFontSize?: AspectSize;
    width?: string;
  };
