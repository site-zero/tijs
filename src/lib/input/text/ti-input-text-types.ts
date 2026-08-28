import { ActionBarProps, PlaceholderProps, ReadonlyProps } from "../../";
import { CommonProps, Vars } from "../../../_type";

export type InputTextActionPosition = "top" | "bottom" | "left" | "right";

export type InputTextProps = CommonProps &
  ReadonlyProps &
  PlaceholderProps & {
    hideBorder?: boolean;
    inputStyle?: Vars;
    trimed?: boolean;
    value?: any;
    valueType?: "list" | "text";
    style?: Vars;
    width?: number | string;
    height?: number | string;
    actionBar?: ActionBarProps;
    /**
     * 定制的动作条位置，默认是 "top"
     */
    actionBarPosition?: InputTextActionPosition;
  };
