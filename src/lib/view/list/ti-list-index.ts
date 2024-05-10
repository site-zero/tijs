import { App } from 'vue';
import { COM_TYPES } from '../../';
import { TiComInfo, TiComRace } from '../../../core';
import TiList from './TiList.vue';
import example from './example';

const en_us = {
  'com-name': 'List',
};
const zh_cn = {
  'com-name': '列表',
  'example-with-icon': '带图标列表',
  'example-with-tip': '带备注列表',
};

const COM_TYPE = COM_TYPES.List;

const TiListInfo: TiComInfo = {
  //icon: 'fas-list',
  icon: '🚜',
  race: TiComRace.VIEW,
  name: COM_TYPE,
  text: 'i18n:ti-list-com-name',
  i18n: {
    en_us: en_us,
    en_uk: en_us,
    zh_cn: zh_cn,
    zh_hk: zh_cn,
  },
  com: TiList,
  install: (app: App) => {
    app.component(COM_TYPE, TiList);
  },
  defaultProps: 'jumper',
  exampleProps: [example.simple, example.withIcon, example.withTip],
};

export * from './ti-list-types';
export { TiList, TiListInfo };
