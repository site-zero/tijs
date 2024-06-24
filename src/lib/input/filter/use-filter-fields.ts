import _ from 'lodash';
import { GridFieldsInput } from '../../';
import { getFieldUniqKey } from '../../../_type';
import { I18n } from '../../../core';

export function getFieldsNames(fields: GridFieldsInput[] = []) {
  let re = new Set<string>();
  for (let field of fields) {
    let name = field.name;
    if (_.isString(name)) {
      re.add(name);
    } else if (_.isArray(name)) {
      for (let nm of name) {
        re.add(nm);
      }
    }
  }
  return [...re];
}

export function makeFieldsMap(flds?: GridFieldsInput[]) {
  let map = new Map<string, GridFieldsInput[]>();
  function __add_to_map(key: string, fld: GridFieldsInput) {
    let flds = map.get(key);
    if (flds && flds.length > 0) {
      flds.push(fld);
    } else {
      map.set(key, [fld]);
    }
  }

  function ___join_field(flds?: GridFieldsInput[]) {
    if (flds) {
      for (let fld of flds) {
        // self
        if (fld.name) {
          let uniqKey = fld.uniqKey ?? getFieldUniqKey(fld.name!);
          __add_to_map(uniqKey, fld);
        }
        // children
        if (fld.fields) {
          ___join_field(fld.fields);
        }
      }
    }
  }
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

export function joinFieldsTitle(flds: GridFieldsInput[]) {
  let texts = _.map(flds, (fld) => {
    if (fld.title) {
      return I18n.text(fld.title);
    }
    return fld.uniqKey ?? getFieldUniqKey(fld.name ?? []);
  });
  return texts.join('/');
}
