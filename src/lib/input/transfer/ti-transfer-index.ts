import { App } from 'vue';
import { COM_TYPES } from '../../lib-com-types';
import { TiComInfo, TiComRace } from '../../../core';
import TiTransfer from './TiTransfer.vue';
import example from './example';

const en_us = {
  'com-name': 'Transfer',
};
const zh_cn = {
  'com-name': '穿梭框',
  'example-icon-tip': '带图标穿梭框',
  'example-table': '表格穿梭框',
};

const COM_TYPE = COM_TYPES.Transfer;

const TiTransferInfo: TiComInfo = {
  icon: 'fas-right-left',
  tags: ['scaffold'],
  race: TiComRace.INPUT,
  name: COM_TYPE,
  text: 'i18n:ti-transfer-com-name',
  i18n: {
    en_us: en_us,
    en_uk: en_us,
    zh_cn: zh_cn,
    zh_hk: zh_cn,
  },
  com: TiTransfer,
  install: (app: App) => {
    app.component(COM_TYPE, TiTransfer);
  },
  defaultProps: 'simple',
  exampleProps: [example.simple, example.icon_tip, example.table],
};

export { TiTransfer, TiTransferInfo };
