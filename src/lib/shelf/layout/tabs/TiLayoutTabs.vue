<script lang="ts" setup>
  import { computed, ref, watch } from 'vue';
  import {
    BlockEvent,
    TiBlock,
    TiLayoutGrid,
    TiLayoutTabs,
    TiRoadblock,
    TiTabs,
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
    buildLayoutTabsConfig,
    buildOneTab,
  } from './use-layout-tabs';
  //-------------------------------------------------
  const COM_TYPE = COM_TYPES.LayoutTabs;
  const log = getLogger(COM_TYPE);
  //-------------------------------------------------
  const emit = defineEmits<{
    (eventName: 'tab-change', payload: TabChangeEvent): void;
    (event: 'block', payload: BlockEvent): void;
    (event: '_sub_block', payload: BlockEvent): void;
  }>();
  //-------------------------------------------------
  const props = withDefaults(defineProps<LayoutTabsProps>(), {
    wrapTabs: false,
    tabItemSpace: 'm',
    tabsAt: 'top',
    tabsAlign: 'center',
    defaultTab: 0,
  });
  //-------------------------------------------------
  const Keep = computed(() => useKeep(props.keepTab));
  //-------------------------------------------------
  const TabBlocks = computed(() => getLayoutItem({ shown: {} }, props));
  //-------------------------------------------------
  const _current_tab_key = ref<string | undefined>();
  //-------------------------------------------------
  const TopClass = computed(() => CssUtils.mergeClassName(props.className));
  const MainClass = computed(() => CssUtils.mergeClassName(props.mainClass));
  //-------------------------------------------------
  const TabsConfig = computed(() =>
    buildLayoutTabsConfig(props, TabBlocks.value)
  );
  //-------------------------------------------------
  let MainTab = computed(() => {
    return buildOneTab(TabBlocks.value, _current_tab_key.value);
  });
  //-------------------------------------------------
  function OnBlockEventHappen(event: BlockEvent) {
    //console.log('OnBlockEventHappen', event);
    if (props.subLayout) {
      emit('_sub_block', event);
    } else {
      emit('block', event);
    }
  }
  //-------------------------------------------------
  function OnTabChange(item: TabDisplayItem) {
    // if ('Bunya-GUI-layout-EdiViewer-Tabs' == props.keepTab) {
    //   console.log('OnTabChange', item);
    // }
    _current_tab_key.value = item.value;
    Keep.value.save(item.value);
  }
  //-------------------------------------------------
  watch(
    () => [Keep.value, TabBlocks.value, props.defaultTab],
    () => {
      //console.log('autoSetCurrentTablKey');
      autoSetCurrentTablKey(
        _current_tab_key,
        TabBlocks,
        Keep,
        props.defaultTab
      );
      if (!MainTab.value) {
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
  const _emitted_tab_key = ref<string | undefined>();
  watch(
    () => MainTab.value,
    () => {
      // if ('Bunya-GUI-layout-EdiViewer-Tabs' == props.keepTab) {
      //   console.log('MainTabChanged', MainTab.value);
      // }
      if (MainTab.value && _emitted_tab_key.value != MainTab.value.uniqKey) {
        // if ('Bunya-GUI-layout-EdiViewer-Tabs' == props.keepTab) {
        //   console.log('emit MainTabChange', MainTab.value);
        // }
        emit('tab-change', {
          to: {
            className: MainTab.value.blockClass,
            current: true,
            index: MainTab.value.index || 0,
            icon: MainTab.value.icon,
            text: MainTab.value.title,
            value: MainTab.value.uniqKey,
          },
        });
        _emitted_tab_key.value = MainTab.value.uniqKey;
      }
    },
    { immediate: true }
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
        :value="_current_tab_key"
        @change="OnTabChange" />
    </header>
    <!--======== Main Block =======-->
    <main :style="props.mainStyle" :class="MainClass">
      <div class="tabs-main-block-con">
        <!----------------------------->
        <template v-if="MainTab">
          <slot :main="MainTab">
            <TiBlock
              v-if="'block' == MainTab.type"
              block-fit="cover"
              overflow-mode="cover"
              v-bind="MainTab.propsForBlock"
              :class-name="MainTab.blockClass"
              :main-class="MainTab.mainClass"
              :main-style="MainTab.mainStyle"
              @happen="OnBlockEventHappen" />
            <!-- 格子布局-->
            <TiLayoutGrid
              v-else-if="'grid' == MainTab.type"
              v-bind="MainTab.propsForLayoutGrid"
              :sub-layout="true"
              :schema="schema"
              @_sub_block="emit('block', $event)" />
            <!-- 标签布局-->
            <TiLayoutTabs
              v-else-if="'tabs' == MainTab.type"
              v-bind="MainTab.propsForLayoutTabs"
              :sub-layout="true"
              :schema="schema"
              @_sub_block="emit('block', $event)" />
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
      </div>
    </main>
  </div>
</template>
<style lang="scss" scoped>
  @use './ti-layout-tabs.scss';
</style>
