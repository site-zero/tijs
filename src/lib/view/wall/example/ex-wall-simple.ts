import { ImageProps, ThumbProps } from '../../../';
import { ComPropExample, IconObj } from '../../../../_type';
import { WallProps } from '../ti-wall-types';
import { mockWallData } from './mock-wall-data';

export default {
  name: 'simple',
  text: 'i18n:simple',
  comConf: {
    style: {
      padding: 'var(--ti-gap-b)',
    },
    itemConStyle: {
      padding: 'var(--ti-gap-b)'
    },
    layoutHint: '<120>',
    layout: {
      gap: 'var(--ti-gap-h)',
    },
    comConf: {
      preview: {
        src: {
          type: 'font',
          value: '=item.icon',
          style: {
            fontSize: '48px',
          },
        } as IconObj,
        height: '64px',
      } as ImageProps,
      text: {
        text: '=item.name',
      },
    } as ThumbProps,
    data: mockWallData(17),
  } as WallProps,
} as ComPropExample;
