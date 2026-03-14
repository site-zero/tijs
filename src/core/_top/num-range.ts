import _ from "lodash";
import { I18n } from "../";
import { AnyRange } from "./any-range";

/**
 * <pre>
 * [10,20] => left:{value:10}, right:{value:20}
 * [10,20) => left:{value:10}, right:{value:20, open:true}
 * (,20]   => left:undefined, right:{value:20}
 * [10,]   => left:{value:10}, right:undefined
 * [20] => left:{value:20}, right:{value:20}
 * </pre>
 */

export class NumRange extends AnyRange<number> {
  //--------------------------------
  // (1638861356185,1641798956185]
  // @return {left:{val:163.., open:true}, right:{val:163...,open:false}}
  // (1638861356185,]
  // @return {left:{val:163.., open:true}, right:{val:NaN,open:false}}
  constructor(input: NumRange | string | number[]) {
    super(
      input,
      (v) => {
        if (_.isNumber(v)) {
          return v;
        }
        return Number(v);
      },
      (v1, v2) => v1 - v2,
      (v): v is number => {
        if (isNaN(v)) {
          return false;
        }
        return _.isNumber(v);
      }
    );
  }
}
