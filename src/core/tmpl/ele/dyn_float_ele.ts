import _ from 'lodash';
import { sprintf } from 'sprintf-js';
import { ToBankTextOptions, Vars } from '../../../_type';
import { toBankText } from '../../../core/_top/ti-bank';
import { DynElInfo } from '../ti-tmpl';
import { DynEle } from './abstract_dyn_ele';

export class DynFloatEle extends DynEle {
  private _fmt: string;
  private _bank_options?: ToBankTextOptions;

  constructor(input: DynElInfo) {
    super(input);
    this._fmt = input.fmt || '%.2f';
    // 这里有一个对于货币的快速设置方法
    // '#,###.##%.2f' 相当于
    // {width:3,sep:',',decimalPlaces:2} + '%.2f
    // 譬如:
    // |-----------------------------------------------------------
    // | /^#(-)?([^#])(#*)[.](#*)(%\.\d+f)$/.exec('#,###.##%.2f')
    // |-----------------------------------------------------------
    // | 0: "#,###.##%.2f"
    // | 1: undefined
    // | 2: ","
    // | 3: "###"
    // | 4: "##"
    // | 5: "%.2f"
    // | groups: undefined
    // | index: 0
    // | input: "#,###.##%.2f"
    // | length: 6
    let m = /^#(-)?([^#]+)(#*)[.](#*)(%\.\d+f)$/.exec(input.fmt);
    if (m) {
      this._bank_options = {
        width: m[3].length,
        sep: m[2],
        decimalPlaces: m[4].length,
        to: '-' == m[1] ? 'right' : 'left',
      };
      this._fmt = m[5] || '%.2f';
    }
    // 普通格式化
    else {
      this._bank_options = undefined;
      this._fmt = input.fmt || '%.2f';
    }
  }

  formatDefaultValue(v: any): any {
    if (!_.isNumber(v)) {
      v = parseFloat(v);
    }
    let re = sprintf(this._fmt, v);
    if (this._bank_options) {
      return toBankText(re, this._bank_options);
    }
    return re;
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
