import { ComPropExample } from '../../../../core';
import { InputGroupProps } from '../ti-input-group-types';

export default {
  name: 'simple',
  text: 'i18n:simple',
  comConf: {
    value: {
      type: 'work',
      phone: '+86 13910110054',
      phoneComment: 'Ava from 8:00 a.m. to 5:00 p.m',
    },
    layoutGridTracks: ['60px', '30%', '1fr'],
    bodyPartGap: 't',
    ignoreNil: true,
    fields: [
      { name: 'type', emptyAs: null },
      { name: 'phone', emptyAs: null },
      { name: 'phoneComment', emptyAs: null },
    ],
  } as InputGroupProps,
} as ComPropExample;
