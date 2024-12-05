import _ from 'lodash';

export type SelectValueArmItem<T, M> = T | [T, M];
export type SelectValueArm<T, M> = T | Array<SelectValueArmItem<T, M>>;

export type Gender = 'UNKNOWN' | 'MALE' | 'FEMALE';

export function toGender(str?: any): Gender {
  if (_.isNil(str)) {
    return 'UNKNOWN';
  }
  let lower = str.toLowerCase().trim();
  if (/^(m(ale)?)$/.test(lower)) {
    return 'MALE';
  }

  if (/^(f(emale)?)$/.test(lower)) {
    return 'FEMALE';
  }

  return 'UNKNOWN';
}
