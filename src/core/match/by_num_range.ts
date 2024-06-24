import { I18n, NumRange, Str } from '../';
import { ExplainI18n, TiMatch } from '../../_type';
import { MakeTiMatch } from './ti-match';

export const gen_by_num_range: MakeTiMatch<string> = function (
  src: string
): TiMatch {
  let rg = new NumRange(src);

  return {
    test: (input: any): boolean => {
      let n = Math.round(input);
      return rg.contains(n);
    },
    explainText: (i18n: ExplainI18n): string => {
      let { left, right } = rg;
      if (!left && !right) {
        return I18n.text(i18n.mustBoolFalse);
      }

      if (left && right) {
        if (left.value === right.value) {
          let tmpl =
            left.open || right.open
              ? I18n.text(i18n.notEquals)
              : I18n.text(i18n.equals);
          return Str.renderTmpl(tmpl, { val: left.value });
        }
      }

      let ss = [];
      // (12,]  || [12,] || [12,) || (12,)
      if (left) {
        let s0 = left.open ? I18n.text(i18n.gt) : I18n.text(i18n.gte);
        ss.push(Str.renderTmpl(s0, { val: left.value }));
      }
      // (,12]  || [,12] || [,12) || (,12)
      if (right) {
        let s1 = right.open ? I18n.text(i18n.lt) : I18n.text(i18n.lte);
        ss.push(Str.renderTmpl(s1, { val: right.value }));
      }
      if (ss.length > 1) {
        let sep = I18n.text(i18n.and);
        return ss.join(sep);
      }
      return ss[0];
    },
  };
};
