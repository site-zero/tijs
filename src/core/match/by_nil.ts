import _ from 'lodash';
import { ExplainI18n, I18n, TiMatch } from '../ti';
import { MakeTiMatch } from './ti-match';

export const gen_by_nil: MakeTiMatch<string> = function (): TiMatch {
  return {
    test: (input: any): boolean => {
      return _.isNil(input);
    },
    explainText: (i18n: ExplainI18n): string => {
      return I18n.text(i18n.nil);
    },
  };
};
