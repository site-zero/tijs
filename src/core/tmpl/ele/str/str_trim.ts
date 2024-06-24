import _ from 'lodash';
import { StrConvertor } from '../../../../_type';

export const str_trim: StrConvertor = (input): string => {
  return _.trim(input);
};
