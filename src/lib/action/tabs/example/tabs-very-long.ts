import { TabsProps } from '../ti-tabs-types';

export default {
  name: 'very-long',
  text: 'i18n:ti-tabs-example-very-long',
  comConf: {
    tabItemSpace: 'm',
    tabsAlign: 'left',
    tabsAt: 'top',
    value: 1,
    tabMaxWidth: '200px',
    options: [
      {
        icon: 'zmdi-cast-connected',
        text: 'This is Very Very Long Tabs',
      },
      {
        icon: 'zmdi-favorite',
        text: '它的确有很多很多的标签文字，有时候你不得不换行显示',
      },
      {
        text: "Sometimes, I don't know why anyone would design a label layout like this",
      },
      {
        icon: 'zmdi-ticket-star',
        text: '但是作为一名有荣誉感的控件库作者，',
      },
      {
        icon: 'fas-heart',
        text: 'My pride demands that I come up with the perfect solution',
      },
    ],
  } as TabsProps,
};
