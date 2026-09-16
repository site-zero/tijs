import { I18n, StrRange } from "../";
import { ExplainI18n, TiMatch } from "../../_type";
import { get_range_info_msg_key } from "../../lib/_features/range/range-msg-key";
import { MakeTiMatch } from "./ti-match";

export const gen_by_str_range: MakeTiMatch<string> = function (
  src: string
): TiMatch {
  let rg = new StrRange(src);

  return {
    test: (input: any): boolean => {
      return rg.contains(input);
    },
    explainText: (_i18n: ExplainI18n): string => {
      let info = rg.toRangeInfo();
      const msg = get_range_info_msg_key(info);
      const { maxValue, minValue } = info;
      const msgKey = `i18n:ti-input-date-range-info-${msg}`;
      return I18n.textf(msgKey, { maxValue, minValue });
    },
  };
};
