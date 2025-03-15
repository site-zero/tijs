import _ from 'lodash';
import { computed, ref } from 'vue';
import { ListSelectEmitInfo, TagItem } from '../../';
import { TableRowID, Vars } from '../../../_type';
import { Util } from '../../../core';
import { useDict, useReadonly } from '../../_features';
import { useValueOptions } from '../box2/use-value-options';
import {
  MultiDroplistEmitter,
  MultiDroplistProps,
} from './ti-multi-droplist-types';

export type MultiDroplistApi = ReturnType<typeof useMultiDroplist>;

export function useMultiDroplist(
  props: MultiDroplistProps,
  emit: MultiDroplistEmitter
) {
  console.log('useMultiDroplist');
  //-----------------------------------------------------
  // 数据模型
  //-----------------------------------------------------
  const _options_data = ref<Vars[]>();
  const _readonly = computed(() => useReadonly(props));
  const _dict = useDict(props)!;
  const _options = useValueOptions({ dict: _dict, _options_data }, props);
  const _items = ref<TagItem[]>();
  const _it_values = ref<TableRowID[]>();

  //-----------------------------------------------------
  // 计算属性
  //-----------------------------------------------------
  const TagItems = computed(() => _items.value);
  //-----------------------------------------------------
  const OptionsData = computed(() => {
    return _options.OptionsData.value;
  });
  //-----------------------------------------------------
  const hasTips = computed(() => (_options_data.value ? true : false));
  //-----------------------------------------------------
  const TagValues = computed(() => {
    if (_it_values.value) {
      return _it_values.value;
    }
    let vals: TableRowID[] = [];
    if (props.value) {
      vals = _.concat([], props.value);
    }
    return vals;
  });
  //-----------------------------------------------------
  // 同步方法
  //-----------------------------------------------------
  function removeItem(it: TagItem) {
    let vals: TableRowID[] = [];
    for (let val of TagValues.value) {
      if (val != it.value) {
        vals.push(val);
      }
    }
    tryNotifyChange(vals.length == 0 ? null : vals);
  }
  //-----------------------------------------------------
  function clearOptionsData() {
    _options_data.value = undefined;
    _it_values.value = undefined;
  }
  //-----------------------------------------------------
  function tryNotifyChange(
    vals: TableRowID[] | undefined | null = _it_values.value
  ) {
    console.log('tryNotifyChange', vals);
    if (_.isUndefined(vals)) {
      return;
    }
    if (_.isEqual(vals, props.value)) {
      return;
    }
    emit('change', vals ?? null);
  }
  //-----------------------------------------------------
  // 异步方法
  //-----------------------------------------------------
  async function onOptionSelect(payload: ListSelectEmitInfo) {
    let ids = Util.mapTruthyKeys(payload.checkedIds);
    //console.log('onOptionSelect', payload.checkedIds);
    _it_values.value = ids;
    await _load_items(ids);
  }
  //-----------------------------------------------------
  async function cancelChange() {
    clearOptionsData();
    await onPropsValueChange();
  }
  //-----------------------------------------------------
  async function openOptions() {
    await _options.reloadOptioinsData();
  }
  //-----------------------------------------------------
  async function _load_items(vals?: TableRowID[]) {
    let items: TagItem[] = [];
    // 逐个值来处理
    if (vals) {
      for (let val of vals) {
        let it = await _dict.getStdItem(val);
        if (!it) {
          console.warn('Fail to found item for value=${val}');
          continue;
        }
        items.push({
          icon: it.icon,
          text: it.text,
          value: it.value,
          tip: it.tip,
        });
      }
    }
    // 设置
    _items.value = items.length > 0 ? items : undefined;
  }
  //-----------------------------------------------------
  async function onPropsValueChange() {
    console.log('onPropsValueChange', props.value);
    _load_items(TagValues.value);
  }
  //-----------------------------------------------------
  // 输出特性
  //-----------------------------------------------------
  return {
    // 计算属性
    TagItems,
    OptionsData,
    hasTips,
    isReadonly: computed(() => _readonly.value.isReadonly({})),
    TagValues,

    // 同步方法
    removeItem,
    clearOptionsData,
    tryNotifyChange,

    // 异步方法
    onOptionSelect,
    cancelChange,
    openOptions,
    onPropsValueChange,
  };
}
