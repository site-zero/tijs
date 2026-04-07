import { IconInput } from "@site0/tijs";
import { InputBox3Api } from "../ti-input-box3-types";

export type Box3IconHandler = (box: InputBox3Api) => void;
export type Box3IconFor =
  | "copy"
  | "load-options"
  | "clear"
  | "click"
  | "open"
  | Box3IconHandler;

export type BoxIconEmit = "click:prefix-icon" | "click:suffix-icon";

export type BoxIconProps = {
  icon?: IconInput | null;
  hoverIcon?: IconInput | null;
  iconFor?: Box3IconFor;
  autoIcon?: IconInput;
  clickEmit: BoxIconEmit;
};
