import _ from "lodash";
import { I18n, TiMatch, ExplainI18n ,S} from "../ti";
import { MakeTiMatch } from "./ti-match";

export const gen_by_map_null: MakeTiMatch<string> = function (
  key_of_obj: string
): TiMatch {
  return {
    test: (input: any): boolean => {
      let v = _.get(input, key_of_obj);
      return _.isNull(v);
    },
    explainText: (i18n: ExplainI18n): string => {
      let tmpl = I18n.text(i18n.nullOf);
      return S.renderTmpl(tmpl, { val: key_of_obj });
    }
  };
};
