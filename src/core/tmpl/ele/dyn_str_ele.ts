import _ from 'lodash';
import { StrCaseMode } from '../../';
import { Str, StrConvertor, Vars } from '../../ti';
import { DynElInfo } from '../ti-tmpl';
import { DynEle } from './abstract_dyn_ele';
import { str_format } from './str/str_format';
import { str_mapping } from './str/str_mapping';
import { str_replace } from './str/str_replace';
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
      // 字符串替换:
      // ${path<string:@trim;@replace'/','-';@replace'~'>}
      else if (s.startsWith('@replace')) {
        let is = s.substring(8);
        this._convertors.push(str_replace(is));
      }
      // 字符串映射
      // ${fruit(string::A=Apple,B=Banana,C=Cherry)}
      else if (s.startsWith(':')) {
        let is = s.substring(1);
        this._convertors.push(str_mapping(is));
      }
      // 大小写转换
      else if (/^(upper|lower|camel|kebab|snake)$/i.test(s)) {
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
