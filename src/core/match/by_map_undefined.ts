import _ from 'lodash';
import { I18n, TiMatch, ExplainI18n, Str } from '../ti';
import { MakeTiMatch } from './ti-match';

export const gen_by_map_undefined: MakeTiMatch<string> = function (
  key_of_obj: string,
): TiMatch {
  return {
    test: (input: any): boolean => {
      let v = _.get(input, key_of_obj);
      return _.isUndefined(v);
    },
    explainText: (i18n: ExplainI18n): string => {
      let tmpl = I18n.text(i18n.undefinedOf);
      return Str.renderTmpl(tmpl, { val: key_of_obj });
    },
  };
};
