import { TabsLayoutProps } from '../ti-layout-tabs-types';

export default {
  name: 'at-bottom',
  text: 'i18n:ti-layout-tabs-example-at-bottom',
  comConf: {
    className: 'fit-parent',
    keepTab: 'Ti-Demo-TiLayoutTabs-At-Bottom',
    tabsAt: 'bottom',
    tabsAlign: 'right',
    wrapTabs: false,
    tabItemSpace: 'b',
    blocks: [
      {
        icon: 'zmdi-info',
        name: 'info',
        title: 'Information',
      },
      {
        icon: 'zmdi-navigation',
        name: 'detail',
        title: 'Detail Settings',
      },
      {
        icon: 'zmdi-car-taxi',
        name: 'more',
        title: 'More Information',
      },
    ],
    schema: {
      info: {
        comType: 'TiRoadblock',
        comConf: {
          className: 'is-text-r',
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
          className: 'is-info-r',
          size: 'large',
          text: '更多信息',
          icon: 'zmdi-navigation',
        },
      },
    },
  } as TabsLayoutProps,
};
