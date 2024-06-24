import { I18n, Str } from '../';
import { ExplainI18n, TiMatch } from '../../_type';
import { MakeTiMatch } from './ti-match';

export const gen_by_wildcard: MakeTiMatch<string> = function (
  wildcard: string,
): TiMatch {
  let regex = '^' + wildcard.replace('*', '.*') + '$';
  let P = new RegExp(regex);
  return {
    test: (input: any): boolean => {
      return P.test(input);
    },
    explainText: (i18n: ExplainI18n): string => {
      let tmpl = I18n.text(i18n.matchOf);
      return Str.renderTmpl(tmpl, { val: wildcard });
    },
  };
};
