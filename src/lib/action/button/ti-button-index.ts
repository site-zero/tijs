import { App } from 'vue';
import { COM_TYPES } from '../../lib-com-types';
import { TiComInfo, TiComRace } from '../../../core';
import TiButton from './TiButton.vue';

const en_us = {
  'com-name': 'button',
};
const zh_cn = {
  'com-name': '按钮',
};

const COM_TYPE = COM_TYPES.Button;

const TiButtonInfo: TiComInfo = {
  icon: 'fas-hand-pointer',
  race: TiComRace.ACTION,
  name: COM_TYPE,
  text: 'i18n:ti-button-com-name',
  i18n: {
    en_us: en_us,
    en_uk: en_us,
    zh_cn: zh_cn,
    zh_hk: zh_cn,
  },
  com: TiButton,
  install: (app: App) => {
    app.component(COM_TYPE, TiButton);
  },
  defaultProps: 'simple-button',
  exampleProps: [
    {
      name: 'simple-button',
      comConf: {},
    },
  ],
};

export { TiButton, TiButtonInfo };
