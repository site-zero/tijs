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
  (event: "click", vars: Vars): void;
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
  vars?: Vars;
  //
  // Aspect
  //
  width?: number | string;
  height?: number | string;
  opacity?: number;
  canHover?: boolean;

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
