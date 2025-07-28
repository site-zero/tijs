import _ from 'lodash';
import { FieldRefer, GridFieldsInput, TiObjFieldsApi } from '../../../';
import { getFieldUniqKey } from '../../../../_type';
import { I18n, Util } from '../../../../core';

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

export function makeFieldsMap(
  fieldSet: TiObjFieldsApi,
  flds?: FieldRefer[]
) {
  let map = new Map<string, GridFieldsInput[]>();
  function __add_to_map(key: string, ref: FieldRefer) {
    let fld = fieldSet.getFieldBy(ref);
    let flds = map.get(key);
    if (flds && flds.length > 0) {
      flds.push(fld);
    } else {
      map.set(key, [fld]);
    }
  }

  function ___join_field(refs?: FieldRefer[]) {
    if (refs) {
      for (let ref of refs) {
        let fld = fieldSet.getFieldBy(ref);
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
  try {
    ___join_field(flds);
  } catch (e) {
    console.warn(e);
  }
  return map;
}

export function joinFieldsList(
  fieldSet: TiObjFieldsApi,
  fields: FieldRefer[],
  list: GridFieldsInput[] = []
): GridFieldsInput[] {
  if (fields) {
    for (let ref of fields) {
      let fld = fieldSet.getFieldBy(ref);
      if (fld.name) {
        list.push(fld);
      }
      if (fld.fields) {
        joinFieldsList(fieldSet, fld.fields, list);
      }
    }
  }
  return list;
}

export function joinFieldsTitle(flds: GridFieldsInput[]) {
  let texts = _.map(flds, (fld) => {
    if (fld.title) {
      let title: string | undefined;
      if (_.isFunction(fld.title)) {
        title = fld.title({ data: {}, vars: {} });
      } else {
        title = Util.selectValue({}, fld.title, {
          explain: true,
        });
      }
      if (title) {
        return I18n.text(title);
      }
    }
    return fld.uniqKey ?? getFieldUniqKey(fld.name ?? []);
  });
  return texts.join('/');
}
