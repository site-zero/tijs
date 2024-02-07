import _ from "lodash";
import { I18n, TiMatch, ExplainI18n, Str } from "../ti";
import { MakeTiMatch } from "./ti-match";

export const gen_by_map_empty: MakeTiMatch<string> = function (
  key_of_obj: string
): TiMatch {
  return {
    test: (input: any): boolean => {
      let v = _.get(input, key_of_obj);
      return _.isEmpty(v);
    },
    explainText: (i18n: ExplainI18n): string => {
      let tmpl = I18n.text(i18n.emptyOf);
      return Str.renderTmpl(tmpl, { val: key_of_obj });
    }
  };
};
