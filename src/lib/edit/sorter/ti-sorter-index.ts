import { App } from 'vue';
import { TiComInfo, TiComRace } from '../../../_type';
import { COM_TYPES } from '../../lib-com-types';
import TiSorter from './TiSorter.vue';
import example from './example';

const en_us = {
  'com-name': 'Sorter',
  'empty': 'No sort condition',
  'choose': 'Choose Sorter Fields',
};
const zh_cn = {
  'com-name': '排序器',
  'empty': '无排序条件',
  'choose': '选择排序字段',
};

const COM_TYPE = COM_TYPES.Sorter;

const TiSorterInfo: TiComInfo = {
  icon: 'zmdi-sort-asc',
  race: TiComRace.EDIT,
  name: COM_TYPE,
  text: 'i18n:ti-sorter-com-name',
  i18n: {
    en_us: en_us,
    en_uk: en_us,
    zh_cn: zh_cn,
    zh_hk: zh_cn,
  },
  com: TiSorter,
  install: (app: App) => {
    app.component(COM_TYPE, TiSorter);
  },
  defaultProps: 'simple',
  exampleProps: [example.simple],
};

export * from './ti-sorter-types';
export { TiSorter, TiSorterInfo };

