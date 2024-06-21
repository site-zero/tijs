import _ from 'lodash';
import { GridFieldsInput } from '../../';

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

export function joinFieldsList(
  flds: GridFieldsInput[],
  list: GridFieldsInput[] = []
): GridFieldsInput[] {
  if (flds) {
    for (let fld of flds) {
      if (fld.name) {
        list.push(fld);
      }
      if (fld.fields) {
        joinFieldsList(fld.fields, list);
      }
    }
  }
  return list;
}
