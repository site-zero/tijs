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

// export function genIsMajor(props: FilterProps) {
//   if (_.isNil(props.majorFields) || _.isEmpty(props.majorFields)) {
//     return (_index: number, _fld: GridFieldsInput) => false;
//   }
//   let _major_map = Util.arrayToMap(props.majorFields);
//   return (index: number, fld: GridFieldsInput) => {
//     let uniqKey = makeFieldUniqKey([index], fld.name, fld.uniqKey);
//     return _major_map.get(uniqKey) ?? false;
//   };
// }
