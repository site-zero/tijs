import _ from 'lodash';
import { GridFieldsInput, makeFieldUniqKey, openAppModal } from '../../';
import { StrOptionItem } from '../../../core';
import { FilterProps } from './ti-filter-types';
import { FilterEmitter } from './use-filter';

function makeUniqKeyFieldsMap(flds?: GridFieldsInput[]) {
  let map = new Map<string, GridFieldsInput>();
  const ___join_field = function (flds?: GridFieldsInput[]) {
    if (flds) {
      let index = 0;
      for (let fld of flds) {
        let uniqKey = makeFieldUniqKey([index++], fld.name, fld.uniqKey);
        map.set(uniqKey, fld);
        ___join_field(fld.fields);
      }
    }
  };
  ___join_field(flds);
  return map;
}

export async function useFilterCustomization(
  props: FilterProps,
  emit: FilterEmitter
) {
  // 准备字段选项
  let fieldMap = makeUniqKeyFieldsMap(props.fields);
  let options = [] as StrOptionItem[];
  for (let [uniqKey, field] of fieldMap) {
    options.push({
      text: field.title ?? uniqKey,
      value: uniqKey,
    });
  }

  // 挑选
  let re = await openAppModal({
    icon: 'zmdi-toys',
    title: 'i18n:ti-filter-customize',
    type: 'info',
    position: 'bottom',
    width: '640px',
    height: '80%',
    clickMaskToClose: true,
    result: props.majorFields ?? [],
    comType: 'TiTransfer',
    comConf: {
      options,
    },
  });

  // 用户取消
  if (!re) {
    return;
  }

  // 改动
  if (!_.isEqual(re, props.majorFields)) {
    emit('change-major', re);
  }
}
