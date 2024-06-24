import { ExplainI18n, TiMatch } from '../../_type';
import { MakeTiMatch } from './ti-match';

export const gen_by_func: MakeTiMatch<Function> = function (
  src: Function
): TiMatch {
  return {
    test: (input: any): boolean => {
      let re = src(input);
      return re ? true : false;
    },
    explainText: (i18n: ExplainI18n): string => {
      return i18n.func;
    },
  };
};
