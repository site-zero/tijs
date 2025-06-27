import { ActionBarProps } from "../ti-action-bar-types";

export default {
  name: "simple",
  text: "i18n:simple",
  comConf: {
    vars: {
      saving: false,
    },
    topItemAspectMode: "normal",
    items: [
      {
        icon: "zmdi-floppy",
        text: "i18n:save-change",
        altDisplay: {
          test: { saving: true },
          icon: "fas-spinner fa-pulse",
          text: "i18n:saving",
        },
        enabled: { changed: true },
        action: "save",
        shortcut: "CTRL+S",
      },
      {},
      {
        icon: "fas-clock-rotate-left",
        text: "i18n:restore",
        action: "close",
      },
      {},
      {
        text: "i18n:cancel",
        action: "cancel",
      },
      {},
      {
        type: "group",
        icon: "fas-bars",
        items: [
          {
            type: "action",
            icon: "zmdi-refresh",
            text: "i18n:refresh",
            altDisplay: {
              test: { reloading: true },
              icon: "zmdi-refresh zmdi-hc-spin",
              text: "i18n:loading",
            },
            action: "reload",
            shortcut: "CTRL+SHIFT+R",
          },
          {},
          {
            type: "group",
            text: "More 1111",
            items: [
              {
                text: "Action A",
                action: {
                  bus: true,
                  name: "do:action",
                  payload: "A",
                },
              },
              {
                text: "Action B",
                action: {
                  name: "do:action",
                  payload: "B",
                },
              },
            ],
          },
          {},
          {
            type: "group",
            text: "More 222",
            items: [
              {
                text: "Action C",
                action: {
                  bus: true,
                  name: "do:action",
                  payload: "C",
                },
              },
              {
                text: "Action D",
                action: {
                  bus: true,
                  name: "do:action",
                  payload: "D",
                },
              },
            ],
          },
          {},
          {
            type: "action",
            icon: "zmdi-keyboard",
            text: "i18n:view-resource",
            action: {
              bus: true,
              name: "view-code",
            },
            shortcut: "ALT+SHIFT+V",
          },
          {},
          {
            type: "action",
            icon: "zmdi-keyboard",
            text: "i18n:console",
            action: {
              name: "open-console",
            },
            shortcut: "ALT+SHIFT+T",
          },
          {
            type: "action",
            icon: "zmdi-info-outline",
            text: "i18n:properties",
            action: {
              bus: true,
              name: "open-properties",
            },
            shortcut: "ALT+SHIFT+P",
          },
        ],
      },
    ],
  } as ActionBarProps,
};
