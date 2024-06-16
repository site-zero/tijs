import _ from 'lodash';
import { computed, ref } from 'vue';
import { GridFieldsInput, makeFieldUniqKey, useValueTranslator } from '../../';
import { I18n, Vars } from '../../../core';
import {
  FilterFeature,
  FilterMoreItem,
  FilterProps,
  FilterValue,
} from './ti-filter-types';
import { joinFieldsList, makeFieldsMap } from './use-filter-fields';

export type FilterEmitter = {
  (event: 'change', payload: FilterValue): void;
  (event: 'search' | 'reset'): void;
  (event: 'change-major', payload: string[]): void;
};

/**
 * 过滤器控件核心逻辑
 *
 * @param props 控件属性
 * @param emit 消息通知
 * @returns 控件主特性
 */
export function useFilter(props: FilterProps): FilterFeature {
  //-----------------------------------------------------
  // 显示除了 Major 字段外的扩展过滤信息
  const moreItems = ref<FilterMoreItem[]>();
  //-----------------------------------------------------
  // 获取转换器
  const tranlator = useValueTranslator(props);
  //-----------------------------------------------------
  const showKeywords = computed(() => {
    return props.keywords ? true : false;
  });
  //-----------------------------------------------------
  /**
   * 都有哪些主字段
   */
  const MajorFields = computed(() => {
    let list = [] as GridFieldsInput[];
    if (props.majorFields) {
      for (let uniqKey of props.majorFields) {
        let fld = AllFieldMap.value.get(uniqKey);
        if (fld) {
          list.push(fld);
        }
      }
    }
    return list;
  });
  //-----------------------------------------------------
  const hasMajorFields = computed(() => {
    return !_.isEmpty(MajorFields.value);
  });
  //-----------------------------------------------------
  /**
   * 主字段包括哪些值
   */
  const MajorData = computed(() => {
    let map = makeFieldsMap(MajorFields.value);
    let keys = [...map.keys()];
    return _.pick(props.value, keys) as Vars;
  });
  //-----------------------------------------------------
  const isNeedAdvanceForm = computed(() => {
    if (props.fields) {
      return MajorFields.value.length < props.fields?.length;
    }
    return false;
  });
  //-----------------------------------------------------
  const AllFieldMap = computed(() => makeFieldsMap(props.fields));
  const AllFields = computed(() => joinFieldsList(props.fields ?? []));
  //-----------------------------------------------------
  /**
   * 去掉主字段，还剩下哪些值
   */
  const MoreData = computed(() => {
    let map = makeFieldsMap(MajorFields.value);
    let keys = [...map.keys()];
    return _.omit(props.value, keys) as Vars;
  });

  async function loadMoreItems() {
    let morItems = [] as FilterMoreItem[];
    let morVal = _.cloneDeep(MoreData.value);
    while (!_.isEmpty(morVal)) {
      let key = _.first(_.keys(morVal))!;
      let fld = AllFieldMap.value.get(key!);

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
      let uniqKey = makeFieldUniqKey([], fld.name, fld.uniqKey);
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
      let itValue = await tranlator(uniqKey, v);
      morItems.push({
        uniqKey,
        name: fld.name ?? uniqKey,
        title: itText,
        value: itValue,
      });

      // Update for next loop
      morVal = _.omit(morVal, ks);
    }

    // 记录一下改动
    moreItems.value = morItems;
  }
  //-----------------------------------------------------
  const hasMoreData = computed(() => {
    return !_.isEmpty(MoreData.value);
  });
  //-----------------------------------------------------
  // Output Features
  //-----------------------------------------------------
  return {
    showKeywords,
    AllFields,

    MajorFields,
    moreItems,

    hasMajorFields,
    hasMoreData,
    isNeedAdvanceForm,

    MajorData,
    MoreData,

    loadMoreItems,
  };
}
