import { App } from 'vue';
import { TiComInfo, TiComRace } from '../../../_type';
import { COM_TYPES } from '../../lib-com-types';
import TiInputNumUnit from './TiInputNumUnit.vue';
import example from './example';

const en_us = {
  'com-name': 'InputNumUnit',
  'example-amount': 'Amount',
  'example-volume': 'Volume',
  'example-weight': 'Weight',
};
const zh_cn = {
  'com-name': '带单位数字',
  'example-amount': '金额',
  'example-volume': '体积',
  'example-weight': '重量',
};

const COM_TYPE = COM_TYPES.InputNumUnit;

const TiInputNumUnitInfo: TiComInfo = {
  icon: 'fas-medal',
  race: TiComRace.INPUT,
  name: COM_TYPE,
  text: 'i18n:ti-input-num-unit-com-name',
  i18n: {
    en_us: en_us,
    en_uk: en_us,
    zh_cn: zh_cn,
    zh_hk: zh_cn,
  },
  com: TiInputNumUnit,
  liveStyle: {
    width: '80%',
    minWidth: '120px',
    maxWidth: '200px',
  },
  install: (app: App) => {
    app.component(COM_TYPE, TiInputNumUnit);
  },
  defaultProps: 'amount',
  exampleProps: [example.amount, example.volume, example.weight],
};

export * from './ti-input-num-unit-types';
export { TiInputNumUnit, TiInputNumUnitInfo };
