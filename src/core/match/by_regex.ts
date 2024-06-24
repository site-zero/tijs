import { I18n, Str } from '../';
import { ExplainI18n, TiMatch } from '../../_type';

export const gen_by_regex = function (reg: RegExp, not?: boolean): TiMatch {
  return {
    test: (input: any): boolean => {
      return reg.test(input);
    },
    explainText: (i18n: ExplainI18n): string => {
      let msgk = not ? i18n.regexNot : i18n.regex;
      let tmpl = I18n.text(msgk);
      return Str.renderTmpl(tmpl, { val: reg + '' });
    },
  };
};
