import { TiColor, TiDict, Vars } from "../../../core";
import { IconInput } from "../../";
import { CommonProps } from "../../features";

export interface IconProps extends CommonProps {
  //
  // Data
  //
  value?: IconInput;
  base?: string;
  dict?: TiDict;
  defaultValue?: IconInput;
  //
  // Behavior
  //
  notifyName?: string;
  notifyConf?: any;
  stopPropagation?: boolean;
  //
  // Aspect
  //
  width?: number | string;
  height?: number | string;
  opacity?: number;
  // font only
  fontSize?: number | string;
  color?: string | TiColor;
  // image only
  objectFit?: "contain" | "cover" | "fill" | "scale-down";
  // Free Style
  imgStyle?: Vars;
  fontStyle?: Vars;
}