import _ from 'lodash';
import { I18n } from '../';
import { ExplainI18n, TiMatch } from '../../_type';
import { MakeTiMatch } from './ti-match';

export const gen_by_empty: MakeTiMatch<string> = function (
  _src: string
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
