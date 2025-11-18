import { ActionBarProps } from "../../action/all-actions";
import { InputMultiLinesProps } from "./ti-input-multi-lines-types";
import { TiInputMultiLinesApi } from "./use-ti-input-multi-lines-api";

export function useMultiLinesAction(
  _props: InputMultiLinesProps,
  _api: TiInputMultiLinesApi
): ActionBarProps {
  return {
    vars: _api.ActionBarVars.value,
    itemSize: "t",
    items: [
      "@add",
      "||",
      "@del",
      "||",
      "@move-to-head",
      "@move-up",
      "@move-down",
      "@move-to-tail",
      "||",
      "@view-code",
    ],
    barItemSet: {
      "||": {},
      "@add": {
        icon: "fas-plus",
        tip: "ADD",
        action: () => {
          _api.addLine();
        },
      },
      "@del": {
        tip: "DELETE",
        icon: "fas-trash-can",
        enabled: { hasChecked: true },
        action: () => {
          _api.removeChecked();
        },
      },
      "@move-up": {
        icon: "zmdi-long-arrow-up",
        tip: "i18n:move-up",
        enabled: {
          hasChecked: true,
        },
        action: () => {
          _api.moveChecked("prev");
        },
      },
      "@move-down": {
        icon: "zmdi-long-arrow-down",
        tip: "i18n:move-down",
        enabled: {
          hasChecked: true,
        },
        action: () => {
          _api.moveChecked("next");
        },
      },
      "@move-to-head": {
        icon: "zmdi-long-arrow-tab zmdi-hc-flip-horizontal",
        tip: "i18n:move-down",
        enabled: {
          hasChecked: true,
        },
        action: () => {
          _api.moveChecked("head");
        },
      },
      "@move-to-tail": {
        icon: "zmdi-long-arrow-tab",
        tip: "i18n:move-down",
        enabled: {
          hasChecked: true,
        },
        action: () => {
          _api.moveChecked("tail");
        },
      },
      "@view-code": {
        icon: "zmdi-code",
        action: () => {
          _api.viewCode();
        },
      },
    },
  };
}
