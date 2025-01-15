import { ActionBarProps } from '../ti-action-bar-types';

export default {
  name: 'mode_v',
  text: 'i18n:ti-action-bar-example-mode-v',
  comConf: {
    vars: {
      saving: false,
    },
    layoutMode: 'V',
    topItemAspectMode: 'button',
    items: [
      {
        icon: 'zmdi-search',
        text: 'i18n:search',
        action: 'search',
      },
      {},
      {
        icon: 'zmdi-time-restore',
        text: 'i18n:reset',
        action: 'reset',
      },
      {},
      {
        icon: 'zmdi-shape',
        text: 'Advance',
        action: 'advance',
      },
      {
        type: 'group',
        icon: 'zmdi-settings',
        text: 'More',
        items: [
          {
            icon: 'zmdi-share',
            text: 'Share',
            action: 'share',
          },
          {},
          {
            icon: 'zmdi-cloud-box',
            text: 'Load Setup',
            action: 'load_setup',
          },
          {},
          {
            icon: 'zmdi-sort-asc',
            text: 'Setup Sorter',
            action: 'setup_sorter',
          },
        ],
      },
    ],
  } as ActionBarProps,
};
