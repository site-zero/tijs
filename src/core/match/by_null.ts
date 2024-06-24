import _ from 'lodash';
import { I18n } from '../';
import { ExplainI18n, TiMatch } from '../../_type';
import { MakeTiMatch } from './ti-match';

export const gen_by_null: MakeTiMatch<string> = function (): TiMatch {
  return {
    test: (input: any): boolean => {
      return _.isNull(input);
    },
    explainText: (i18n: ExplainI18n): string => {
      return I18n.text(i18n.null);
    },
  };
};
