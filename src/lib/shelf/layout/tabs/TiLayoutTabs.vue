<script lang="ts" setup>
  import _ from 'lodash';
  import { ComputedRef, computed, ref, watch } from 'vue';
  import {
    LayoutTabItem,
    LayoutTabsProps,
    TabDisplayItem,
    TiRoadblock,
    TiTabs,
    getLayoutItem,
    useKeep,
  } from '../../../';
  import { CssUtils } from '../../../../core';
  import { COM_TYPE } from './tabs.types';
  import {
    buildLayoutTabBlocks,
    buildLayoutTabsConfig,
    buildTabMain,
    findCurrentTabKey,
  } from './use-layout-tabs';

  defineOptions({
    name: COM_TYPE,
    inheritAttrs: false,
  });

  const props = withDefaults(defineProps<LayoutTabsProps>(), {
    wrapTabs: false,
    tabItemSpace: 'm',
    tabsAt: 'top',
    tabsAlign: 'center',
  });
  const Keep = computed(() => useKeep(props.keepTab));
  console.log(props.keepTab);
  const TabBlocks = computed(() => getLayoutItem({ shown: {} }, props));

  //const $main: Ref<HTMLElement> = ref() as Ref<HTMLElement>;
  // const state = reactive({
  //   shown: {},
  // } as LayoutState);
  const _current_tab_key = ref<string | undefined>();
  //
  // Computed
  //
  const TopClass = computed(() => CssUtils.mergeClassName(props.className));

  let TabDisplayBlocks = computed(() =>
    buildLayoutTabBlocks(TabBlocks.value, _current_tab_key.value)
  );
  const TabsConfig = computed(() =>
    buildLayoutTabsConfig(props, TabDisplayBlocks.value)
  );
  let TabMain = computed(() => {
    return buildTabMain(TabDisplayBlocks.value);
  });
  //
  // Event Handle
  //
  function OnTabChange(item: TabDisplayItem) {
    _current_tab_key.value = item.value;
    Keep.value.save(item.value);
  }
  //
  // Watcher
  //
  watch(
    () => Keep.value,
    () => {
      _current_tab_key.value = findCurrentTabKey(props, Keep.value);
    },
    {
      immediate: true,
    }
  );
</script>
<template>
  <div
    class="ti-layout-tabs"
    :class="TopClass"
    :tabs-at="props.tabsAt">
    <!--======== Head Tabs =======-->
    <header>
      <TiTabs
        v-bind="TabsConfig"
        @change="OnTabChange" />
    </header>
    <!--======== Main Block =======-->
    <main>
      <!----------------------------->
      <template v-if="TabMain">
        <slot :item="TabMain">
          <component
            :is="TabMain.com"
            v-bind="TabMain.config" />
        </slot>
      </template>
      <!----------------------------->
      <TiRoadblock
        v-else
        mode="fit"
        icon="fas-pen-ruler"
        text="No GUI" />
    </main>
  </div>
</template>
<style lang="scss" scoped>
  @use '../../../../assets/style/_all.scss' as *;
  @import './ti-layout-tabs.scss';
</style>
