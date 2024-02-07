export default {
  name: 'simple',
  text: 'i18n:simple',
  comConf: {
    items: [
      {
        name: 'saving',
        type: 'action',
        icon: 'zmdi-floppy',
        text: 'i18n:save-change',
        altDisplay: {
          icon: 'fas-spinner fa-pulse',
          text: 'i18n:saving',
        },
        enabled: 'changed',
        action: 'dispatch:main/saveContent',
        shortcut: 'CTRL+S',
      },
      {},
      {
        type: 'group',
        icon: 'fas-bars',
        items: [
          {
            name: 'reloading',
            type: 'action',
            icon: 'zmdi-refresh',
            text: 'i18n:refresh',
            altDisplay: {
              icon: 'zmdi-refresh zmdi-hc-spin',
              text: 'i18n:loading',
            },
            action: 'dispatch:main/reloadData',
            shortcut: 'CTRL+SHIFT+R',
          },
          {},
          {
            type: 'group',
            text: 'More 1111',
            items: [
              {
                text: 'Action A',
              },
              {
                text: 'Action B',
              },
            ],
          },
          {},
          {
            type: 'group',
            text: 'More 222',
            items: [
              {
                text: 'Action C',
              },
              {
                text: 'Action D',
              },
            ],
          },
          {},
          {
            type: 'action',
            icon: 'zmdi-keyboard',
            text: 'i18n:view-resource',
            action: 'dispatch:main/openContentEditor',
            shortcut: 'ALT+SHIFT+V',
          },
          {},
          {
            type: 'action',
            icon: 'zmdi-keyboard',
            text: 'i18n:console',
            action: "=>Ti.Be.Open('/a/open/wn.console')",
            shortcut: 'ALT+SHIFT+T',
            visible: {
              ENABLE_CONSOLE: 'yes',
            },
          },
          {
            type: 'action',
            icon: 'zmdi-info-outline',
            text: 'i18n:properties',
            action: 'dispatch:main/openCurrentMetaEditor',
            shortcut: 'ALT+SHIFT+P',
          },
        ],
      },
    ],
  },
};
