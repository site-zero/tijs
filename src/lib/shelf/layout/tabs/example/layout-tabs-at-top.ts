import { FormProps } from '../../../../';
import { TabsLayoutProps } from '../ti-layout-tabs-types';

export default {
  name: 'at-top',
  text: 'i18n:ti-layout-tabs-example-at-top',
  comConf: {
    className: 'fit-parent',
    keepTab: 'Ti-Demo-TiLayoutTabs-At-Top',
    tabsAt: 'top',
    tabsAlign: 'center',
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
        comType: 'TiForm',
        comConf: {
          fields: [{ title: 'Name', name: 'name', comType: 'TiInput' }],
        } as FormProps,
        events: {
          change: 'detail-change',
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
