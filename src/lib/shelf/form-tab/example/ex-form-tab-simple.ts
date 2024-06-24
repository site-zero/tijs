import { ComPropExample } from '../../../../_type';
import { FormTabProps } from '../ti-form-tab-types';

export default {
  name: 'simple',
  text: 'i18n:simple',
  comConf: {
    data: {
      species: 'Tiger',
      age: 5,
      name: 'Stripes',
      habitat: 'Jungle',
      diet: 'Carnivore',
      weight: '200 kg',
      height: '1.2 meters',
      color: 'Orange with black stripes',
    },
    title: 'Simple Form With Sticky Title',
    // tip: 'dfasfdas adfdasf asdfadsfasdf',
    className: 'body-stretch title-sticky foot-sticky',
    tabsAt: 'top',
    keepAt: 'Ti-Demo-Form-Tab-Current',
    defaultComType: 'TiInput',
    bodyPartFontSize: 'b',
    bodyPartGap: 'b',
    fields: [
      {
        title: 'General',
        titleIcon: 'zmdi-bike',
        uniqKey: 'general',
        fields: [
          {
            title: 'Age',
            name: 'age',
            type: 'Integer',
            tip: 'This is Age',
          },
          {
            title: 'Name',
            name: 'name',
            tip: 'This is Name',
            required: true,
          },
          {
            title: 'Title',
            name: 'title',
            tip: 'This is Title',
            tipIcon: 'zmdi-face',
          },
          {
            title: 'Brief',
            name: 'brief',
            tip: 'This is Brief',
          },
          {
            title: 'Client',
            name: 'client',
            tip: 'This is Client',
          },
          {
            title: 'Role',
            name: 'role',
            tip: 'This is Role',
          },
          {
            title: 'Email',
            name: 'email',
          },
          {
            title: 'Phone',
            name: 'phone',
            tip: 'This is Phone',
          },
        ],
      },
      {
        title: 'More',
        titleIcon: 'zmdi-pin-help',
        uniqKey: 'more',
        layoutHint: 1,
        fields: [
          {
            title: 'Habitat',
            name: 'habitat',
            comType: 'TiInput',
          },
          {
            title: 'Diet',
            name: 'diet',
            comType: 'TiInput',
          },
          {
            title: 'Weight',
            name: 'weight',
            comType: 'TiInput',
          },
          {
            title: 'Height',
            name: 'height',
            comType: 'TiInput',
          },
          {
            title: 'Color',
            name: 'color',
            comType: 'TiInput',
          },
        ],
      },
    ],
  } as FormTabProps,
} as ComPropExample;
