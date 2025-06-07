import { App } from 'vue';
import { TiComInfo, TiComRace } from '../../../_type';
import { COM_TYPES } from '../../lib-com-types';
import TiWall from './TiWall.vue';
import example from './example';

const en_us = {
  'com-name': 'Wall',
  'example-selectable': 'Selectable',
};
const zh_cn = {
  'com-name': '墙贴',
  'example-selectable': '可选择',
};

const COM_TYPE = COM_TYPES.Wall;

const TiWallInfo: TiComInfo = {
  icon: 'zmdi-view-module',
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
  exampleProps: [example.simple, example.selectable],
  exampleModel: {
    select: [
      {
        key: 'currentId',
        val: '=currentId',
      },
      {
        key: 'checkedIds',
        val: '=checkedIds',
      },
    ],
  },
};

export * from './ti-wall-types';
export { TiWall, TiWallInfo };
