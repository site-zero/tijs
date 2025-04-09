import { App } from 'vue';
import { TiComInfo, TiComRace } from '../../../_type';
import { COM_TYPES } from '../../lib-com-types';
import TiProgressBar from './TiProgressBar.vue';
import { ProgressBarProps } from './ti-progress-bar-types';

const en_us = {
  'com-name': 'Progress Bar',
  'example-horizontal': 'Horizontal',
  'example-vertical': 'Vertical',
  'example-colorized': 'Colorized',
};
const zh_cn = {
  'com-name': '进度条',
  'example-horizontal': '水平',
  'example-vertical': '垂直',
  'example-colorized': '彩色的',
};

const COM_TYPE = COM_TYPES.ProgressBar;

const TiProgressBarInfo: TiComInfo = {
  icon: 'fas-bars-progress',
  race: TiComRace.TILE,
  name: COM_TYPE,
  text: 'i18n:ti-progress-bar-com-name',
  i18n: {
    en_us: en_us,
    en_uk: en_us,
    zh_cn: zh_cn,
    zh_hk: zh_cn,
  },
  liveStyle: {
    width: '100%',
    height: '100%',
    maxWidth: '200px',
    maxHeight: '200px',
    margin: 'auto auto',
  },
  com: TiProgressBar,
  install: (app: App) => {
    app.component(COM_TYPE, TiProgressBar);
  },
  defaultProps: 'horizontal',
  exampleProps: [
    {
      name: 'horizontal',
      text: 'i18n:ti-progress-bar-example-horizontal',
      comConf: {
        value: 0.4,
      } as ProgressBarProps,
    },
    {
      name: 'vertical',
      text: 'i18n:ti-progress-bar-example-vertical',
      comConf: {
        mode: 'V',
        value: 0.8,
        tipAt: 'bottom',
      } as ProgressBarProps,
    },
    {
      name: 'colorized',
      text: 'i18n:ti-progress-bar-example-colorized',
      comConf: {
        value: 0.334,
        type: 'danger',
      } as ProgressBarProps,
    },
  ],
};

export * from './ti-progress-bar-types';
export { TiProgressBar, TiProgressBarInfo };
