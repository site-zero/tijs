import { ComPropExample } from '../../../../core';
import { GridFieldsProps } from '../ti-grid-fields-types';

export default {
  name: 'nested',
  text: 'i18n:ti-grid-fields-example-nested',
  comConf: {
    data: {
      company_name: 'Innovative Tech Solutions',
      job_title: 'Senior Software Engineer',
      name: 'Mahanta Lloyd',
      age: 32,
      gender: 'Male',
      dob: '1991-04-15',
      birth_place: 'London, UK',
      hobbies: ['Coding', 'Mountain Biking', 'Photography'],
      email: 'mahanta.lloyd@example.com',
      phone: '+86 13910110054',
      address: '1234 Tech Park, Silicon Alley',
      city: 'Beijing',
      postal_code: '100080',
      country: 'China',
    },
    bodyPartGap: 'b',
    bodyPartFontSize: 'm',
    layoutHint: 1,
    maxFieldNameWidth: 120,
    fieldLayoutMode: 'h-wrap',
    defaultComType: 'TiInput',
    fields: [
      {
        title: 'General',
        rowSpan: 4,
        layoutHint: '[[3,600],[2,400],1]',
        groupAspect: 'bar',
        fields: [
          { title: 'Name', name: 'name' },
          { title: 'Age', name: 'age' },
          { title: 'Gender', name: 'gender' },
          { title: 'Date of Birth', name: 'dob' },
          { title: 'Place of Birth', name: 'birth_place' },
        ],
      },
      {
        title: 'Client',
        name: 'client',
        tip: 'This is Client',
      },
      { title: 'City', name: 'city' },
      { title: 'Country', name: 'country' },
      { title: 'Hobbies', name: 'hobbies' },
      {
        title: 'Contact Info',
        rowSpan: 4,
        layoutHint: '[[3,600],[2,400],1]',
        fields: [
          { title: 'Email Address', name: 'email' },
          { title: 'Phone Number', name: 'phone' },
          { title: 'Address', name: 'address' },
          { title: 'Postal Code', name: 'postal_code' },
        ],
      },
      { title: 'Company Name', name: 'company_name' },
      { title: 'Job Title', name: 'job_title' },
      {
        title: 'Department',
        name: 'department',
        tip: 'This is Department',
      },
    ],
  } as GridFieldsProps,
} as ComPropExample;
