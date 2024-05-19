import { App } from 'vue';
import { TiComInfo, TiComRace } from '../../../core/_top/_types';
import { COM_TYPES } from '../../lib-com-types';
import TiTags from './TiTags.vue';
import example from './example';

const en_us = {
  'com-name': 'Tags',
};
const zh_cn = {
  'com-name': '标签组',
  'example-with-icon': '带图标',
  'example-can-edit': '可编辑',
};

const COM_TYPE = COM_TYPES.Tags;

const TiTagsInfo: TiComInfo = {
  icon: 'zmdi-labels',
  tags: ['scaffold'],
  race: TiComRace.TILE,
  name: COM_TYPE,
  text: 'i18n:ti-tags-com-name',
  i18n: {
    en_us: en_us,
    en_uk: en_us,
    zh_cn: zh_cn,
    zh_hk: zh_cn,
  },
  com: TiTags,
  install: (app: App) => {
    app.component(COM_TYPE, TiTags);
  },
  defaultProps: 'simple',
  exampleProps: [example.simple, example.withIcon, example.canEdit],
};

export * from './ti-tags-types';
export { TiTags, TiTagsInfo };
