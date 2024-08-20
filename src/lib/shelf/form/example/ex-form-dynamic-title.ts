import { DroplistProps } from '../../../input/all-input';
import { ComPropExample } from '../../../../_type';
import { FormProps } from '../ti-form-types';

export default {
  name: 'dynamic_title',
  text: 'i18n:ti-form-example-dynamic-title',
  comConf: {
    changeMode: 'diff',
    data: {
      species: 'fish',
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
    maxFieldNameWidth: 100,
    fields: [
      {
        title: 'Species',
        name: 'species',
        required: true,
        comType: 'TiDroplist',
        comConf: {
          prefixIconForClean: true,
          options: [
            { value: 'otter', text: 'Otter', icon: 'fas-otter' },
            { value: 'fish', text: 'Fish', icon: 'fas-fish' },
            { value: 'dragon', text: 'Dragon', icon: 'fas-dragon' },
            { value: 'locust', text: 'Locust', icon: 'fas-locust' },
            { value: 'dove', text: 'Dove', icon: 'fas-dove' },
          ],
        } as DroplistProps,
      },
      {
        title: [
          ['Fish Age', { 'data.species': 'fish' }],
          ['Dragon Age', { 'data.species': 'dragon' }],
          'Age',
        ],
        name: 'age',
        type: 'Integer',
        comType: 'TiInput',
      },
      {
        title: '->${data.species<string:start>?} Name',
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
