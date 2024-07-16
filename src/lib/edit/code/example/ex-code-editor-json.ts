import { ComPropExample } from '../../../../_type';
import { CodeEditorProps } from '../ti-code-editor-types';

export default {
  name: 'json',
  text: 'i18n:ti-code-editor-example-json',
  comConf: {
    type: 'json',
    value: {
      name: 'John Doe',
      age: 30,
      email: 'john.doe@example.com',
      address: {
        street: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        zip: '12345',
      },
      phoneNumbers: [
        {
          type: 'home',
          number: '555-555-5555',
        },
        {
          type: 'work',
          number: '555-555-1234',
        },
      ],
    },
  } as CodeEditorProps,
} as ComPropExample;
