import { App } from 'vue';
import { TiComInfo, TiComRace } from '../../../_type';
import { COM_TYPES } from '../../lib-com-types';
import TiTags from './TiTags.vue';
import example from './example';

const en_us = {
  'com-name': 'Tags',
  'example-with-icon': 'With Icon',
  'example-editable': 'Editable',
  'example-data-raw': 'Raw Data',
  'example-data-matcher': 'Filter Data',
};
const zh_cn = {
  'com-name': '标签组',
  'example-with-icon': '带图标',
  'example-editable': '可编辑',
  'example-data-raw': '普通对象',
  'example-data-matcher': '过滤条件',
};

const COM_TYPE = COM_TYPES.Tags;

const TiTagsInfo: TiComInfo = {
  icon: 'fas-tags',
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
  exampleModel: {
    sorted: 'value',
  },
  defaultProps: 'simple',
  exampleProps: [
    example.simple,
    example.withIcon,
    example.editable,
    example.dataRaw,
    example.dataMatcher,
  ],
};

export * from './ti-tags-types';
export { TiTags, TiTagsInfo };
