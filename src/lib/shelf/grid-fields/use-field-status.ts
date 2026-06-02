import _ from "lodash";
import { computed } from "vue";
import { FieldStatus, FieldStatusIcons, FieldStatusInfo } from "../../../_type";
import { useObjFields } from "../../_features";
import { FormFieldItem } from "./ti-grid-fields-types";

export function useFieldStatus(
  fields: FormFieldItem[],
  fieldSetName?: string,
  fieldStatusIcons?: FieldStatusIcons
) {
  let _ofs = useObjFields(fieldSetName);
  // 得到默认的状态图标
  const statusIcons: FieldStatusIcons = _.assign(
    {
      pending: "fas-spinner fa-spin",
      error: "zmdi-alert-polygon",
      warn: "zmdi-alert-triangle",
      ok: "zmdi-check-circle",
      highlight: "far-lightbulb",
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
    // 支持 FieldRefer 形式的字段状态
    let fld_status = {} as Record<string, FieldStatus>;
    if (fieldStatus) {
      for (let key in fieldStatus) {
        let st = fieldStatus[key];
        let fld = _ofs.getFieldBy(key) || {
          name: key,
        };

        // 处理名称
        let names = _.concat(fld?.name ?? key);
        for (let name of names) {
          fld_status[name] = st;
        }
      }
    }

    // 寻找表单字段，这里考虑了组合键字段的情况
    // 即，任何一个组合键被匹配，都会认为命中了这个字段
    let unify_fld_status = new Map<string, FieldStatusInfo>();
    _.forEach(fld_status, (v, k) => {
      let { type, text } = v;
      let uniqKey = nameKeys.value.get(k);
      if (uniqKey) {
        unify_fld_status.set(uniqKey, {
          type,
          text,
          icon: statusIcons[type],
        });
      }
    });
    return unify_fld_status;
  }

  return buildFieldStatus;
}
