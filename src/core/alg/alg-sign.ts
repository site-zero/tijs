import _ from 'lodash';
import * as CryptoJS from 'crypto-js';

export function sha1(str: any) {
  let s: string;
  if (!_.isString(str)) {
    s = JSON.stringify(str);
  } else {
    s = str;
  }
  // CryptoJS 定义在 @types/crypto-js
  return CryptoJS.SHA1(s).toString();
}
