import { App } from 'vue';
import { TiComInfo, TiComRace } from '../../../_type';
import { COM_TYPES } from '../../lib-com-types';
import TiMainFrame from './TiMainFrame.vue';
import { simple } from './example';

let en = {
  'com-name': 'Main Frame',
};
let cn = {
  'com-name': '应用主框架',
};

const COM_TYPE = COM_TYPES.MainFrame;

const TiMainFrameInfo: TiComInfo = {
  icon: 'zmdi-tv',
  race: TiComRace.SHELF,
  name: COM_TYPE,
  text: 'i18n:ti-main-frame-com-name',
  i18n: {
    en_us: en,
    en_uk: en,
    zh_cn: cn,
    zh_hk: cn,
  },
  liveStyle: {
    width: '100%',
    height: '100%',
  },
  com: TiMainFrame,
  install: (app: App) => {
    app.component(COM_TYPE, TiMainFrame);
  },
  defaultProps: 'simple',
  exampleProps: [simple],
};

export { TiMainFrame, TiMainFrameInfo };
