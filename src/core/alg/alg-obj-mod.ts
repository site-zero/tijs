import _ from 'lodash';
import { ObjModeInfo } from '../../_type';

/**
 * 针对输入的数据解析为权限对象信息，输入支持下面的形式
 *
 * - 488 : 数字类型，表示10进制的权限码
 * - "777" : 八进制字符串，表示八进制的权限码
 * - "rwxr-xr-x" : 全文本，表示权限的字符串形式
 * - "rwx" : 文本，相当于 "rwxrwxrwx"
 *
 * @param md 输入的权限码
 * @return 权限信息对象
 */
export function parseObjMode(md: string | number): ObjModeInfo {
  let re: ObjModeInfo = {
    val: 0,
    oct: '000',
    mod: '---------',
    owner: '---',
    group: '---',
    other: '---',
  };
  // 10进制整数，转换为 `rwxr-xr-x` 形式的文本
  const _mode_to_str = (mode: number) => {
    let permissionStr = '';
    const permissionChars = ['r', 'w', 'x'];
    for (let i = 2; i >= 0; i--) {
      const group = (mode >> (i * 3)) & 7;
      for (let j = 2; j >= 0; j--) {
        if ((group & (1 << j)) !== 0) {
          permissionStr += permissionChars[2 - j];
        } else {
          permissionStr += '-';
        }
      }
    }
    return permissionStr;
  };
  // `rwxr-xr-x` 形式的文本，转换为 10 进制整数
  const _str_to_mode = (str: string) => {
    let mode = 0;
    const permissionMap = {
      'r': 4,
      'w': 2,
      'x': 1,
      '-': 0,
    };
    for (let i = 0; i < 3; i++) {
      const group = str.slice(i * 3, (i + 1) * 3);
      let groupValue = 0;
      for (let char of group) {
        if ('r' == char || 'w' == char || 'x' == char || '-' == char) {
          groupValue += permissionMap[char];
        } else {
          throw `Invalid permission mode: ${str}`;
        }
      }
      mode = (mode << 3) | groupValue;
    }
    return mode;
  };

  //  488 : 数字类型，表示10进制的权限码
  if (_.isNumber(md)) {
    re.val = md;
    re.oct = md.toString(8).padStart(3, '0');
    re.mod = _mode_to_str(md);
  }
  // - "777" : 八进制字符串，表示八进制的权限码
  // - "rwxr-xr-x" : 全文本，表示权限的字符串形式
  // - "rwx" : 文本，相当于 "rwxrwxrwx"
  else if (_.isString(md)) {
    // - "777" : 八进制字符串，表示八进制的权限码
    if (/^\d+$/.test(md)) {
      re.oct = md.padStart(3, '0');
      re.val = parseInt(re.oct, 8);
      re.mod = _mode_to_str(re.val);
    }
    // - "rwxr-xr-x" : 全文本，表示权限的字符串形式
    else if (/^[rwx-]{9}$/.test(md)) {
      re.mod = md;
      re.val = _str_to_mode(md);
      re.oct = (re.val & 0o777).toString(8).padStart(3, '0');
    }
    // - "rwx" : 文本，相当于 "rwxrwxrwx"
    else if (/^[rwx-]{1,3}$/.test(md)) {
      md = md.padEnd(3, '-');
      re.mod = md + md + md;
      re.val = _str_to_mode(re.mod);
      re.oct = (re.val & 0o777).toString(8).padStart(3, '0');
    }
  }
  // 分段权限码
  re.owner = re.mod.slice(0, 3);
  re.group = re.mod.slice(3, 6);
  re.other = re.mod.slice(6, 9);
  return re;
}
