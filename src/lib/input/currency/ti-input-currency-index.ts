import { App } from 'vue';
import { TiComInfo, TiComRace } from '../../../_type';
import { COM_TYPES } from '../../lib-com-types';
import TiInputCurrency from './TiInputCurrency.vue';
import example from './example';

const en_us = {
  'com-name': 'InputCurrency',
};
const zh_cn = {
  'com-name': '货币输入',
};

const COM_TYPE = COM_TYPES.InputCurrency;

const TiInputCurrencyInfo: TiComInfo = {
  tags: ['scaffold'],
  icon: 'fas-money-bill',
  race: TiComRace.INPUT,
  name: COM_TYPE,
  text: 'i18n:ti-input-currency-com-name',
  i18n: {
    en_us: en_us,
    en_uk: en_us,
    zh_cn: zh_cn,
    zh_hk: zh_cn,
  },
  com: TiInputCurrency,
  install: (app: App) => {
    app.component(COM_TYPE, TiInputCurrency);
  },
  defaultProps: 'simple',
  exampleProps: [example.simple],
};

export * from './ti-input-currency-types';
export { TiInputCurrency, TiInputCurrencyInfo };
