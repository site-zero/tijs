import _ from 'lodash';
import { FilterProps, GridFieldsInput, makeFieldUniqKey } from '../../';
import { Util } from '../../../core';

export function makeFieldsMap(flds?: GridFieldsInput[]) {
  let map = new Map<string, GridFieldsInput>();
  const ___join_field = function (flds?: GridFieldsInput[]) {
    if (flds) {
      for (let fld of flds) {
        if (fld.name) {
          if (_.isArray(fld.name)) {
            for (let nm of fld.name) {
              map.set(nm, fld);
            }
          } else {
            map.set(fld.name, fld);
          }
        }
        ___join_field(fld.fields);
      }
    }
  };
  ___join_field(flds);
  return map;
}

export function genIsMajor(props: FilterProps) {
  if (_.isNil(props.majorFields) || _.isEmpty(props.majorFields)) {
    return (_index: number, _fld: GridFieldsInput) => false;
  }
  let _major_map = Util.arrayToMap(props.majorFields);
  return (index: number, fld: GridFieldsInput) => {
    let uniqKey = makeFieldUniqKey([index], fld.name, fld.uniqKey);
    return _major_map.get(uniqKey) ?? false;
  };
}
