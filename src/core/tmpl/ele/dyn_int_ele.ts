import _ from 'lodash';
import { sprintf } from 'sprintf-js';
import { Vars } from '../../../_type';
import { DynElInfo, TmplEle } from '../ti-tmpl';

export class DynIntEle implements TmplEle {
  private _dft_val: number;
  private _key: string;
  private _fmt?: string;
  constructor(input: DynElInfo) {
    this._dft_val = parseInt(input.dft) || 0;
    this._key = input.key;
    this._fmt = input.fmt;
  }
  join(sb: string[], context: Vars) {
    let v = _.get(context, this._key);
    v = v ?? this._dft_val;
    if (!_.isNumber(v)) {
      v = parseInt(v);
    }
    v = Math.round(v);
    if (this._fmt) {
      let s = sprintf(this._fmt, v);
      sb.push(s);
    }
    // 直接记入
    else {
      sb.push(v);
    }
  }
}
