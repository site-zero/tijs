import { ImageProps, ThumbProps } from '../../../';
import { ComPropExample, IconObj } from '../../../../_type';
import { WallProps } from '../ti-wall-types';
import { mockWallData } from './mock-wall-data';

export default {
  name: 'simple',
  text: 'i18n:simple',
  comConf: {
    data: mockWallData(20),
    comConf: {
      preview: {
        value: {
          src: {
            type: 'font',
            value: '=item.icon',
          } as IconObj,
        } as ImageProps,
      },
      text: {
        text: '=item.name',
      },
    } as ThumbProps,
  } as WallProps,
} as ComPropExample;
