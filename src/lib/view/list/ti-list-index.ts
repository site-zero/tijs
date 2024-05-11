import { App } from 'vue';
import { TiComInfo, TiComRace } from '../../../core';
import { COM_TYPES } from '../../lib-com-types';
import TiList from './TiList.vue';
import example from './example';

const en_us = {
  'com-name': 'List',
};
const zh_cn = {
  'com-name': '列表',
  'example-with-icon': '带图标列表',
  'example-with-tip': '带备注列表',
  'example-multi-with-icon': '多选带图标',
  'example-multi-with-tip': '多选带备注',
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
  defaultProps: 'simple',
  exampleProps: [
    example.simple,
    example.withIcon,
    example.withTip,
    example.multiWithIcon,
    example.multiWithTip,
  ],
};

export * from './ti-list-types';
export { TiList, TiListInfo };
