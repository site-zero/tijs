import { ComPropExample } from '../../../../_type';
import { FormProps } from '../ti-form-types';

export default {
  name: 'simple',
  text: 'i18n:simple',
  comConf: {
    changeMode: 'diff',
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
    className: 'title-sticky',
    fields: [
      {
        title: 'Species',
        name: 'species',
        required: true,
        comType: 'TiInput',
      },
      {
        title: 'Age',
        name: 'age',
        type: 'Integer',
        comType: 'TiInput',
      },
      {
        title: 'Name',
        name: 'name',
        comType: 'TiInput',
      },
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
  } as FormProps,
} as ComPropExample;
