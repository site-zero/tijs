import { App } from 'vue';
import { TiComInfo, TiComRace } from '../../../_type';
import { COM_TYPES } from '../../lib-com-types';
import TiInputIcon from './TiInputIcon.vue';
import example from './example';

const en_us = {
  'com-name': 'Input Icon',
};
const zh_cn = {
  'com-name': '选择图标',
};

const COM_TYPE = COM_TYPES.InputIcon;

const TiInputIconInfo: TiComInfo = {
  tags: ['scaffold'],
  icon: 'fas-icons',
  race: TiComRace.INPUT,
  name: COM_TYPE,
  text: 'i18n:ti-input-icon-com-name',
  i18n: {
    en_us: en_us,
    en_uk: en_us,
    zh_cn: zh_cn,
    zh_hk: zh_cn,
  },
  com: TiInputIcon,
  install: (app: App) => {
    app.component(COM_TYPE, TiInputIcon);
  },
  defaultProps: 'simple',
  exampleProps: [example.simple],
};

export * from './ti-input-icon-types';
export { TiInputIcon, TiInputIconInfo };
