import { IconInput } from "@site0/tijs";

/**
 * Icon 的自定义回调处理
 */
export type BoxIconHandler<A> = (boxApi: A) => void;
export type BoxIconFor<A> =
  | "copy"
  | "load-options"
  | "clear"
  | "click"
  | "open"
  | BoxIconHandler<A>;

export type BoxIconEmit = "click:prefix-icon" | "click:suffix-icon";

export type BoxIconProps<A> = {
  icon?: IconInput | null;
  hoverIcon?: IconInput | null;
  iconFor?: BoxIconFor<A>;
  autoIcon?: IconInput;
  clickEmit: BoxIconEmit;
};
