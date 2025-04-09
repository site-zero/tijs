<script setup lang="ts">
  import _ from 'lodash';
  import { computed, onMounted, ref, watch } from 'vue';
  import { TagItem, TiTags, useDict } from '../../';
  import { isTableRowID, TableRowID } from '../../../_type/core-types';
  import { anyToStr } from '../../../core/text/ti-str';
  import { LabelTagsProps } from './ti-label-tags-types';
  //--------------------------------------------
  const props = withDefaults(defineProps<LabelTagsProps>(), {});
  //--------------------------------------------
  const TagsProps = computed(() => {
    return _.omit(props, [
      'value',
      'options',
      'dictVars',
      'getIcon',
      'getText',
      'getTip',
      'getValue',
    ]);
  });
  //--------------------------------------------
  const _tag_items = ref<TagItem[]>([]);
  //--------------------------------------------
  const _dict = computed(() => useDict(props));
  //--------------------------------------------
  async function loadTagItems(): Promise<TagItem[]> {
    if (
      _.isNil(props.value) ||
      (_.isString(props.value) && !_.trim(props.value))
    ) {
      return [];
    }
    // 首先将标签值转换为数组
    let vals: TableRowID[] = [];
    if (_.isArray(props.value)) {
      for (let v of props.value) {
        if (isTableRowID(v)) {
          vals.push(v as TableRowID);
        } else {
          vals.push(anyToStr(v));
        }
      }
    }
    // 直接拆分数组
    else {
      vals = props.value.split(',').map((v: string) => v.trim());
    }

    // 准备转换为标签对象
    let items: TagItem[] = [];

    // 如果声明了字典，则用字典翻译值
    for (let v of vals) {
      if (_dict.value) {
        let it = await _dict.value.getStdItem(v);
        if (it) {
          items.push(it.toOptionItem());
          continue;
        }
      }
      items.push(val_to_item(v));
    }

    // 搞定
    return items;
  }
  //--------------------------------------------
  function val_to_item(val: any): TagItem {
    return {
      text: _.startCase(anyToStr(val)),
      value: val,
    };
  }
  //--------------------------------------------
  watch(
    () => [props.value, props.options],
    async () => {
      _tag_items.value = await loadTagItems();
    }
  );
  //--------------------------------------------
  onMounted(async () => {
    _tag_items.value = await loadTagItems();
  });
  //--------------------------------------------
</script>

<template>
  <TiTags
    v-bind="TagsProps"
    :value="_tag_items" />
</template>
