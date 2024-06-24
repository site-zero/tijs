import _ from 'lodash';
import { I18n, Str } from '../';
import { ExplainI18n, TiMatch } from '../../_type';
import { MakeTiMatch, parse } from './ti-match';

export type MapFindInArrayPayload = {
  matchBy?: any;
  not?: boolean;
};
export const gen_by_map_find_in_array: MakeTiMatch<MapFindInArrayPayload> =
  function ({ matchBy, not } = {} as MapFindInArrayPayload): TiMatch {
    let matchFn = parse(matchBy);

    return {
      test: (input: any): boolean => {
        let vals = _.concat(input);
        let inArray = false;
        for (let v of vals) {
          if (matchFn.test(v)) {
            inArray = true;
            break;
          }
        }
        return not ? !inArray : inArray;
      },
      explainText: (i18n: ExplainI18n): string => {
        let cTxt = matchFn.explainText(i18n);
        let tmpl = I18n.text(i18n.findInArray);
        return Str.renderTmpl(tmpl, { val: cTxt });
      },
    };
  };
