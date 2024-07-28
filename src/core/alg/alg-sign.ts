import _ from 'lodash';
import * as CryptoJS from 'crypto-js';

// CryptoJS 定义在 @types/crypto-js
function __prepare_str(str: any) {
  if (!_.isString(str)) {
    return JSON.stringify(str);
  }
  return str;
}

export function md5(str: any) {
  let s = __prepare_str(str);
  return CryptoJS.MD5(s).toString();
}

export function sha1(str: any) {
  let s = __prepare_str(str);
  return CryptoJS.SHA1(s).toString();
}

export function sha256(str: any) {
  let s = __prepare_str(str);
  return CryptoJS.SHA256(s).toString();
}
