import { DropListProps, GridFieldsInput } from '../../../';

export function getFilterExampleFields(): GridFieldsInput[] {
  return [
    {
      name: '__keywords',
      comConf: {
        placeholder: 'Filter by keywords',
      },
    },
    {
      title: 'Type',
      name: 'type',
      comType: 'TiDroplist',
      comConf: {
        options: [
          { value: 'hippo', text: 'Hippo', icon: 'fas-hippo' },
          { value: 'cow', text: 'Cow', icon: 'fas-cow' },
          { value: 'spider', text: 'Spider', icon: 'fas-spider' },
          { value: 'frog', text: 'Frog', icon: 'fas-frog' },
          { value: 'bugs', text: 'Bugs', icon: 'fas-bugs' },
          { value: 'otter', text: 'Otter', icon: 'fas-otter' },
          { value: 'feather', text: 'Feather', icon: 'fas-feather' },
          { value: 'fish', text: 'Fish', icon: 'fas-fish' },
        ],
      } as DropListProps,
    },
    {
      title: 'Hippo Name',
      name: 'name',
      visible: {
        type: 'hippo',
      },
    },
    {
      title: 'Animal Name',
      name: 'name',
      hidden: {
        type: 'hippo',
      },
    },
    {
      title: 'Age',
      name: 'age',
    },
    {
      title: 'Birthday',
      name: 'dob',
      comType: 'TiInputDate',
    },
    {
      title: 'Phone',
      name: 'phone',
    },
    {
      title: 'Email',
      name: 'email',
    },
    {
      title: 'City',
      name: 'city',
    },
    {
      title: 'Job Title',
      name: 'job',
    },
  ];
}
