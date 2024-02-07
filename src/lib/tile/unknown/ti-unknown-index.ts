import { App } from 'vue';
import { TiComInfo, TiComRace } from '../../_top/lib.types';
import TiUnknown from './TiUnknown.vue';

const en_us = {
  'com-name': 'Unknown',
};
const zh_cn = {
  'com-name': '未知',
};

const TiUnkownInfo: TiComInfo = {
  icon: 'fas-circle-question',
  race: TiComRace.TILE,
  name: 'TiUnknown',
  text: 'i18n:ti-unknown-com-name',
  i18n: {
    en_us: en_us,
    en_uk: en_us,
    zh_cn: zh_cn,
    zh_hk: zh_cn,
  },
  com: TiUnknown,
  install: (app: App) => {
    app.component('TiUnknown', TiUnknown);
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
