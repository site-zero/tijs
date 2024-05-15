import { App } from 'vue';
import { TiComInfo, TiComRace } from '../../../core';
import { COM_TYPES } from '../../lib-com-types';
import TiEditPair from './TiEditPair.vue';
import example from './example';

const en_us = {
  'com-name': 'Edit Pair',
};
const zh_cn = {
  'com-name': '编辑名值对',
};

const COM_TYPE = COM_TYPES.EditPair;

const TiEditPairInfo: TiComInfo = {
  tags: ['scaffold'],
  icon: 'zmdi-view-web',
  race: TiComRace.EIDT,
  name: COM_TYPE,
  text: 'i18n:ti-edit-pair-com-name',
  i18n: {
    en_us: en_us,
    en_uk: en_us,
    zh_cn: zh_cn,
    zh_hk: zh_cn,
  },
  com: TiEditPair,
  install: (app: App) => {
    app.component(COM_TYPE, TiEditPair);
  },
  defaultProps: 'simple',
  exampleProps: [example.simple],
};

export * from './ti-edit-pair-types';
export { TiEditPair, TiEditPairInfo };
