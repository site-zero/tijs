import { TiComInfo, TiComRace } from '../../';
import { App } from 'vue';
import TiBlock from './TiBlock.vue';
import { COM_TYPE } from './use-block';
//const TiBlock = defineAsyncComponent(() => import("./TiBlock.vue"));

const en_us = {
  'com-name': 'Block',
};
const zh_cn = {
  'com-name': '布局块',
};

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
