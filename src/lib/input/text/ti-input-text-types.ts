import {
  ActionBarProps,
  CommonProps,
  PlaceholderProps,
  ReadonlyProps,
  Vars,
} from "@site0/tijs";
import { useInputTextApi } from "./ti-input-text-api";

export type InputTextEmitter = {
  (eventName: "change", payload: any): void;
};

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

export type InputTextApi = ReturnType<typeof useInputTextApi>;
