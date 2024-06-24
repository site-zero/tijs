<script lang="ts" setup>
  import { computed, ref, watch } from 'vue';
  import { TiRoadblock, TiTabs, getLayoutItem, useKeep } from '../../../';
  import { CssUtils } from '../../../../core';
  import { getLogger } from '../../../../core/log/ti-log';
  import { COM_TYPES } from '../../../lib-com-types';
  import { TabDisplayItem } from '../layout-types';
  import { LayoutTabsProps } from './ti-layout-tabs-types';
  import {
    autoSetCurrentTablKey,
    buildLayoutTabBlocks,
    buildLayoutTabsConfig,
    buildMainTab,
  } from './use-layout-tabs';

  const COM_TYPE = COM_TYPES.LayoutTabs;
  const log = getLogger(COM_TYPE);

  defineOptions({
    inheritAttrs: false,
  });

  const props = withDefaults(defineProps<LayoutTabsProps>(), {
    wrapTabs: false,
    tabItemSpace: 'm',
    tabsAt: 'top',
    tabsAlign: 'center',
  });
  const Keep = computed(() => useKeep(props.keepTab));

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
  let MainTab = computed(() => {
    return buildMainTab(TabDisplayBlocks.value);
  });
  //
  // Event Handle
  //
  const emit = defineEmits<{
    (
      eventName: 'tab-change',
      current: TabDisplayItem,
      old?: TabDisplayItem
    ): void;
  }>();
  function OnTabChange(item: TabDisplayItem, old?: TabDisplayItem) {
    _current_tab_key.value = item.value;
    Keep.value.save(item.value);
    emit('tab-change', item, old);
  }
  //
  // Watcher
  //
  watch(
    () => [Keep.value, TabBlocks.value, props.defaultTab],
    () => {
      autoSetCurrentTablKey(
        _current_tab_key,
        TabBlocks,
        Keep,
        props.defaultTab
      );
      if (MainTab.value) {
        emit('tab-change', {
          className: MainTab.value.item.className,
          current: true,
          index: MainTab.value.item.index || 0,
          icon: MainTab.value.item.icon,
          text: MainTab.value.item.title,
          value: MainTab.value.item.uniqKey,
        });
      } else {
        log.warn(
          `Fail to evel MainTab: [${_current_tab_key.value}] defaultTab=${props.defaultTab}`
        );
      }
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
      <template v-if="MainTab">
        <slot :main="MainTab">
          <component
            :is="MainTab.com"
            v-bind="MainTab.config" />
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
./ti-layout-tabs-types../layout-types
