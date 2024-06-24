import { App } from 'vue';
import { TiComInfo, TiComRace } from '../../../_type';
import { COM_TYPES } from '../../lib-com-types';
import TiUnknown from './TiUnknown.vue';
import example from './example';

const en_us = {
  'com-name': 'Unknown',
};
const zh_cn = {
  'com-name': '未知',
};

const COM_TYPE = COM_TYPES.Unknown;

const TiUnknownInfo: TiComInfo = {
  icon: 'zmdi-help-outline',
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
  defaultProps: 'simple',
  exampleProps: [example.simple],
};

export * from './ti-unknown-types';
export { TiUnknown, TiUnknownInfo };
