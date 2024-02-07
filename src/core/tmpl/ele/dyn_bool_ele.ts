import _ from 'lodash';
import { Vars, Str } from '../../ti';
import { DynElInfo } from '../ti-tmpl';
import { DynEle } from './abstract_dyn_ele';
import { anyToBool } from '../../util/util-lang';

export class DynBoolEle extends DynEle {
  // [false, true]
  private _texts: string[];

  constructor(input: DynElInfo) {
    super(input);
    let fmt = input.fmt;
    if (Str.isBlank(fmt)) {
      this._texts = ['false', 'true'];
    }
    // 定制了
    else {
      let s = fmt || 'false/true';
      let pos = s.indexOf('/');
      // "xxx"
      if (pos < 0) {
        this._texts = ['', s.trim()];
      }
      // "/xxx"
      else if (pos == 0) {
        this._texts = ['', s.substring(pos + 1).trim()];
      }
      // "xxx/"
      else if (pos == s.length - 1) {
        this._texts = [s.substring(0, pos).trim(), ''];
      }
      // must by "xxx/xxx"
      else {
        this._texts = [s.substring(0, pos).trim(), s.substring(pos + 1).trim()];
      }
    }
  }

  formatDefaultValue(v: any): any {
    let is_true = anyToBool(v);

    let I = is_true ? 1 : 0;
    return this._texts[I];
  }

  join(sb: string[], context: Vars, showKey?: boolean) {
    let v = this._get_value(context);

    if (_.isNil(v)) {
      this.joinDefaultValue(sb, context, showKey);
      return;
    }

    let s = this.formatDefaultValue(v);
    if (s) {
      sb.push(s);
    }
  }
}
