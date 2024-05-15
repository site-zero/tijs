import { App } from 'vue';
import { TiComInfo, TiComRace } from '../../../core';
import { COM_TYPES } from '../../lib-com-types';
import TiDroplist from './TiDroplist.vue';
import example from './example';

const en_us = {
  'com-name': 'Drop List',
};
const zh_cn = {
  'com-name': '下拉列表',
  'example-with-icon': '选项带图标',
  'example-with-tip': '选项带备注',
  'example-multi-with-icon': '多选带图标',
  'example-multi-with-tip': '多选带备注',
};

const COM_TYPE = COM_TYPES.Droplist;

const TiDroplistInfo: TiComInfo = {
  icon: 'fas-square-caret-down',
  tags: ['scaffold'],
  race: TiComRace.INPUT,
  name: COM_TYPE,
  text: 'i18n:ti-droplist-com-name',
  i18n: {
    en_us: en_us,
    en_uk: en_us,
    zh_cn: zh_cn,
    zh_hk: zh_cn,
  },
  com: TiDroplist,
  install: (app: App) => {
    app.component(COM_TYPE, TiDroplist);
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

export * from './ti-droplist-types';
export { TiDroplist, TiDroplistInfo };
