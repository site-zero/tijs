import { ComPropExample } from '../../../../_type';
import { PagerProps } from '../ti-pager-types';

export default {
  name: 'dotted',
  text: 'i18n:ti-pager-example-dotted',
  comConf: {
    mode: 'dotted',
    pageNumber: 3,
    pageCount: 30,
    pageSize: 100,
    totalCount: 2997,
    count: 100,
    maxShowPages: 10,
  } as PagerProps,
} as ComPropExample;
