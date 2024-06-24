import _ from 'lodash';
import { I18n } from '../';
import { ExplainI18n, TiMatch } from '../../_type';

export const gen_by_nil = function (): TiMatch {
  return {
    test: (input: any): boolean => {
      return _.isNil(input);
    },
    explainText: (i18n: ExplainI18n): string => {
      return I18n.text(i18n.nil);
    },
  };
};
