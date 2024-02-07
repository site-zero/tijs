import _ from 'lodash';
import { I18n, TiMatch, ExplainI18n, Str } from '../ti';
import { MakeTiMatch } from './ti-match';

export const gen_by_map_type: MakeTiMatch<string> = function (
  expectType: string,
): TiMatch {
  return {
    test: (input: any): boolean => {
      return expectType === typeof input;
    },
    explainText: (i18n: ExplainI18n): string => {
      let tmpl = I18n.text(i18n.equalsType);
      return Str.renderTmpl(tmpl, { val: expectType });
    },
  };
};
