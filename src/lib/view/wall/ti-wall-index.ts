import { App } from 'vue';
import { TiComInfo, TiComRace } from '../../../core/_top/_types';
import { COM_TYPES } from '../../lib-com-types';
import TiWall from './TiWall.vue';
import example from './example';

const en_us = {
  'com-name': 'Wall',
};
const zh_cn = {
  'com-name': '墙贴',
};

const COM_TYPE = COM_TYPES.Wall;

const TiWallInfo: TiComInfo = {
  tags: ['scaffold'],
  icon: 'zmdi-view-module',
  //icon: '🚜',
  race: TiComRace.VIEW,
  name: COM_TYPE,
  text: 'i18n:ti-wall-com-name',
  i18n: {
    en_us: en_us,
    en_uk: en_us,
    zh_cn: zh_cn,
    zh_hk: zh_cn,
  },
  com: TiWall,
  install: (app: App) => {
    app.component(COM_TYPE, TiWall);
  },
  defaultProps: 'simple',
  exampleProps: [example.simple],
};

export * from './ti-wall-types';
export { TiWall, TiWallInfo };
