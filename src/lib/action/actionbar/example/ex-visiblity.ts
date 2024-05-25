export default {
  name: 'visibility',
  text: 'i18n:ti-action-bar-example-visibility',
  comConf: {
    vars: {
      saving: true,
    },
    items: [
      {
        name: 'saving',
        type: 'action',
        icon: 'zmdi-floppy',
        text: 'i18n:save-change',
        altDisplay: [
          {
            test: {
              saving: true,
            },
            icon: 'fas-spinner fa-pulse',
            text: 'i18n:saving',
          },
        ],
        enabled: 'changed',
        action: 'dispatch:main/saveContent',
        shortcut: 'CTRL+S',
      },
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
};
