import _ from 'lodash';
import { Vars } from '../../ti';
import { DynElInfo } from '../ti-tmpl';
import { DynEle } from './abstract_dyn_ele';
import { sprintf } from 'sprintf-js';

export class DynFloatEle extends DynEle {
  private _fmt: string;

  constructor(input: DynElInfo) {
    super(input);
    this._fmt = input.fmt || '%.2f';
  }

  formatDefaultValue(v: any): any {
    if (!_.isNumber(v)) {
      v = parseFloat(v);
    }
    return sprintf(this._fmt, v);
  }

  join(sb: string[], context: Vars, showKey?: boolean) {
    let v = this._get_value(context);

    if (_.isNil(v)) {
      this.joinDefaultValue(sb, context, showKey);
      return;
    }

    let s = this.formatDefaultValue(v);
    sb.push(s);
  }
}
