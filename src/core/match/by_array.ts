import _ from 'lodash';
import { I18n } from '../';
import { ExplainI18n, TiMatch } from '../../_type';
import { MakeTiMatch, parse_strictly } from './ti-match';

export const gen_by_array: MakeTiMatch<any[]> = function (src: any[]): TiMatch {
  let ms = [] as TiMatch[];
  for (let it of src) {
    ms.push(parse_strictly(it));
  }

  return {
    test: (input: any): boolean => {
      for (let m of ms) {
        if (m.test(input)) {
          return true;
        }
      }
      return false;
    },
    explainText: (i18n: ExplainI18n): string => {
      if (_.isEmpty(ms)) {
        return '';
      }
      if (ms.length == 1) {
        return ms[0].explainText(i18n);
      }
      let ss = [] as string[];
      for (let m of ms) {
        ss.push(m.explainText(i18n));
      }
      let or = I18n.text(i18n.or);
      return ss.join('; ' + or);
    },
  };
};
