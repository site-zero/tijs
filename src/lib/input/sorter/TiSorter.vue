<script lang="ts" setup>
  import { computed, watch } from 'vue';
  import { TiLabel } from '../../';
  import { I18n } from '../../../core';
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
  function onRemoveItem(it: SorterItem) {
    let sv = Sorter.value.removeValue(it);
    emit('change', sv);
  }
  //-----------------------------------------------------
  function onToggleItem(it: SorterItem) {
    let sv = Sorter.value.toggleValue(it);
    emit('change', sv);
  }
  //-----------------------------------------------------
  async function onSetupSortFields() {
    let re = await Sorter.value.onSetup();
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
</script>
<template>
  <div class="ti-sorter">
    <div class="part-items">
      <template v-if="!Sorter.isEmpty.value">
        <TiLabel
          v-for="it in Sorter.SorterItems.value"
          class="show-border"
          :class="it.className"
          :value="it.text"
          :clickable="true"
          prefix-icon="zmdi-close"
          :prefix-icon-clickable="true"
          :suffix-icon="it.sortIcon"
          @click-prefix-icon="onRemoveItem(it)"
          @click="onToggleItem(it)" />
      </template>
      <div
        v-else
        class="as-empty">
        <i class="zmdi zmdi-sort-asc"></i>
        {{ I18n.get('ti-sorter-empty') }}
      </div>
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
