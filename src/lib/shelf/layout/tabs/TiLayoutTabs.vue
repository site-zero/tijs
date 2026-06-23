<script lang="ts" setup>
  import {
    BlockEvent,
    CssUtils,
    TiBlock,
    TiRoadblock,
    TiTabs,
    TiTabsApi,
    getLayoutItem,
    isAsyncFunc,
    useKeep,
  } from "@site0/tijs";
  import { computed, onMounted, ref, useTemplateRef, watch } from "vue";
  import { TabDisplayItem } from "../layout-types";
  import {
    TabChangeEvent,
    TabsLayoutApi,
    TabsLayoutProps,
  } from "./ti-layout-tabs-types";
  import {
    autoSetCurrentTablKey,
    buildLayoutTabsConfig,
    buildOneTab,
  } from "./use-layout-tabs";
  //-------------------------------------------------
  import _ from "lodash";
  import { TiLayoutGrid } from "../grid/ti-layout-grid-index";
  //-------------------------------------------------
  const $tabs = useTemplateRef<TiTabsApi>("tabs");
  //-------------------------------------------------
  const emit = defineEmits<{
    (eventName: "tab-change", payload: TabChangeEvent): void;
    (event: "block", payload: BlockEvent): void;
    (event: "_sub_block", payload: BlockEvent): void;
  }>();

  //-------------------------------------------------
  const props = withDefaults(defineProps<TabsLayoutProps>(), {
    wrapTabs: false,
    tabItemSpace: "m",
    tabsAt: "top",
    tabsAlign: "center",
    defaultTab: 0,
  });
  //const debug = "local: GUI-CIVEditor-Layout-Tab" == props.keepTab;
  const debug = false;
  //-------------------------------------------------
  const Keep = computed(() => useKeep(props.keepTab));
  //-------------------------------------------------
  const TabBlocks = computed(() => {
    if (debug) {
      console.log("TabBlocks : getLayoutItem");
    }
    try {
      return getLayoutItem({ shown: {} }, props, (item) => {
        item.propsForBlock = _.omit(
          item.propsForBlock,
          "title",
          "icon",
          "blockFit",
          "actions",
          "actionVars",
          "actionClass",
          "actionBar",
          "actionStyle"
        );

        _.assign(item.blockClass, {
          "cover-parent": true,
          "fit-parent": false,
        });
        return item;
      });
    } finally {
      if (debug) {
        console.log("TabBlocks : computed done");
      }
    }
  });
  //-------------------------------------------------
  const _current_tab_key = ref<string | undefined>();
  //-------------------------------------------------
  const TopClass = computed(() => CssUtils.mergeClassName(props.className));
  const TopStyle = computed(() => CssUtils.toStyle(props.style));
  const MainClass = computed(() => CssUtils.mergeClassName(props.mainClass));
  //-------------------------------------------------
  const TabsConfig = computed(() =>
    buildLayoutTabsConfig(props, TabBlocks.value)
  );
  //-------------------------------------------------
  let MainTab = computed(() => {
    if (debug) {
      console.log("MainTab : buildOneTab", _current_tab_key.value);
    }
    try {
      return buildOneTab(TabBlocks.value, _current_tab_key.value, debug);
    } finally {
      if (debug) {
        console.log("MainTab : buildOneTab done");
      }
    }
  });
  //-------------------------------------------------
  function OnBlockEventHappen(event: BlockEvent) {
    //console.log('OnBlockEventHappen', event);
    if (props.subLayout) {
      emit("_sub_block", event);
    } else {
      emit("block", event);
    }
  }
  //-------------------------------------------------
  async function OnTabChange(item: TabDisplayItem) {
    // 有守卫判断
    if (props.beforeTabChange) {
      let from = _current_tab_key.value;
      let to = item.value;
      let payload = makeTabChangeEvent(from, to);
      let can_change = false;
      // 异步判断
      if (isAsyncFunc(props.beforeTabChange)) {
        can_change = await props.beforeTabChange(payload);
      }
      // 同步判断
      else {
        can_change = props.beforeTabChange(payload) as boolean;
      }
      if (!can_change) {
        return;
      }
    }
    changeTab(item.value);
  }
  //-------------------------------------------------
  function changeTab(tabName: string) {
    _current_tab_key.value = tabName;
    Keep.value.save(tabName);
  }
  //-------------------------------------------------
  function makeTabChangeEvent(
    from: string | undefined,
    to: string
  ): TabChangeEvent {
    let fromItem = from ? $tabs.value?.getTabItemByValue(from) : undefined;
    let toItem = $tabs.value?.getTabItemByValue(to);
    return {
      to: toItem!,
      from: fromItem,
    };
  }
  //-------------------------------------------------
  defineExpose<TabsLayoutApi>({
    changeTab,
  });
  //-------------------------------------------------
  watch(
    () => [Keep.value, TabBlocks.value, props.defaultTab],
    () => {
      if (debug) {
        console.log("autoSetCurrentTablKey");
      }
      autoSetCurrentTablKey(
        _current_tab_key,
        TabBlocks,
        Keep,
        props.defaultTab
      );
      // if (!MainTab.value) {
      //   if (debug)
      //     console.log(
      //       `Fail to evel MainTab: [${_current_tab_key.value}] defaultTab=${props.defaultTab}`
      //     );
      // }
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
        let payload = makeTabChangeEvent(
          _emitted_tab_key.value,
          MainTab.value.uniqKey
        );
        emit("tab-change", payload);
        // emit("tab-change", {
        //   to: {
        //     className: MainTab.value.blockClass,
        //     current: true,
        //     index: MainTab.value.index || 0,
        //     icon: MainTab.value.icon,
        //     text: MainTab.value.title,
        //     value: MainTab.value.uniqKey,
        //   },
        // });
        _emitted_tab_key.value = MainTab.value.uniqKey;
      }
    }
  );
  //-------------------------------------------------
  onMounted(() => {
    autoSetCurrentTablKey(_current_tab_key, TabBlocks, Keep, props.defaultTab);
    if (_current_tab_key.value) {
      let payload = makeTabChangeEvent(undefined, _current_tab_key.value);
      emit("tab-change", payload);
    }
  });
  //-------------------------------------------------
</script>
<template>
  <div
    class="ti-layout-tabs"
    :class="TopClass"
    :style="TopStyle"
    :tabs-at="props.tabsAt">
    <!--======== Head Tabs =======-->
    <header>
      <TiTabs
        ref="tabs"
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
              v-bind="MainTab.propsForBlock?.comConf"
              :grid-style="MainTab.mainStyle"
              className="cover-parent"
              :sub-layout="true"
              :schema="schema"
              @_sub_block="emit('block', $event)" />
            <!-- 标签布局-->
            <TiLayoutTabs
              v-else-if="'tabs' == MainTab.type"
              v-bind="MainTab.propsForBlock?.comConf"
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
        <TiRoadblock v-else mode="fit" icon="fas-pen-ruler" text="No GUI" />
      </div>
    </main>
  </div>
</template>
<style lang="scss" scoped>
  @use "./ti-layout-tabs.scss";
</style>
