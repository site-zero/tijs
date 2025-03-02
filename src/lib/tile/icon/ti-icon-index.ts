import { App } from 'vue';
import { TiComInfo, TiComRace } from '../../../_type';
import { COM_TYPES } from '../../lib-com-types';
import TiIcon from './TiIcon.vue';
import { IconProps } from './ti-icon-types';

const en_us = {
  'com-name': 'Icon',
  'example-simple-icon': 'Simple',
  'example-color-icon': 'Colorized',
  'example-color-icon-val': 'Colorized by Value',
  'example-image-icon': 'Image',
  'example-svg-icon': 'SVG',
};
const zh_cn = {
  'com-name': '图标',
  'example-simple-icon': '简单图标',
  'example-color-icon': '颜色图标',
  'example-color-icon-val': '通过值设置颜色',
  'example-image-icon': '图片图标',
  'example-svg-icon': 'SVG图标',
};

const COM_TYPE = COM_TYPES.Icon;

const TiIconInfo: TiComInfo = {
  icon: 'fas-fan',
  race: TiComRace.TILE,
  name: COM_TYPE,
  text: 'i18n:ti-icon-com-name',
  i18n: {
    en_us,
    en_uk: en_us,
    zh_cn,
    zh_hk: zh_cn,
  },
  com: TiIcon,
  install: (app: App) => {
    app.component(COM_TYPE, TiIcon);
  },
  defaultProps: 'simple-icon',
  exampleProps: [
    {
      name: 'simple-icon',
      text: 'i18n:ti-icon-example-simple-icon',
      comConf: {
        value: 'zmdi-slideshare',
      } as IconProps,
    },
    {
      name: 'color-icon',
      text: 'i18n:ti-icon-example-color-icon',
      comConf: {
        className: 's128',
        value: 'fas-snowflake',
        color: '#F00',
        opacity: 0.8,
      } as IconProps,
    },
    {
      name: 'color-icon-val',
      text: 'i18n:ti-icon-example-color-icon-val',
      comConf: {
        className: 's128',
        value: {
          type:'font',
          
          value: 'fas-snowflake',
        },
        opacity: 0.8,
      } as IconProps,
    },
    {
      name: 'image-icon',
      text: 'i18n:ti-icon-example-image-icon',
      comConf: {
        className: 's128',
        value: '/ti-logo.png',
      } as IconProps,
    },
    {
      name: 'svg-icon',
      text: 'i18n:ti-icon-example-svg-icon',
      comConf: {
        className: 's256',
        value: '/dna.svg',
      } as IconProps,
    },
  ],
};

export { TiIcon, TiIconInfo };
