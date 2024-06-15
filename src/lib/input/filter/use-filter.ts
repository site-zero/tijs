import _ from 'lodash';
import { computed, ref } from 'vue';
import { GridFieldsInput, makeFieldUniqKey } from '../../';
import { I18n, StrOptionItem, Util, Vars } from '../../../core';
import { FilterProps } from './ti-filter-types';

export function useFilter(props: FilterProps) {
  // 显示除了 Major 字段外的扩展过滤信息
  const moreItems = ref<StrOptionItem[]>();

  // 准备一个判断字段是否是 major 的方法，以便归纳时调用
  const _is_major = computed(() => {
    if (_.isNil(props.majorFields) || _.isEmpty(props.majorFields)) {
      return (_index: number, _fld: GridFieldsInput) => false;
    }
    let _major_map = Util.arrayToMap(props.majorFields);
    return (index: number, fld: GridFieldsInput) => {
      let uniqKey = makeFieldUniqKey([index], fld.name, fld.uniqKey);
      return _major_map.get(uniqKey) ?? false;
    };
  });

  /**
   * 都有哪些主字段
   */
  const MajorFields = computed(() => {
    let list = [] as GridFieldsInput[];
    if (props.fields) {
      let i = 0;
      for (let fld of props.fields) {
        if (_is_major.value(i++, fld)) {
          list.push(fld);
        }
      }
    }
    return list;
  });

  const isNeedAdvanceForm = computed(() => {
    if (props.fields) {
      return MajorFields.value.length < props.fields?.length;
    }
    return false;
  });

  function makeFieldsMap(flds?: GridFieldsInput[]) {
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
  const AllFields = computed(() => makeFieldsMap(props.fields));

  /**
   * 去掉主字段，还剩下哪些值
   */
  const MoreValue = computed(() => {
    let map = makeFieldsMap(MajorFields.value);
    let keys = [...map.keys()];
    return _.omit(props.value, keys) as Vars;
  });

  async function loadMoreItems() {
    let moreItems = [] as StrOptionItem[];
    let morVal = _.cloneDeep(MoreValue.value);
    while (!_.isEmpty(morVal)) {
      let key = _.first(_.keys(morVal))!;
      let fld = AllFields.value.get(key!);

      // 虽然不知道为什么，但是还是有微小的可能找不到字段定义
      // 那么就虚拟一个字段出来
      if (!fld) {
        fld = fld = {
          name: key,
          title: key,
        } as GridFieldsInput;
      }

      // 找到了定义
      let ks = _.concat([], fld.name) as string[];
      let v: any;
      if (ks.length == 1) {
        v = morVal[ks[0]!];
      } else {
        v = _.pick(morVal, ks);
      }

      // Build item
      let itText;
      if (fld.title) {
        itText = I18n.text(fld.title);
      } else {
        itText = makeFieldUniqKey([], fld.name, fld.uniqKey);
      }
      let itValue = `${v}`;
      moreItems.push({
        text: itText,
        value: itValue,
      });

      // Update for next loop
      morVal = _.omit(morVal, ks);
    }
  }

  return {
    moreItems,
    MajorFields,
    isNeedAdvanceForm,
    MoreValue,
  };
}
