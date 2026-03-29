import {
  CommonProps,
  DictProps,
  DisplayTextProps,
  PlaceholderProps,
  ReadonlyProps,
  ValuePipeProps,
} from "@site0/tijs";
import { InputBoxAspect } from "./types";

export type TiInputBox3Emitter = {
  (event: "change", value: any): void;
  (event: "blur"): void;
  (event: "focus"): void;
  (event: "click:prefix-icon"): void;
  (event: "click:suffix-icon"): void;
  (event: "click", payload: any): void;
};

export type TiInputBox3Props = CommonProps &
  DictProps &
  DisplayTextProps &
  InputBoxAspect &
  PlaceholderProps &
  ReadonlyProps &
  ValuePipeProps & {};
