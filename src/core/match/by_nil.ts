import _ from 'lodash';
import { ExplainI18n, I18n, TiMatch } from '../ti';

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
