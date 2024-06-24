import { I18n, Str } from '../';
import { ExplainI18n, TiMatch } from '../../_type';
import { MakeTiMatch } from './ti-match';

export const gen_by_map_type: MakeTiMatch<string> = function (
  expectType: string
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
