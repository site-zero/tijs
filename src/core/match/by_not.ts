import { I18n } from '../';
import { ExplainI18n, TiMatch } from '../../_type';
import { MakeTiMatch } from './ti-match';

export const gen_by_not: MakeTiMatch<TiMatch> = function (
  src: TiMatch
): TiMatch {
  return {
    test: (input: any): boolean => {
      return !src.test(input);
    },
    explainText: (i18n: ExplainI18n): string => {
      let s = I18n.text(i18n.not);
      return s + src.explainText(i18n);
    },
  };
};
