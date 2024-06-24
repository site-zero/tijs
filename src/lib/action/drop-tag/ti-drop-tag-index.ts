import { App } from 'vue';
import { TiComInfo, TiComRace } from '../../../_type';
import { COM_TYPES } from '../../lib-com-types';
import TiDropTag from './TiDropTag.vue';
import example from './example';

const en_us = {
  'com-name': 'Drop Tag',
};
const zh_cn = {
  'com-name': '下拉标签',
  'example-with-icon': '带图标',
};

const COM_TYPE = COM_TYPES.DropTag;

const TiDropTagInfo: TiComInfo = {
  tags: ['ing'],
  icon: 'fas-tarp-droplet',
  race: TiComRace.ACTION,
  name: COM_TYPE,
  text: 'i18n:ti-drop-tag-com-name',
  i18n: {
    en_us: en_us,
    en_uk: en_us,
    zh_cn: zh_cn,
    zh_hk: zh_cn,
  },
  com: TiDropTag,
  install: (app: App) => {
    app.component(COM_TYPE, TiDropTag);
  },
  defaultProps: 'simple',
  exampleProps: [example.simple, example.withIcon],
};

export * from './ti-drop-tag-types';
export { TiDropTag, TiDropTagInfo };
