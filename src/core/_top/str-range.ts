import _ from "lodash";
import { AnyRange } from "./any-range";

export class StrRange extends AnyRange<string> {
  constructor(input: StrRange | string | string[]) {
    super(
      input,
      (v) => {
        if (_.isString(v)) {
          return v;
        }
        return `${v}`;
      },
      (v1, v2) => {
        if (v1 == v2) {
          return 0;
        }
        if (v1 < v2) {
          return -1;
        }
        return 1;
      },
      (v): v is string => {
        return _.isString(v);
      }
    );
  }
}
