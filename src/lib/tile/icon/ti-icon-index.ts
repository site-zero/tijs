import { App } from 'vue';
import { TiComInfo, TiComRace } from '../../_top/lib.types.ts';
import TiIcon from './TiIcon.vue';
import en_us from './i18n/en-us.json';
import zh_cn from './i18n/zh-cn.json';
//const TiIcon = defineAsyncComponent(() => import("./TiIcon.vue"));

const TiIconInfo: TiComInfo = {
  icon: 'fas-fan',
  race: TiComRace.TILE,
  name: 'TiIcon',
  text: 'i18n:ti-icon-com-name',
  i18n: {
    en_us,
    en_uk: en_us,
    zh_cn,
    zh_hk: zh_cn,
  },
  com: TiIcon,
  install: (app: App) => {
    app.component('TiIcon', TiIcon);
  },
  defaultProps: 'simple-icon',
  exampleProps: [
    {
      name: 'simple-icon',
      text: 'i18n:ti-icon-example-simple-icon',
      comConf: {
        value: 'zmdi-slideshare',
      },
    },
    {
      name: 'color-icon',
      text: 'i18n:ti-icon-example-color-icon',
      comConf: {
        className: 's128',
        value: 'fas-snowflake',
        color: '#F00',
        opacity: 0.8,
      },
    },
    {
      name: 'image-icon',
      text: 'i18n:ti-icon-example-image-icon',
      comConf: {
        className: 's128',
        value: '/ti-logo.png',
      },
    },
    {
      name: 'svg-icon',
      text: 'i18n:ti-icon-example-svg-icon',
      comConf: {
        className: 's256',
        value: '/dna.svg',
      },
    },
  ],
};

export { TiIcon, TiIconInfo };
