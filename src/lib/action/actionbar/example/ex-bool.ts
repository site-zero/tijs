import { ActionBarProps } from '../ti-action-bar-types';

export default {
  name: 'bool',
  text: 'i18n:ti-action-bar-example-bool',
  comConf: {
    vars: {
      showDeleted: false,
      showMarkNum: false,
    },
    items: [
      {
        icon: 'zmdi-square-o',
        text: 'Show Deleted',
        altDisplay: {
          test: { showDeleted: true },
          icon: 'zmdi-check-square',
          text: 'Hide Actived',
        },
        action: 'toggle-showDeleted',
      },
      {},
      {
        type: 'group',
        icon: 'fas-bars',
        items: [
          {
            icon: 'zmdi-circle-o',
            text: 'Show Mark Number',
            altDisplay: {
              test: { showMarkNum: true },
              icon: 'zmdi-check-circle',
              text: 'Hide Mark Number',
            },
            action: 'toggle-showMarkNum',
          },
        ],
      },
    ],
  } as ActionBarProps,
};
