import { IconInput } from "@site0/tijs";
import { InputBox3Api } from "../ti-input-box3-types";

export type BoxIconHandler = (box: InputBox3Api) => void;
export type BoxIconFor =
  | "copy"
  | "load-options"
  | "clear"
  | "click"
  | "open"
  | BoxIconHandler;

export type BoxIconEmit = "click:prefix-icon" | "click:suffix-icon";

export type BoxIconProps = {
  icon?: IconInput | null;
  hoverIcon?: IconInput | null;
  iconFor?: BoxIconFor;
  autoIcon?: IconInput;
  clickEmit: BoxIconEmit;
};
