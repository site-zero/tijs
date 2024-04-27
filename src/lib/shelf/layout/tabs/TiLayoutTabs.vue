<script lang="ts" setup>
  import _ from 'lodash';
  import { Ref, computed, reactive, ref, watch } from 'vue';
  import { LayoutState, LayoutTabsProps, TabInfo, useKeep } from '../../../';
  import { CssUtils } from '../../../../core';
  import { COM_TYPE } from './tabs.types';
  import { findCurrentTab, getLayoutTabItems } from './use-layout-tabs';

  defineOptions({
    name: COM_TYPE,
    inheritAttrs: true,
  });

  const props = defineProps<LayoutTabsProps>();
  const $main: Ref<HTMLElement> = ref() as Ref<HTMLElement>;
  const state = reactive({
    shown: {},
  } as LayoutState);
  const _current_tab = ref<TabInfo | undefined>(findCurrentTab(props));
  let emit = defineEmits<(current: TabInfo, old?: TabInfo) => void>();
  //
  // Computed
  //
  const TopClass = computed(() => CssUtils.mergeClassName(props.className));
  const Keep = useKeep(props.keepTab);
  let TabItems = computed(() => getLayoutTabItems(_current_tab, props));
  let CurrentTabItem = computed(() =>
    _.find(TabItems.value, (it) => it.current)
  );
  //
  // Event Handle
  //
  //
  // Watcher
  //
  watch(
    () => _current_tab.value,
    (tab, old) => {
      if (tab && !_.isEqual(tab, old)) {
        state.shown = {
          [tab.name || `Tab-${tab.index}`]: true,
        };
      }
    }
  );
</script>
<template>
  <div class="ti-layout-tabs">
    <!--======== Head Tabs =======-->
    <header></header>
    <!--======== Main Block =======-->
    <main></main>
  </div>
</template>
<style lang="scss" scoped>
  @import './ti-layout-tabs.scss';
</style>
