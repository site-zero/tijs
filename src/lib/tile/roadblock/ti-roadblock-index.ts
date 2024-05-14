import { App } from 'vue';
import { TiComInfo, TiComRace } from '../../../core';
import { COM_TYPES } from '../../lib-com-types';
import TiRoadblock from './TiRoadblock.vue';

const en_us = {
  'com-name': 'Roadblock',
  'example-simple': 'Simple',
  'example-color': 'Color',
};
const zh_cn = {
  'com-name': '路障牌',
  'example-simple': '简单',
  'example-color': '彩色',
  'example-large': '大型',
  'example-warn': '警告',
  'example-cover': '遮盖',
  'example-shadow': '阴影',
  'example-customized': '定制',
  'example-links': '链接',
};

const COM_TYPE = COM_TYPES.Roadblock;

const TiRoadblockInfo: TiComInfo = {
  icon: 'fas-road-barrier',
  race: TiComRace.TILE,
  name: COM_TYPE,
  text: 'i18n:ti-roadblock-com-name',
  i18n: {
    en_us: en_us,
    en_uk: en_us,
    zh_cn: zh_cn,
    zh_hk: zh_cn,
  },
  liveStyle: {
    width: '100%',
    height: '100%',
  },
  com: TiRoadblock,
  install: (app: App) => {
    app.component(COM_TYPE, TiRoadblock);
  },
  defaultProps: 'simple',
  exampleProps: [
    {
      name: 'simple',
      text: 'i18n:simple',
      comConf: {
        text: 'Attention please',
      },
    },
    {
      name: 'warn',
      text: 'i18n:warn',
      comConf: {
        className: 'is-warn-r',
        icon: 'fas-person-digging',
        text: 'Construction ahead please detour',
      },
    },
    {
      name: 'color',
      text: 'i18n:example-color',
      comConf: {
        icon: 'fas-person-digging',
        text: 'Construction ahead please detour',
        style: {
          color: 'rgba(255,255,255,0.4)',
          background: 'linear-gradient(45deg, blue, red)',
        },
      },
    },
    {
      name: 'large',
      text: 'i18n:large',
      comConf: {
        size: 'large',
        icon: 'fas-person-digging',
        text: 'Construction ahead please detour',
      },
    },
    {
      name: 'cover',
      text: 'i18n:ti-roadblock-example-cover',
      comConf: {
        className: 'is-warn-r',
        mode: 'cover',
        size: 'big',
        icon: 'fas-people-carry-box',
        text: 'Handle it gently',
        opacity: 'shadowy',
      },
    },
    {
      name: 'shadow',
      text: 'i18n:ti-roadblock-example-shadow',
      comConf: {
        className: 'is-success-r',
        icon: 'fas-people-carry-box',
        text: 'Handle it gently',
        style: {
          'text-shadow': '6px 6px 6px #000',
        },
      },
    },
    {
      name: 'links',
      text: 'i18n:ti-roadblock-example-links',
      comConf: {
        className: 'is-success-r',
        icon: 'fas-circle-check',
        text: 'Executed successfully',
        links: [
          {
            icon: 'fas-download',
            text: 'Download',
            target: '_blank',
            href: 'http://vuejs.org',
          },
          {
            icon: 'fas-calendar-check',
            text: 'Show Date',
            target: '_blank',
            href: 'http://vuejs.org',
          },
          {
            icon: 'fas-book',
            text: 'Book',
            target: '_blank',
            href: 'http://vuejs.org',
          },
        ],
      },
    },
    {
      name: 'customized',
      text: 'i18n:customized',
      comConf: {
        className: 'is-info-r',
        icon: 'fas-carrot',
        text: 'Health Importent',
        hoverIcon: 'fas-truck',
        hoverText: 'Sleep More',

        iconClass: 'is-error',
        iconStyle: {
          border: '5px solid #000',
          padding: '60px',
          borderRadius: '50%',
          background: '#FFF',
        },

        iconClickable: true,
        textClickable: true,

        style: {
          color: '#FFF',
          background: 'linear-gradient(90deg, black 0%, white 50%, black 100%)',
        },
        textStyle: {
          'color': 'transparent',
          'textTransform': 'uppercase',
          'fontWeight': 'bolder',
          'background-image': 'linear-gradient(45deg, #0c02ba, #00ff95)',
          '-webkit-background-clip': 'text',
        },
      },
    },
  ],
};

export * from './ti-roadblock-types';
export { TiRoadblock, TiRoadblockInfo };
