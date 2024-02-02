import _ from "lodash";
import { AnyGetter, Vars } from "../../ti";
import { genObjGetter } from "../../util/util-getter";
import { DynElInfo, TmplEle } from "../ti-tmpl";

export abstract class DynEle implements TmplEle {
  protected _key: string;
  protected _dft: string;
  protected _get_value: AnyGetter;
  protected _get_dft: AnyGetter;

  abstract join(sb: string[], context: Vars, showKey?: boolean): void;

  constructor(input: DynElInfo) {
    this._key = input.key;
    this._dft = input.dft;
    this._get_value = genObjGetter(this._key);
    if (/^@/.test(input.dft)) {
      let dft_key = input.dft.substring(1).trim();
      this._get_dft = (obj) => obj[dft_key];
    }
    // 静态默认值
    else {
      this._get_dft = (_) => input.dft;
    }
  }

  abstract formatDefaultValue(v: any): any;

  joinDefaultValue(sb: string[], context: Vars, showKey?: boolean): void {
    let dft = this._get_dft(context);
    dft = this.formatDefaultValue(dft);
    if (_.isNil(dft)) {
      if (showKey) {
        sb.push(`\${${this._key}}`);
      }
    } else {
      sb.push(dft);
    }
  }
}
