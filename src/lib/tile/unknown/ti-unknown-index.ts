import { App } from 'vue';
import { COM_TYPES } from '../../lib-com-types';
import { TiComInfo, TiComRace } from '../../../core';
import TiUnknown from './TiUnknown.vue';

const en_us = {
  'com-name': 'Unknown',
};
const zh_cn = {
  'com-name': '未知',
};

const COM_TYPE = COM_TYPES.Unknown;

const TiUnkownInfo: TiComInfo = {
  icon: 'fas-circle-question',
  race: TiComRace.TILE,
  name: COM_TYPE,
  text: 'i18n:ti-unknown-com-name',
  i18n: {
    en_us: en_us,
    en_uk: en_us,
    zh_cn: zh_cn,
    zh_hk: zh_cn,
  },
  com: TiUnknown,
  install: (app: App) => {
    app.component(COM_TYPE, TiUnknown);
  },
  defaultProps: 'general',
  exampleProps: [
    {
      name: 'general',
      comConf: {},
    },
  ],
};

export { TiUnknown, TiUnkownInfo };
