<script lang="ts" setup>
  import { computed, onMounted, watch } from 'vue';
  import { TagItem, TiTags } from '../../';
  import { CssUtils } from '../../../core';
  import { SorterProps, SorterValue } from './ti-sorter-types';
  import { SorterItem, useSorter } from './use-sorter';
  //-----------------------------------------------------
  const emit = defineEmits<{
    (event: 'change', payload: SorterValue): void;
  }>();
  //-----------------------------------------------------
  const props = withDefaults(defineProps<SorterProps>(), {
    colorType: 'info',
    canSetup: true,
  });
  //-----------------------------------------------------
  const Sorter = computed(() => useSorter(props));
  //-----------------------------------------------------
  const TopClass = computed(() => CssUtils.mergeClassName(props.className));
  //-----------------------------------------------------
  function onRemoveItem(it: TagItem) {
    let sv = Sorter.value.removeValue(it as SorterItem);
    emit('change', sv);
  }
  //-----------------------------------------------------
  function onToggleItem(it: TagItem) {
    let sv = Sorter.value.toggleValue(it as SorterItem);
    emit('change', sv);
  }
  //-----------------------------------------------------
  async function onSetupSortFields() {
    let re = await Sorter.value.onSetupSorterValue();
    // 用户取消
    if (!re) {
      return;
    }
    // 更新值
    emit('change', re);
  }
  //-----------------------------------------------------
  watch(
    () => props.options,
    () => {
      Sorter.value.loadOptions();
    },
    {
      immediate: true,
    }
  );
  //-----------------------------------------------------
  onMounted(() => {
    if (props.exportApi) {
      props.exportApi({
        onSetup: onSetupSortFields,
      });
    }
  });
  //-----------------------------------------------------
</script>
<template>
  <div
    class="ti-sorter"
    :class="TopClass">
    <div class="part-items">
      <TiTags
        :title="props.title"
        :value="Sorter.SorterItems.value"
        :editable="true"
        :tag-clickable="true"
        :default-tag-type="props.colorType"
        @remove="onRemoveItem"
        @click-tag="onToggleItem" />
    </div>
    <div
      v-if="props.canSetup"
      class="part-setup"
      @click="onSetupSortFields">
      <a><i class="zmdi zmdi-settings"></i></a>
    </div>
  </div>
</template>
<style lang="scss">
  @use '../../../assets/style/_all.scss' as *;
  @import './ti-sorter.scss';
</style>
