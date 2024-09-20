import { App } from 'vue';
import { TiComInfo, TiComRace } from '../../../_type';
import { COM_TYPES } from '../../lib-com-types';
import TiImage from './TiImage.vue';
import example from './example';

const en_us = {
  'com-name': 'Image',
  'example-svg': 'SVG',
  'example-icon': 'Icon Font',
  'example-any': 'Any File',
  'example-local-any': 'Local Any',
};
const zh_cn = {
  'com-name': '图像',
  'example-svg': 'SVG',
  'example-icon': '字体图标',
  'example-any': '任意文件',
  'example-local-any': '本地文件',
};

const COM_TYPE = COM_TYPES.Image;

const TiImageInfo: TiComInfo = {
  icon: 'zmdi-image',
  race: TiComRace.TILE,
  name: COM_TYPE,
  text: 'i18n:ti-image-com-name',
  i18n: {
    en_us: en_us,
    en_uk: en_us,
    zh_cn: zh_cn,
    zh_hk: zh_cn,
  },
  com: TiImage,
  install: (app: App) => {
    app.component(COM_TYPE, TiImage);
  },
  exampleModel: {
    change: '',
  },
  defaultProps: 'simple',
  exampleProps: [
    example.simple,
    example.svg,
    example.icon,
    example.any,
    example.local_any,
  ],
};

export * from './ti-image-types';
export { TiImage, TiImageInfo };
