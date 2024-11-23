import { StrConvertor } from '../../../../_type';

export function str_float_substr(input: string): StrConvertor {
  let ss = input.trim().split(/[.,#-]/);
  let maxLen = 0;
  let precision = 0;
  let _r = 1;
  if (ss.length > 1) {
    maxLen = parseInt(ss[0]);
    precision = parseInt(ss[1]);
  }
  // 只有一个值
  else if (ss.length > 0) {
    maxLen = parseInt(ss[0]);
    precision = 0;
  }

  if (precision > 0) {
    _r = Math.pow(10, precision);
  }

  // 无效
  if (maxLen <= 0) {
    return (s) => s;
  }

  // 返回处理函数
  return (str) => {
    // 确保是数字那么，科学计数法的数字也能被归一化处理
    let d_input = (str as any) * 1;
    let d_str = `${d_input}`;

    // 首先截取一下
    let s = d_str.substring(0, maxLen);

    // 如果结尾为 . 也截取
    if (s.endsWith('.')) {
      s = s.substring(0, maxLen - 1).trim();
    }

    // 不需要四舍五入
    if (precision <= 0) {
      return s;
    }

    // 转换为数字
    let d = (s as any) * 1;
    let n = Math.round(d * _r) / _r;

    // 处理 0 的情况
    if (n == 0.0 && d_input > 0.0) {
      n = 1.0 / _r;
    }

    let re = `${n}`;
    if (re.endsWith('.')) {
      return re.substring(0, re.length - 1);
    }
    if (re.endsWith('.0')) {
      return re.substring(0, re.length - 2);
    }
    return re;
  };
}
