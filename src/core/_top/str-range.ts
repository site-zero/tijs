import _ from "lodash";
import { StrRangeInfo, StrRangeObj } from "../../_type";
import { AnyRange } from "./any-range";

export class StrRange extends AnyRange<string> {
  constructor(
    input: StrRange | StrRangeInfo | StrRangeObj | string | string[]
  ) {
    super(
      {
        anyToValue: (v) => {
          if (_.isString(v)) {
            return v;
          }
          return `${v}`;
        },
        compareValue: (v1, v2) => {
          if (v1 == v2) {
            return 0;
          }
          if (v1 < v2) {
            return -1;
          }
          return 1;
        },
        isMatchType: (v): v is string => {
          return _.isString(v);
        },
      },
      input
    );
  }
}
