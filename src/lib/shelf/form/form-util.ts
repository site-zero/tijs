import { Vars } from "../../../core";
import { FieldPair } from "../../";
import _ from "lodash";
import JSON5 from "json5";

export function joinPairs(data: Vars, ...pairs: FieldPair[]): Vars {
  for (let pair of pairs) {
    let key = pair.name;
    let val = pair.value;
    //
    // key 是一个数组，那么值就一定是对象
    //
    if (_.isArray(key)) {
      if (!_.isPlainObject(val)) {
        throw Error(
          `Fail to Join Pair, 
          value should be Object 
          when name is Array '${JSON5.stringify(pair)}'`
        );
      }
      for (let k in key) {
        let v = val[k];
        _.set(data, k, v);
      }
    }
    // 普通的明值对
    else {
      _.set(data, key, val);
    }
  }
  return data;
}