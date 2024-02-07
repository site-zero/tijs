import { ExplainI18n, I18n, Str, TiMatch } from '../ti';
import { MakeTiMatch } from './ti-match';

export const gen_by_stict_eq: MakeTiMatch<any> = function (src: any): TiMatch {
  return {
    test: (input: any): boolean => {
      return src == input;
    },
    explainText: (i18n: ExplainI18n): string => {
      let tmpl = I18n.text(i18n.equals);
      return Str.renderTmpl(tmpl, { val: src });
    },
  };
};
