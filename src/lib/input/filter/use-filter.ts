import _ from 'lodash';
import { computed, ref } from 'vue';
import { GridFieldsInput, useValueTranslator, useVisibility } from '../../';
import { Vars, makeFieldUniqKey } from '../../../_type';
import { Util } from '../../../core';
import {
  FilterFeature,
  FilterMoreItem,
  FilterProps,
  FilterValue,
} from './ti-filter-types';
import { openAdvanceForm } from './use-filter-advance';
import {
  getFieldsNames,
  joinFieldsList,
  joinFieldsTitle,
  makeFieldsMap,
} from './use-filter-fields';
import { useSetupMajorFields } from './use-filter-setup-major';

export type FilterEmitter = {
  (event: 'change', payload: FilterValue): void;
  (event: 'search' | 'reset' | 'reset-major'): void;
  (event: 'change-major', payload: string[]): void;
};

/**
 * 过滤器控件核心逻辑
 *
 * @param props 控件属性
 * @param emit 消息通知
 * @returns 控件主特性
 */
export function useFilter(
  props: FilterProps,
  emit: FilterEmitter
): FilterFeature {
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
        let flds = AllFieldMap.value.get(uniqKey);
        if (flds && flds.length > 0) {
          list.push(...flds);
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
    let names = getFieldsNames(MajorFields.value);
    return _.pick(props.value, names) as Vars;
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
    let names = getFieldsNames(MajorFields.value);
    return _.omit(props.value, names) as Vars;
  });

  function useDiffData(diff: Vars) {
    let val = _.cloneDeep(props.value ?? {});
    //console.log(diff, val);
    // 处理 more 字段
    if (!_.isUndefined(diff.__more)) {
      let moreKeys = _.keys(MoreData.value);
      let diffKeys = _.keys(diff.__more);
      let removeKeys = _.without(moreKeys, ...diffKeys);
      val = _.omit(val, removeKeys);

      diff = _.omit(diff, '__more');
    }
    // 获取一下需要删除哪些字段
    _.assign(val, diff);

    return val;
  }

  async function loadMoreItems() {
    let morItems = [] as FilterMoreItem[];
    let morVal = Util.filterRecordNilValue(MoreData.value);

    /**
     * 这里的逻辑是这样的，
     * 循环 morVal 对象，假设它有很多键 {A,B,C,D,E}
     * 第一次循环，通过 A 找到了一个字段，这个字段是 [A,B,C] 的名称组合
     * 那么，本次循环将会通过 _.omit 吃掉 [A,B,C], 这样下次循环就只面对 {D,E}
     * 我认为这个方法唯一的问题就是，效率可能不是那么高
     * 不过所幸，这个函数似乎也不需要那么高的效率
     */
    while (!_.isEmpty(morVal)) {
      let key = _.first(_.keys(morVal))!;
      let flds = AllFieldMap.value.get(key!);

      // 虽然不知道为什么，但是还是有微小的可能找不到字段定义
      // 那么就虚拟一个字段出来
      if (!flds || _.isEmpty(flds)) {
        flds = [
          {
            name: key,
            title: key,
          } as GridFieldsInput,
        ];
      }

      // 循环处理一下所有的字段
      // 选择第一个可以显示的字段，应为如果是多个字段，那么一定是多个同名字段
      let field: GridFieldsInput | undefined;
      for (let fld of flds) {
        // 使用可见性
        let visibility = useVisibility(fld, 'use-filter.loadMoreItems');
        if (!visibility.isHidden(props.value ?? {})) {
          field = fld;
          break;
        }
      }

      // 虽然不太可能，但是防守一下
      if (!field) {
        throw `虽然不太可能，但是防守一下: ${key}`;
      }

      // 获取字段的唯一键，加入映射，以便去重复
      let uniqKey = makeFieldUniqKey([], field.name, field.uniqKey);

      // 获取扩展字段的值：因为要传递给 MajorForm 里的 __more
      // 而且通常是作为 TiTags 来显示的，因此需要名称和值（翻译后的）
      let ks = getFieldsNames(flds);
      let v: any;
      if (ks.length == 1) {
        v = morVal[ks[0]!];
      } else {
        v = _.pick(morVal, ks);
      }

      // 准备显示的标题
      let itText = joinFieldsTitle(flds);

      // 建立标签项目
      let itValue = await tranlator(uniqKey, v);
      morItems.push({
        uniqKey,
        name: field.name ?? uniqKey,
        title: itText,
        value: itValue,
      });

      // Update for next loop
      morVal = _.omit(morVal, ks);
    } // ~ end while

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

    useDiffData,
    loadMoreItems,

    setupMajorFields: async () => {
      await useSetupMajorFields(props, emit);
    },
    openAdvanceSettings: async () => {
      await openAdvanceForm(props, emit);
    },
  };
}
