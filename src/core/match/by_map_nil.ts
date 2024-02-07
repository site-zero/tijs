import _ from 'lodash';
import { ExplainI18n, I18n, Str, TiMatch } from '../ti';
import { MakeTiMatch } from './ti-match';

export const gen_by_map_nil: MakeTiMatch<string> = function (
  key_of_obj: string
): TiMatch {
  return {
    test: (input: any): boolean => {
      let v = _.get(input, key_of_obj);
      return _.isNil(v);
    },
    explainText: (i18n: ExplainI18n): string => {
      let tmpl = I18n.text(i18n.nilOf);
      return Str.renderTmpl(tmpl, { val: key_of_obj });
    },
  };
};
