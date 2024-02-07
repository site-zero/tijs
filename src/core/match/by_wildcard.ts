import { I18n, TiMatch, ExplainI18n, Str } from "../ti";
import { MakeTiMatch } from "./ti-match";

export const gen_by_wildcard: MakeTiMatch<string> = function (
  wildcard: string
): TiMatch {
  let regex = "^" + wildcard.replace("*", ".*") + "$";
  let P = new RegExp(regex);
  return {
    test: (input: any): boolean => {
      return P.test(input);
    },
    explainText: (i18n: ExplainI18n): string => {
      let tmpl = I18n.text(i18n.matchOf);
      return Str.renderTmpl(tmpl, { val: wildcard });
    }
  };
};
