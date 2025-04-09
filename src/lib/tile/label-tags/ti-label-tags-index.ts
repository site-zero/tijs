import { App } from 'vue';
import { TiComInfo, TiComRace } from '../../../_type';
import { COM_TYPES } from '../../lib-com-types';
import TiLabelTags from './TiLabelTags.vue';
import { LabelTagsProps } from './ti-label-tags-types';

const en_us = {
  'com-name': 'LabelTags',
  'example-with-options': 'With Option',
};
const zh_cn = {
  'com-name': '选项标签',
  'example-with-options': '带选项标签组',
};

const COM_TYPE = COM_TYPES.LabelTags;

const TiLabelTagsInfo: TiComInfo = {
  icon: 'zmdi-labels',
  race: TiComRace.TILE,
  name: COM_TYPE,
  text: 'i18n:ti-label-tags-com-name',
  i18n: {
    en_us: en_us,
    en_uk: en_us,
    zh_cn: zh_cn,
    zh_hk: zh_cn,
  },
  com: TiLabelTags,
  install: (app: App) => {
    app.component(COM_TYPE, TiLabelTags);
  },
  defaultProps: 'simple',
  exampleProps: [
    {
      name: 'simple',
      text: 'i18n:simple',
      comConf: {
        value:"A,B,C"
      } as LabelTagsProps,
    },
    {
      name: 'with-options',
      text: 'i18n:ti-label-tags-example-with-options',
      comConf: {
        value:"A,B,C",
        options: [
          { text: 'Option A', value: 'A' },
          { text: 'Option B', value: 'B' },
          { text: 'Option C', value: 'C' },
        ]
      } as LabelTagsProps,
    },
  ],
};

export * from './ti-label-tags-types';
export { TiLabelTags, TiLabelTagsInfo };
