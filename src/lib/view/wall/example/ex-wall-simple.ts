import { ImageProps, ThumbProps } from '../../../';
import { ComPropExample, IconObj } from '../../../../_type';
import { WallProps } from '../ti-wall-types';
import { mockWallData } from './mock-wall-data';

export default {
  name: 'simple',
  text: 'i18n:simple',
  comConf: {
    style: {
      padding: 'var(--ti-gap-h)',
    },
    layout: {
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 'var(--ti-gap-h)',
    },
    comConf: {
      preview: {
        src: {
          type: 'font',
          value: '=item.icon',
          style: {
            fontSize: '64px',
          },
        } as IconObj,
        height: '64px'
      } as ImageProps,
      text: {
        text: '=item.name',
      },
    } as ThumbProps,
    data: mockWallData(20),
  } as WallProps,
} as ComPropExample;
