import { TiMatch, ExplainI18n } from '../ti';
import { MakeTiMatch } from './ti-match';

export const gen_by_bool: MakeTiMatch<boolean> = function (
  src: boolean,
): TiMatch {
  return {
    test: (_input: any): boolean => {
      return src;
    },
    explainText: (i18n: ExplainI18n): string => {
      return src ? i18n.mustBoolTrue : i18n.mustBoolFalse;
    },
  };
};
