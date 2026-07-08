import {
  CommonProps,
  IconInput,
  IconObj,
  LogicType,
  TiColor,
  TiDict,
  Vars,
} from "@site0/tijs";

export type IconEmitter = {
  (event: "click", payload: IconObj): void;
};

export interface IconProps extends CommonProps {
  //
  // Data
  //
  value?: IconInput;
  base?: string;
  dict?: TiDict;
  defaultValue?: IconInput;
  tip?: string;
  // //
  // // Behavior
  // //
  // notifyName?: string;
  // notifyConf?: any;
  // stopPropagation?: boolean;
  onClick?: (icon: IconObj) => void;
  //
  // Aspect
  //
  width?: number | string;
  height?: number | string;
  opacity?: number;
  // font only
  fontSize?: number | string;
  color?: string | TiColor;
  logicType?: LogicType; // for font icon
  // image only
  objectFit?: "contain" | "cover" | "fill" | "scale-down";
  // Free Style
  style?: Vars;
  imgStyle?: Vars;
  fontStyle?: Vars;
}
