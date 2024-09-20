import { App } from 'vue';
import { TiComInfo, TiComRace } from '../../../_type';
import { COM_TYPES } from '../../lib-com-types';
import TiThumb from './TiThumb.vue';
import example from './example';

const en_us = {
  'com-name': 'Thumbnail',
};
const zh_cn = {
  'com-name': '缩略图',
};

const COM_TYPE = COM_TYPES.Thumb;

const TiThumbInfo: TiComInfo = {
  icon: 'zmdi-pin-assistant',
  tags: ['ing'],
  race: TiComRace.TILE,
  name: COM_TYPE,
  text: 'i18n:ti-thumb-com-name',
  i18n: {
    en_us: en_us,
    en_uk: en_us,
    zh_cn: zh_cn,
    zh_hk: zh_cn,
  },
  com: TiThumb,
  install: (app: App) => {
    app.component(COM_TYPE, TiThumb);
  },
  defaultProps: 'simple',
  exampleProps: [example.simple],
};

export * from './ti-thumb-types';
export { TiThumb, TiThumbInfo };
