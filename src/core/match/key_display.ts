import _ from 'lodash';
import { KeyDisplay } from '../../_type';

export function explainKeyDisplay(
  key: string,
  keyDisplayBy?: KeyDisplay
): string {
  // Translate the key
  if (_.isFunction(keyDisplayBy)) {
    return keyDisplayBy(key);
  }
  // Tranlsate as key path
  if (_.isArray(keyDisplayBy)) {
    let keyPath = key.split('.');
    let kdiss = [];
    for (let i = 0; i < keyPath.length; i++) {
      let kph = keyPath[i];
      let kdb = _.nth(keyDisplayBy, i);
      if (kdb) {
        kdiss.push(kdb[kph] || kph);
      } else {
        kdiss.push(kph);
      }
    }
    return kdiss.join('.');
  }
  // Simple translate
  if (keyDisplayBy) {
    return _.get(keyDisplayBy, key) ?? key;
  }
  // Use original value
  return key;
}
