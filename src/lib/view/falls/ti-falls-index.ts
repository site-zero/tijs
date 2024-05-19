import { App } from 'vue';
import { TiComInfo, TiComRace } from '../../../core/_top/_types';
import { COM_TYPES } from '../../lib-com-types';
import TiFalls from './TiFalls.vue';
import example from './example';

const en_us = {
  'com-name': 'Falls',
};
const zh_cn = {
  'com-name': '瀑布贴',
};

const COM_TYPE = COM_TYPES.Falls;

const TiFallsInfo: TiComInfo = {
  icon: 'zmdi-view-dashboard',
  tags: ['scaffold'],
  race: TiComRace.VIEW,
  name: COM_TYPE,
  text: 'i18n:ti-falls-com-name',
  i18n: {
    en_us: en_us,
    en_uk: en_us,
    zh_cn: zh_cn,
    zh_hk: zh_cn,
  },
  com: TiFalls,
  install: (app: App) => {
    app.component(COM_TYPE, TiFalls);
  },
  defaultProps: 'simple',
  exampleProps: [example.simple],
};

export * from './ti-falls-types';
export { TiFalls, TiFallsInfo };
