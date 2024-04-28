import { TabsProps } from '../../..';

export default {
  name: 'at-top',
  text: 'i18n:ti-tabs-example-at-top',
  comConf: {
    tabItemSpace: 'm',
    tabsAlign: 'left',
    tabsAt: 'top',
    value: 1,
    options: [
      {
        icon: 'zmdi-cast-connected',
        text: 'i18n:ti-tabs-example-t0',
      },
      {
        icon: 'zmdi-favorite',
        text: 'i18n:ti-tabs-example-t1',
      },
      {
        text: 'i18n:ti-tabs-example-t2',
      },
      {
        icon: 'zmdi-ticket-star',
        text: 'i18n:ti-tabs-example-t3',
      },
      {
        icon: '',
        text: 'i18n:ti-tabs-example-t4',
      },
    ],
  } as TabsProps,
};
