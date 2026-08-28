import { ActionBarLayoutMode, ActionBarProps } from "@site0/tijs";
import { InputTextProps } from "../ti-input-text-types";

export function gen_text_action_bar_config(
  props: InputTextProps
): ActionBarProps | undefined {
  if (!props.actionBar) return;

  // 自动判断布局方式
  let layoutMode: ActionBarLayoutMode = "H";
  let barPos = props.actionBarPosition || "top";
  if (/^(top|bottom)$/.test(barPos)) {
    layoutMode = "H";
  } else if (/^(left|right)$/.test(barPos)) {
    layoutMode = "V";
  }

  // 返回动作条配置
  return {
    barPad: "none",
    itemSize: "s",
    layoutMode,
    ...props.actionBar,
  };
}
