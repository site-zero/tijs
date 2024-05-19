import { App } from 'vue';
import { TiComInfo, TiComRace } from '../../../core/_top/_types';
import { COM_TYPES } from '../../lib-com-types';
import TiInputGroup from './TiInputGroup.vue';
import example from './example';

const en_us = {
  'com-name': 'Input Group',
};
const zh_cn = {
  'com-name': '输入控件组',
};

const COM_TYPE = COM_TYPES.InputGroup;

const TiInputGroupInfo: TiComInfo = {
  tags: ['scaffold'],
  icon: 'zmdi-group',
  race: TiComRace.INPUT,
  name: COM_TYPE,
  text: 'i18n:ti-input-group-com-name',
  i18n: {
    en_us: en_us,
    en_uk: en_us,
    zh_cn: zh_cn,
    zh_hk: zh_cn,
  },
  com: TiInputGroup,
  install: (app: App) => {
    app.component(COM_TYPE, TiInputGroup);
  },
  defaultProps: 'simple',
  exampleProps: [example.simple],
};

export * from './ti-input-group-types';
export { TiInputGroup, TiInputGroupInfo };

