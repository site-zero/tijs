import _ from 'lodash';
import { I18n, TiMatch, ExplainI18n } from '../ti';
import { MakeTiMatch } from './ti-match';

export const gen_by_empty: MakeTiMatch<string> = function (
  _src: string,
): TiMatch {
  return {
    test: (input: any): boolean => {
      return _.isEmpty(input);
    },
    explainText: (i18n: ExplainI18n): string => {
      return I18n.text(i18n.empty);
    },
  };
};
