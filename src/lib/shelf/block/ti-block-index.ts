import { App } from 'vue';
import { COM_TYPES } from '../../lib-com-types';
import { TiComInfo, TiComRace } from '../../../core';
import TiBlock from './TiBlock.vue';

const en_us = {
  'com-name': 'Block',
};
const zh_cn = {
  'com-name': '布局块',
};

const COM_TYPE = COM_TYPES.Block;

const TiBlockInfo: TiComInfo = {
  icon: 'zmdi-border-outer',
  race: TiComRace.SHELF,
  name: COM_TYPE,
  text: 'i18n:ti-block-com-name',
  i18n: {
    en_us: en_us,
    en_uk: en_us,
    zh_cn: zh_cn,
    zh_hk: zh_cn,
  },
  com: TiBlock,
  asInner: true,
  install: (app: App) => {
    app.component(COM_TYPE, TiBlock);
  },
  defaultProps: 'simple',
  exampleProps: [
    {
      name: 'simple',
      text: 'i18n:simple',
      comConf: {
        className: 'fit-parent',
        title: 'MyBlock',
        name: 'mine',
        comType: 'TiRoadblock',
        comConf: {
          className: 'is-warn-r',
          icon: 'fas-person-digging',
          text: 'Construction ahead please detour',
          opacity: 0.4,
        },
      },
    },
  ],
};

export { TiBlock, TiBlockInfo };
