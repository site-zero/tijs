import _ from "lodash";
import { I18n, TiMatch, ExplainI18n, S } from "../ti";
import { explainKeyDisplay } from "./key_display";

export const gen_by_map_exitst = function (
  key_of_obj: string,
  not?: boolean
): TiMatch {
  return {
    test: (input: any): boolean => {
      debugger
      if (not) {
        return _.isUndefined(input);
      }
      return !_.isUndefined(input);
    },
    explainText: (i18n: ExplainI18n): string => {
      let tkey = not ? i18n.noexists : i18n.exists;
      let tmpl = I18n.text(tkey);
      let t = explainKeyDisplay(key_of_obj, i18n.keyDisplayBy);
      return S.renderTmpl(tmpl, { val: t });
    }
  };
};
