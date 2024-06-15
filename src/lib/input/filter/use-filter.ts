import _ from 'lodash';
import { computed, ref } from 'vue';
import { GridFieldsInput, makeFieldUniqKey } from '../../';
import { ActionBarItem, I18n, Vars } from '../../../core';
import { FilterMoreItem, FilterProps, FilterValue } from './ti-filter-types';
import { openAdvanceForm } from './use-filter-advance';
import { useFilterCustomization } from './use-filter-customize';
import { genIsMajor, makeFieldsMap } from './use-filter-fields';
import { useValueTranslator } from './use-value-translator';

export type FilterEmitter = {
  (event: 'change', payload: FilterValue): void;
  (event: 'search' | 'reset'): void;
  (event: 'change-major', payload: string[]): void;
};

export function useFilter(props: FilterProps, emit: FilterEmitter) {
  // 显示除了 Major 字段外的扩展过滤信息
  const moreItems = ref<FilterMoreItem[]>();

  // 获取转换器
  const tranlator = useValueTranslator(props);

  const showKeywords = computed(() => {
    return props.keywords ? true : false;
  });

  // 准备一个判断字段是否是 major 的方法，以便归纳时调用
  const _is_major = computed(() => genIsMajor(props));

  /**
   * 都有哪些主字段
   */
  const MajorFields = computed(() => {
    let list = [] as GridFieldsInput[];
    if (props.majorFields) {
      for (let uniqKey of props.majorFields) {
        let fld = AllFields.value.get(uniqKey);
        if (fld) {
          list.push(fld);
        }
      }
    }
    return list;
  });

  const hasMajorFields = computed(() => {
    return !_.isEmpty(MajorFields.value);
  });

  /**
   * 主字段包括哪些值
   */
  const MajorData = computed(() => {
    let map = makeFieldsMap(MajorFields.value);
    let keys = [...map.keys()];
    return _.pick(props.value, keys) as Vars;
  });

  const isNeedAdvanceForm = computed(() => {
    if (props.fields) {
      return MajorFields.value.length < props.fields?.length;
    }
    return false;
  });

  const AllFields = computed(() => makeFieldsMap(props.fields));

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

  const hasMoreData = computed(() => {
    return !_.isEmpty(MoreData.value);
  });

  /**
   * 获取过滤器相关操作命令
   */
  const ActionItems = computed(() => {
    let items = [
      {
        icon: 'zmdi-search',
        text: 'i18n:search',
        action: 'search',
      },
      {
        icon: 'zmdi-time-restore',
        text: 'i18n:reset',
        action: 'reset',
      },
    ] as ActionBarItem[];

    if (props.canCustomizedMajor) {
      items.push({
        icon: 'zmdi-toys',
        text: 'i18n:ti-filter-customize',
        action: () => {
          useFilterCustomization(props, emit);
        },
      });
    }

    if (isNeedAdvanceForm.value) {
      items.push({
        icon: 'zmdi-traffic',
        text: 'i18n:ti-filter-advance',
        action: () => {
          openAdvanceForm(props, emit);
        },
      });
    }

    if (props.moreActions) {
      items.push(...props.moreActions);
    }
    return items;
  });

  return {
    showKeywords,

    MajorFields,
    moreItems,
    ActionItems,

    hasMajorFields,
    hasMoreData,
    isNeedAdvanceForm,

    MajorData,
    MoreData,

    loadMoreItems,
  };
}
