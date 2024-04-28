import { LayoutTabsProps } from '../../../../';

export default {
  name: 'at-top',
  text: 'i18n:ti-layout-tabs-example-at-top',
  comConf: {
    className: 'fit-parent',
    keepTab: 'Ti-Demo-TiLayoutTabs-At-Top',
    blocks: [
      {
        name: 'info',
      },
      {
        name: 'detail',
      },
      {
        name: 'more',
      },
    ],
    schema: {
      info: {
        comType: 'TiRoadblock',
        comConf: {
          className: 'is-text',
          text: '信息区',
          icon: 'zmdi-info',
        },
      },
      detail: {
        comType: 'TiRoadblock',
        comConf: {
          className: 'is-warn-r',
          text: '详情区',
          icon: 'zmdi-navigation',
        },
      },
      more: {
        comType: 'TiRoadblock',
        comConf: {
          className: 'is-primary',
          text: '更多信息',
          icon: 'zmdi-navigation',
        },
      },
    },
  } as LayoutTabsProps,
};
