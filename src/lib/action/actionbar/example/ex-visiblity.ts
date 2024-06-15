import { ActionBarProps } from '../ti-action-bar-types';

export default {
  name: 'visibility',
  text: 'i18n:ti-action-bar-example-visibility',
  comConf: {
    vars: {
      saving: false,
      ENABLE_CONSOLE: 'no',
      changed: false,
    },
    items: [
      {
        name: 'saving',
        type: 'action',
        icon: 'zmdi-floppy',
        text: 'i18n:save-change',
        altDisplay: [
          {
            test: { saving: true },
            icon: 'fas-spinner fa-pulse',
            text: 'i18n:saving',
          },
        ],
        enabled: {
          changed: true,
        },
        action: 'save',
        shortcut: 'CTRL+S',
      },
      {
        name: 'reloading',
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
        visible: {
          ENABLE_CONSOLE: 'yes',
        },
      },
      {
        type: 'action',
        icon: 'zmdi-info-outline',
        text: 'i18n:properties',
        action: 'bus:> open-properties',
        shortcut: 'ALT+SHIFT+P',
      },
    ],
  } as ActionBarProps,
};
