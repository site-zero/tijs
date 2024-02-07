import _ from 'lodash';
import { StrConvertor } from '../../../ti';

export const str_trim: StrConvertor = (input): string => {
  return _.trim(input);
};
