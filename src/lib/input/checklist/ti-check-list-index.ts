import { App } from 'vue';
import { TiComInfo, TiComRace } from '../../../_type';
import { COM_TYPES } from '../../lib-com-types';
import TiCheckList from './TiCheckList.vue';
import example from './example';

const en_us = {
  'com-name': 'Check List',
  'example-with-icon': 'With Icon',
  'example-with-tip': 'With Tip',
};
const zh_cn = {
  'com-name': '多选列表',
  'example-with-icon': '带图标列表',
  'example-with-tip': '带备注列表',
};

const COM_TYPE = COM_TYPES.CheckList;

const TiCheckListInfo: TiComInfo = {
  icon: 'fas-list-check',
  race: TiComRace.INPUT,
  name: COM_TYPE,
  text: 'i18n:ti-check-list-com-name',
  i18n: {
    en_us: en_us,
    en_uk: en_us,
    zh_cn: zh_cn,
    zh_hk: zh_cn,
  },
  com: TiCheckList,
  install: (app: App) => {
    app.component(COM_TYPE, TiCheckList);
  },
  defaultProps: 'simple',
  exampleProps: [example.simple, example.with_icon, example.with_tip],
};

export * from './ti-check-list-types';
export { TiCheckList, TiCheckListInfo };
