import { TabsProps } from '../../..';

export default {
  name: 'at-bottom',
  text: 'i18n:ti-tabs-example-at-bottom',
  comConf: {
    tabItemSpace: 'b',
    tabsAlign: 'center',
    tabsAt: 'bottom',
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
