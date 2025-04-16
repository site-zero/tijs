import { App } from 'vue';
import { TiComInfo, TiComRace } from '../../../_type';
import { COM_TYPES } from '../../lib-com-types';
import TiTreeTable from './TiTreeTable.vue';
import example from './example';

const en_us = {
  'com-name': 'Tree Table',
};
const zh_cn = {
  'com-name': '树状表格',
  'example-with-icon': '带图标列表',
  'example-with-tip': '带备注列表',
  'example-multi-with-icon': '多选带图标',
  'example-multi-with-tip': '多选带备注',
};

const COM_TYPE = COM_TYPES.TreeTable;

const TiTreeTableInfo: TiComInfo = {
  tags: ['ing'],
  icon: 'fas-table-list',
  race: TiComRace.VIEW,
  name: COM_TYPE,
  text: 'i18n:ti-tree-table-com-name',
  i18n: {
    en_us: en_us,
    en_uk: en_us,
    zh_cn: zh_cn,
    zh_hk: zh_cn,
  },
  com: TiTreeTable,
  install: (app: App) => {
    app.component(COM_TYPE, TiTreeTable);
  },
  defaultProps: 'simple',
  exampleProps: [
    example.simple,
    example.withIcon,
    example.withTip,
    example.multiWithIcon,
    example.multiWithTip,
  ],
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

export * from './ti-tree-table-types';
export { TiTreeTable, TiTreeTableInfo };

