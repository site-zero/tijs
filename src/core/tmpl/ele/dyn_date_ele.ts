import _ from "lodash";
import { Vars, DateTime } from "../../ti";
import { DynElInfo } from "../ti-tmpl";
import { DynEle } from "./abstract_dyn_ele";

export class DynDateEle extends DynEle {
  private _fmt: string;
  constructor(input: DynElInfo) {
    super(input);
    this._fmt = input.fmt;
  }

  formatDefaultValue(v: any): any {
    return v;
  }

  join(sb: string[], context: Vars, showKey?: boolean) {
    let v = this._get_value(context);

    if (_.isNil(v)) {
      this.joinDefaultValue(sb, context, showKey);
      return;
      return;
    }

    let s = DateTime.format(v, { fmt: this._fmt, trimZero: true }) as string;
    sb.push(s);
  }
}
