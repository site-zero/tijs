import _ from "lodash";
import JSON5 from "json5";
import { Vars } from "../../ti";
import { DynElInfo, TmplEle } from "../ti-tmpl";

export class DynJsonEle implements TmplEle {
  // [false, true]
  private _ignoreNil: boolean;
  private _compacted: boolean;
  private _quoteName: boolean;

  private _key: string;
  private _dft: string;

  constructor(input: DynElInfo) {
    this._key = input.key;
    this._dft = input.dft;
    let fmt = input.fmt || "";
    this._ignoreNil = fmt.indexOf("n") >= 0;
    this._compacted = fmt.indexOf("c") >= 0;
    this._quoteName = fmt.indexOf("q") >= 0;
  }

  join(sb: string[], context: Vars) {
    let v = _.get(context, this._key) ?? this._dft;
    if (_.isNil(v)) {
      sb.push("null");
      return;
    }
    v =
      (
        {
          "-obj-": {},
          "-array-": []
        } as Vars
      )[v] || v;

    // 本身就是个 JSON 字符串
    if (_.isString(v) && (/^\{.*\}$/.test(v) || /^\[.*\]$/.test(v))) {
      sb.push(v);
      return;
    }

    // 变 JSON
    let key_flt = this._ignoreNil
      ? (_k: string, v: any) => {
          if (!_.isNil(v)) {
            return v;
          }
        }
      : undefined;

    let space = this._compacted ? undefined : "  ";

    let json: string;
    if (this._quoteName) {
      json = JSON.stringify(v, key_flt, space);
    } else {
      json = JSON5.stringify(v, {
        replacer: key_flt,
        space
      });
    }

    if (json) {
      sb.push(json);
    }
  }
}
