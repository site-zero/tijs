<script lang="ts" setup>
  import { computed, ref, watch } from 'vue';
  import {
    BlockEvent,
    TiBlock,
    TiLayoutTabs,
    TiRoadblock,
    TiTabs,
    TiLayoutGrid,
    getLayoutItem,
    useKeep,
  } from '../../../';
  import { CssUtils } from '../../../../core';
  import { getLogger } from '../../../../core/log/ti-log';
  import { COM_TYPES } from '../../../lib-com-types';
  import { TabDisplayItem } from '../layout-types';
  import { LayoutTabsProps, TabChangeEvent } from './ti-layout-tabs-types';
  import {
    autoSetCurrentTablKey,
    buildLayoutTabBlocks,
    buildLayoutTabsConfig,
    buildMainTab,
  } from './use-layout-tabs';
  //-------------------------------------------------
  const COM_TYPE = COM_TYPES.LayoutTabs;
  const log = getLogger(COM_TYPE);
  //-------------------------------------------------
  const emit = defineEmits<{
    (eventName: 'tab-change', payload: TabChangeEvent): void;
    (event: 'block', payload: BlockEvent): void;
  }>();
  //-------------------------------------------------
  const props = withDefaults(defineProps<LayoutTabsProps>(), {
    wrapTabs: false,
    tabItemSpace: 'm',
    tabsAt: 'top',
    tabsAlign: 'center',
  });
  //-------------------------------------------------
  const Keep = computed(() => useKeep(props.keepTab));
  //-------------------------------------------------
  const TabBlocks = computed(() => getLayoutItem({ shown: {} }, props));
  //-------------------------------------------------
  const _current_tab_key = ref<string | undefined>();
  //-------------------------------------------------
  const TopClass = computed(() => CssUtils.mergeClassName(props.className));
  //-------------------------------------------------
  let TabDisplayBlocks = computed(() =>
    buildLayoutTabBlocks(TabBlocks.value, _current_tab_key.value)
  );
  //-------------------------------------------------
  const TabsConfig = computed(() =>
    buildLayoutTabsConfig(props, TabDisplayBlocks.value)
  );
  //-------------------------------------------------
  let MainTab = computed(() => {
    return buildMainTab(TabDisplayBlocks.value);
  });
  //-------------------------------------------------
  function OnBlockEventHappen(event: BlockEvent) {
    emit('block', event);
  }
  //-------------------------------------------------
  function OnTabChange(item: TabDisplayItem, old?: TabDisplayItem) {
    _current_tab_key.value = item.value;
    Keep.value.save(item.value);
    emit('tab-change', {
      to: item,
      from: old,
    });
  }
  //-------------------------------------------------
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
          to: {
            className: MainTab.value.className,
            current: true,
            index: MainTab.value.index || 0,
            icon: MainTab.value.icon,
            text: MainTab.value.title,
            value: MainTab.value.uniqKey,
          },
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
  //-------------------------------------------------
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
          <TiBlock
            v-if="'block' == MainTab.type"
            block-fit="cover"
            v-bind="MainTab.propsForBlock"
            :class-name="MainTab.className"
            :main-class="MainTab.mainClass"
            :main-style="MainTab.mainStyle"
            @happen="OnBlockEventHappen" />
          <!-- 格子布局-->
          <TiLayoutGrid
            v-else-if="'grid' == MainTab.type"
            v-bind="MainTab.propsForLayoutGrid"
            :schema="schema"
            @block="emit('block', $event)" />
          <!-- 标签布局-->
          <TiLayoutTabs
            v-else-if="'tabs' == MainTab.type"
            v-bind="MainTab.propsForLayoutTabs"
            :schema="schema"
            @block="emit('block', $event)" />
          <!-- 未知布局-->
          <div v-else>
            Unknown layout item type:
            <pre>{{ MainTab }}</pre>
          </div>
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
