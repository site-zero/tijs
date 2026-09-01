import {
  ActionBarItem,
  ActionBarItemRefer,
  ActionBarLayoutMode,
  ActionBarProps,
  TiAppBus,
  Vars,
} from "@site0/tijs";
import _ from "lodash";
import { InputTextApi, InputTextProps } from "../ti-input-text-types";

export function gen_text_action_bar_config(
  props: InputTextProps,
  api: InputTextApi
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

  // 重载所有的动作回调，只用 function 才回调，其他情况先无视
  const wrap_action = (ai: ActionBarItemRefer): ActionBarItemRefer => {
    // 可以介入修改
    if (_.isObject(ai)) {
      let a: ActionBarItem = { ...(ai as ActionBarItem) };

      // 重载 Action
      if (_.isFunction(a.action)) {
        let oriAction = a.action;
        a.action = function (value: any, vars: Vars, bus?: TiAppBus) {
          // 为上下文添加 text 的 api
          let newVars = { ...vars, textApi: api };
          return oriAction(value, newVars, bus);
        };
      }

      // 递归处理子项目
      if (a.items && a.items.length > 0) {
        let subItems = [] as ActionBarItemRefer[];
        for (let sub of a.items) {
          subItems.push(wrap_action(sub));
        }
        a.items = subItems;
      }
      return a;
    }
    // 其他原样返回
    else {
      return ai;
    }
  };

  // 重载所有的动作条项目
  let items: ActionBarItemRefer[] = [];
  if (props.actionBar.items) {
    for (let item of props.actionBar.items) {
      let it2 = wrap_action(item);
      items.push(it2);
    }
  }

  // 返回动作条配置
  return {
    barPad: "none",
    itemSize: "s",
    layoutMode,
    ...props.actionBar,
    items,
  };
}
