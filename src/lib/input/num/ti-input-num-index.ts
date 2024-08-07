import { App } from 'vue';
import { TiComInfo, TiComRace } from '../../../_type';
import { COM_TYPES } from '../../lib-com-types';
import TiInputNum from './TiInputNum.vue';
import example from './example';

const en_us = {
  'com-name': 'InputNum',
  'example-partly': 'Partly',
  'example-amount': 'Amount',
};
const zh_cn = {
  'com-name': '数字输入',
  'example-partly': '分段显示',
  'example-amount': '货币金额',
};

const COM_TYPE = COM_TYPES.InputNum;

const TiInputNumInfo: TiComInfo = {
  icon: 'zmdi-n-6-square',
  race: TiComRace.INPUT,
  name: COM_TYPE,
  text: 'i18n:ti-input-num-com-name',
  i18n: {
    en_us: en_us,
    en_uk: en_us,
    zh_cn: zh_cn,
    zh_hk: zh_cn,
  },
  com: TiInputNum,
  liveStyle: {
    width: '80%',
    minWidth: '120px',
    maxWidth: '300px',
  },
  install: (app: App) => {
    app.component(COM_TYPE, TiInputNum);
  },
  defaultProps: 'simple',
  exampleProps: [example.simple, example.partly, example.amount],
};

export * from './ti-input-num-types';
export { TiInputNum, TiInputNumInfo };
