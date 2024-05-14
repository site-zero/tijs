import { App } from 'vue';
import { COM_TYPES } from '../../lib-com-types';
import { TiComInfo, TiComRace } from '../../../core';
import TiForm from './TiForm.vue';
import { nested, simple } from './example';
import i18n from './i18n';

const COM_TYPE = COM_TYPES.Form;

const TiFormInfo: TiComInfo = {
  icon: 'fas-clipboard-list',
  race: TiComRace.SHELF,
  name: COM_TYPE,
  text: 'i18n:ti-form-com-name',
  i18n,
  com: TiForm,
  install: (app: App) => {
    app.component(COM_TYPE, TiForm);
  },
  defaultProps: 'simple',
  exampleModel: {
    'field-change': {
      key: 'data.${name}',
      val: '=value',
    },
    'change': 'data',
  },
  exampleProps: [simple, nested],
};

export { TiForm, TiFormInfo };
export * from './ti-form-types';
