//"use sloppy";
import _ from "lodash";
import { Vars } from "../../ti";
import { TmplEle } from "../ti-tmpl";

export class DynElEle implements TmplEle {
  // [false, true]
  private _el_func: { (c: any): any };

  constructor(input: string) {
    this._el_func = (__el_context__: any) => {
      let el = `(__el_context__.${input})`;
      return eval(el);
    };
  }

  join(sb: string[], context: Vars) {
    let v = this._el_func(context);

    if (!_.isNil(v)) {
      sb.push(v);
    }
  }
}
