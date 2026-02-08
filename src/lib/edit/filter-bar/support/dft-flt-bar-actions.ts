import { ActionBarItem } from "../../../../";

export function dft_flt_bar_action_items(): Record<string, ActionBarItem> {
  return {
    search: {
      text: "i18n:search",
      icon: "zmdi-search",
      altDisplay: {
        test: { loading: true },
        icon: "zmdi-refresh zmdi-hc-spin",
        text: "i18n:loading",
      },
      action: "do:search",
    },
    edit: {
      icon: "zmdi-settings-square",
      action: "do:edit",
    },
    edit_reset: {
      icon: "zmdi-settings-square",
      action: "do:edit",
      items: [
        {
          text: "i18n:reset",
          icon: "zmdi-time-restore-setting",
          action: "do:reset",
        },
      ],
    },
    reset: {
      text: "i18n:reset",
      icon: "zmdi-time-restore-setting",
      action: "do:reset",
    },
  };
}
