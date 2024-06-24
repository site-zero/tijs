import { App } from 'vue';
import { TiComInfo, TiComRace } from '../../../_type';
import { COM_TYPES } from '../../lib-com-types';
import TiEditCode from './TiEditCode.vue';
import example from './example';

const en_us = {
  'com-name': 'Edit Code',
};
const zh_cn = {
  'com-name': '代码编辑',
};

const COM_TYPE = COM_TYPES.EditCode;

const TiEditCodeInfo: TiComInfo = {
  tags: ['scaffold'],
  icon: 'fas-code',
  race: TiComRace.EIDT,
  name: COM_TYPE,
  text: 'i18n:ti-edit-code-com-name',
  i18n: {
    en_us: en_us,
    en_uk: en_us,
    zh_cn: zh_cn,
    zh_hk: zh_cn,
  },
  com: TiEditCode,
  install: (app: App) => {
    app.component(COM_TYPE, TiEditCode);
  },
  defaultProps: 'simple',
  exampleProps: [example.simple],
};

export * from './ti-edit-code-types';
export { TiEditCode, TiEditCodeInfo };
