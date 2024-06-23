import { App } from 'vue';
import { TiComInfo, TiComRace } from '../../../core/_top/_types';
import { COM_TYPES } from '../../lib-com-types';
import TiCheck from './TiCheck.vue';

const en_us = {
  'com-name': 'CheckBox',
  'example-customized-values': 'Customized Values',
  'example-cus-number': 'Customized Number',
  'example-cus-any': 'Customized Any',
};
const zh_cn = {
  'com-name': '勾选框',
  'example-customized-values': '指定值',
  'example-cus-number': '指定数字',
  'example-cus-any': '指定任意值',
};

const COM_TYPE = COM_TYPES.Check;

const TiCheckInfo: TiComInfo = {
  icon: 'zmdi-check-square',
  race: TiComRace.INPUT,
  name: COM_TYPE,
  text: 'i18n:ti-check-com-name',
  i18n: {
    en_us: en_us,
    en_uk: en_us,
    zh_cn: zh_cn,
    zh_hk: zh_cn,
  },
  com: TiCheck,
  install: (app: App) => {
    app.component(COM_TYPE, TiCheck);
  },
  defaultProps: 'simple',
  exampleProps: [
    {
      name: 'simple',
      text: 'i18n:simple',
      comConf: {
        value: true,
        text: 'hello',
      },
    },
    {
      name: 'customized-values',
      text: 'i18n:ti-check-example-customized-values',
      comConf: {
        value: 'No',
        text: 'I like coding',
        values: ['No', 'Yes'],
      },
    },
    {
      name: 'cus_number',
      text: 'i18n:ti-check-example-cus-number',
      comConf: {
        value: 1,
        text: 'Actived',
        values: [1, 0],
      },
    },
    {
      name: 'cus_any',
      text: 'i18n:ti-check-example-cus-any',
      comConf: {
        value: { color: 'red' },
        text: 'Actived',
        values: [{ color: 'red' }, { color: 'blue' }],
      },
    },
  ],
};

export { TiCheck, TiCheckInfo };
