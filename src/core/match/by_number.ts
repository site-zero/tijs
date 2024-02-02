import { S, I18n, TiMatch, ExplainI18n } from "../ti";
import { MakeTiMatch } from "./ti-match";

export const gen_by_number: MakeTiMatch<number> = function (
  src: number
): TiMatch {
  return {
    test: (input: any): boolean => {
      return src == input;
    },
    explainText: (i18n: ExplainI18n): string => {
      let tmpl = I18n.text(i18n.equals);
      return S.renderTmpl(tmpl, { val: src });
    }
  };
};
