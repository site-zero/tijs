import _ from 'lodash';
import { Str } from '../../';
import { StrCaseMode, StrConvertor, Vars } from '../../../_type';
import { DynElInfo } from '../ti-tmpl';
import { DynEle } from './abstract_dyn_ele';
import { str_float_substr } from './str/str_float_substr';
import { str_format } from './str/str_format';
import { str_mapping } from './str/str_mapping';
import { str_replace } from './str/str_replace';
import { str_sub } from './str/str_sub';
import { str_trim } from './str/str_trim';

export class DynStrEle extends DynEle {
  private _convertors: StrConvertor[];

  constructor(input: DynElInfo) {
    super(input);
    this._convertors = [];

    // 预先分析处理器
    let ss = Str.splitIgnoreBlank(input.fmt, ';');
    for (let s of ss) {
      // 截取空白
      if ('@trim' == s) {
        this._convertors.push(str_trim);
      }
      // 建材字符串
      else if (s.startsWith('@sub=')) {
        this._convertors.push(str_sub(s.substring(5).trim()));
      }
      // 字符串替换:
      // ${path<string:@trim;@replace'/','-';@replace'~'>}
      else if (s.startsWith('@replace')) {
        let is = s.substring(8);
        this._convertors.push(str_replace(is));
      }
      // 限制长度和精度的浮点数 ${w<:@fs=7.2>} 表示最多7长度，小数点后最多两位
      // 12345678.45 => 1234567
      // 1234567.85 => 1234567
      // 123456.85 => 123456
      // 12348.45342 => 12348.4
      // 0.00000001 => 0.01
      else if (s.startsWith('@fs=')) {
        let is = s.substring('@fs='.length);
        this._convertors.push(str_float_substr(is));
      }
      // 字符串映射
      // ${fruit(string::A=Apple,B=Banana,C=Cherry)}
      else if (s.startsWith(':')) {
        let is = s.substring(1);
        this._convertors.push(str_mapping(is));
      }
      // 大小写转换
      else if (
        /^(upper(All|First)?|lower(All)?|camel|kebab|snake|start|raw)$/i.test(s)
      ) {
        let caseName = s.toLowerCase();
        let func = Str.getCaseFunc(caseName as StrCaseMode);
        this._convertors.push(func);
      }
      // 默认是字符串格式化:
      else {
        this._convertors.push(str_format(s));
      }
    }
  }

  formatDefaultValue(v: any): any {
    return v;
  }

  join(sb: string[], context: Vars, showKey?: boolean) {
    let val = this._get_value(context);

    if (_.isNil(val) || (_.isString(val) && !val)) {
      this.joinDefaultValue(sb, context, showKey);
      return;
    }

    let str = Str.anyToStr(val);
    for (let _c of this._convertors) {
      str = _c(str);
    }

    sb.push(str);
  }
}
