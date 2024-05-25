export default {
  name: 'simple',
  text: 'i18n:simple',
  comConf: {
    vars: {
      saving: false,
    },
    items: [
      {
        icon: 'zmdi-floppy',
        text: 'i18n:save-change',
        altDisplay: {
          test: { saving: true },
          icon: 'fas-spinner fa-pulse',
          text: 'i18n:saving',
        },
        enabled: { changed: true },
        action: 'save',
        shortcut: 'CTRL+S',
      },
      {},
      {
        type: 'group',
        icon: 'fas-bars',
        items: [
          {
            type: 'action',
            icon: 'zmdi-refresh',
            text: 'i18n:refresh',
            altDisplay: {
              test: { reloading: true },
              icon: 'zmdi-refresh zmdi-hc-spin',
              text: 'i18n:loading',
            },
            action: 'reload',
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
            action: 'bus:> view-code',
            shortcut: 'ALT+SHIFT+V',
          },
          {},
          {
            type: 'action',
            icon: 'zmdi-keyboard',
            text: 'i18n:console',
            action: 'bus:> open-console',
            shortcut: 'ALT+SHIFT+T',
          },
          {
            type: 'action',
            icon: 'zmdi-info-outline',
            text: 'i18n:properties',
            action: 'bus:> open-properties',
            shortcut: 'ALT+SHIFT+P',
          },
        ],
      },
    ],
  },
};
