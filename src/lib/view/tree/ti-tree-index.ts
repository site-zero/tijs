import { App } from 'vue';
import { TiComInfo, TiComRace } from '../../../_type';
import { COM_TYPES } from '../../lib-com-types';
import TiTree from './TiTree.vue';
import example from './example';

const en_us = {
  'com-name': 'Tree',
};
const zh_cn = {
  'com-name': '树',
  'example-with-icon': '带图标树',
  'example-with-tip': '带备注树',
  'example-multi-with-icon': '多选带图标',
  'example-multi-with-tip': '多选带备注',
};

const COM_TYPE = COM_TYPES.Tree;

const TiTreeInfo: TiComInfo = {
  icon: 'fas-sitemap',
  race: TiComRace.VIEW,
  name: COM_TYPE,
  text: 'i18n:ti-tree-com-name',
  i18n: {
    en_us: en_us,
    en_uk: en_us,
    zh_cn: zh_cn,
    zh_hk: zh_cn,
  },
  com: TiTree,
  install: (app: App) => {
    app.component(COM_TYPE, TiTree);
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

export * from './ti-tree-types';
export { TiTree, TiTreeInfo };

