import _ from "lodash";
import { I18n, TiMatch, ExplainI18n, S } from "../ti";
import { MakeTiMatch } from "./ti-match";

export const gen_by_blank: MakeTiMatch<string> = function (
  _src: string
): TiMatch {
  return {
    test: (input: any): boolean => {
      return S.isBlank(input);
    },
    explainText: (i18n: ExplainI18n): string => {
      return I18n.text(i18n.blank);
    }
  };
};
