import { ComPropExample } from '../../../../_type';
import { GridFieldsProps } from '../ti-grid-fields-types';

export default {
  name: 'sameline',
  text: 'i18n:ti-grid-fields-example-sameline',
  comConf: {
    data: {
      type: 'work',
      phone: '+86 13910110054',
      comment: 'stuck-uppishness pteromalid',
    },
    bodyPartGap: 's',
    bodyPartFontSize: 'm',
    layoutHint: 3,
    layoutGridTracks: ['80px', '200px', '1fr'],
    maxFieldNameWidth: 'auto',
    fieldLayoutMode: 'h-title-icon-prefix',
    defaultComType: 'TiInput',
    fields: [
      { name: 'type' },
      { title: '-', name: 'phone' },
      { title: '-', name: 'comment' },
    ],
  } as GridFieldsProps,
} as ComPropExample;
