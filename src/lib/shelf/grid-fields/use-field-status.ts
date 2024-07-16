import _ from 'lodash';
import { computed } from 'vue';
import { FieldStatus, FieldStatusIcons, FieldStatusInfo } from '../../../_type';
import { GridFieldsStrictField } from './ti-grid-fields-types';

export function useFieldStatus(
  fields: GridFieldsStrictField[],
  fieldStatusIcons?: FieldStatusIcons
) {
  // 得到默认的状态图标
  const statusIcons: FieldStatusIcons = _.assign(
    {
      pending: 'fas-spinner fa-spin',
      error: 'zmdi-alert-polygon',
      warn: 'zmdi-alert-triangle',
      ok: 'zmdi-check-circle',
      highlight: 'far-lightbulb',
    },
    fieldStatusIcons
  );
  // 根据字段构建一个映射表，每个原生的对象字段名映射为 uniqKey
  // 这样，对于 ['a','b','c'] 这样的字段名，根据原始数据字段就能找到 uniqKey
  const nameKeys = computed(() => {
    let _map = new Map<string, string>();
    for (let fld of fields) {
      if (_.isArray(fld.name)) {
        for (let name of fld.name) {
          _map.set(name, fld.uniqKey);
        }
      } else {
        _map.set(fld.name, fld.uniqKey);
      }
    }
    return _map;
  });

  function buildFieldStatus(
    fieldStatus?: Record<string, FieldStatus>
  ): Map<string, FieldStatusInfo> {
    let re = new Map<string, FieldStatusInfo>();
    _.forEach(fieldStatus, (v, k) => {
      let { type, text } = v;
      let uniqKey = nameKeys.value.get(k);
      if (uniqKey) {
        re.set(uniqKey, {
          type,
          text,
          icon: statusIcons[type],
        });
      }
    });
    return re;
  }

  return buildFieldStatus
}
