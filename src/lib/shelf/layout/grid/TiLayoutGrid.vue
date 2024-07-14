<script lang="ts" setup>
  import _ from 'lodash';
  import {
    Ref,
    computed,
    onMounted,
    onUnmounted,
    reactive,
    ref,
    watch,
  } from 'vue';
  import {
    BlockEvent,
    TiBlock,
    TiLayoutTabs,
    useGridLayout,
    useGridLayoutStyle,
    useViewport,
  } from '../../../';
  import { Rect, Vars } from '../../../../_type';
  import { CssUtils } from '../../../../core';
  import {
    loadAllState,
    resetSizeState,
    useKeepLayoutGrid,
  } from '../grid/use-grid-keep';
  import { useGridResizing } from '../grid/use-grid-resizing.ts';
  import { getLayoutPanelItems } from '../layout-panel';
  import { LayoutBar, LayoutPanelItem } from '../layout-types';
  import { LayoutGridProps, LayoutGridState } from './ti-layout-grid-types';
  import { getLayoutGridItems, isLayoutAdjustable } from './use-grid-items';
  import { getTopStyle } from './use-grid-util.ts';
  //-------------------------------------------------
  const props = withDefaults(defineProps<LayoutGridProps>(), {
    shown: () => ({}),
  });
  //-------------------------------------------------
  //const _viewport_width = ref(0);
  const $main = ref() as Ref<HTMLElement | undefined>;
  const state = reactive({
    shown: _.cloneDeep(props.shown),
    columns: [],
    rows: [],
  }) as LayoutGridState;
  //-------------------------------------------------
  let emit = defineEmits<{
    (event: 'show' | 'hide', name: string): void;
    (event: 'resize', payload: Rect): void;
    (event: 'block', payload: BlockEvent): void;
  }>();
  //-------------------------------------------------
  const _viewport = useViewport({
    el: $main,
    emit,
    onMounted,
    onUnmounted,
  });
  //-------------------------------------------------
  let GridLayout = computed(() =>
    useGridLayout({
      layout: props.layout,
      layoutHint: props.layoutHint,
      layoutGridTracks: props.layoutGridTracks,
      customizedGridTracks: props.customizedGridTracks,
      // customizedGridTracks: (
      //   trackIndex: number,
      //   trackCount: number,
      //   defaultGetTrackSize: GridLayoutTrackSizeGetter
      // ): string => {
      //   if (!_.isEmpty(state.columns)) {
      //     let col = _.nth(state.columns, trackIndex) ?? '1fr';
      //     return col;
      //   }
      //   return defaultGetTrackSize(trackIndex, trackCount);
      // },
    })
  );
  let GridLayoutStyle = computed(() =>
    useGridLayoutStyle(GridLayout.value, _viewport.size.width)
  );
  //-------------------------------------------------
  let TopClass = computed(() => CssUtils.mergeClassName(props.className));
  let TopStyle = computed(() =>
    getTopStyle(state, props, GridLayoutStyle.value)
  );
  //-------------------------------------------------
  let GridItems = computed(() =>
    getLayoutGridItems(state, {
      schema: props.schema,
      blocks: props.blocks,
      itemStyle: props.itemStyle,
    })
  );
  //-------------------------------------------------
  let GridPanels = computed(() => getLayoutPanelItems(state, props));
  //-------------------------------------------------
  let isAdjustable = computed(() => isLayoutAdjustable(GridItems.value));
  let Keep = computed(() => useKeepLayoutGrid(props));
  let release_resizing = ref<() => void>();
  //-------------------------------------------------
  function OnClickPanelMask(pan: LayoutPanelItem): void {
    if (pan.clickMaskToClose) {
      emit('hide', pan.uniqKey);
    }
  }
  //-------------------------------------------------
  function OnDblClickAdjustBar(_bar: LayoutBar) {
    resetSizeState(state, Keep.value);
  }
  //-------------------------------------------------
  function onBlockEventHappen(event: BlockEvent) {
    emit('block', event);
  }
  //-------------------------------------------------
  // const obResize = new ResizeObserver((_entries) => {
  //   if ($main.value) {
  //     let rect = Rects.createBy($main.value);
  //     if (rect.width > 0 && rect.width != _viewport_width.value) {
  //       _viewport_width.value = rect.width;
  //     }
  //     emit('resize', rect);
  //   }
  // });
  //-------------------------------------------------
  //
  // Life Hooks
  //
  watch(
    () => GridLayoutStyle.value.trackCount,
    (newVal, oldVal) => {
      if (newVal != oldVal && props.resetLocalGridTracks) {
        // console.log('TrackCount Changed', { newVal, oldVal });
        resetSizeState(state, Keep.value);
      }
    }
  );
  watch(
    () => [props.keepShown, props.keepSizes],
    () => {
      loadAllState(props, state, Keep.value);
    }
  );
  watch(
    () => props.shown,
    (shown: Vars) => {
      console.log('props.show changed!!!!!');
      state.shown = _.cloneDeep(shown);
    }
  );
  watch(
    () => isAdjustable.value,
    (canAdjust) => {
      if (canAdjust) {
        // 首先确保释放
        if (release_resizing.value) {
          release_resizing.value();
        }
        // 初始化
        if ($main.value) {
          release_resizing.value = useGridResizing($main.value, state, Keep);
        }
      }
    }
  );
  //-------------------------------------------------
  onMounted(() => {
    if (isAdjustable.value && $main.value) {
      release_resizing.value = useGridResizing($main.value, state, Keep);
    }
    loadAllState(props, state, Keep.value);
  });
  // //-------------------------------------------------
  // onUnmounted(() => {
  //   obResize.disconnect();
  // });
  //-------------------------------------------------
</script>
<template>
  <div
    class="ti-layout-grid"
    :class="TopClass"
    :style="TopStyle"
    ref="$main">
    <!--
      Grid Blocks
    -->
    <div
      v-for="it in GridItems"
      :key="it.uniqKey"
      class="grid-item"
      :it-index="it.index"
      :it-ukey="it.uniqKey"
      :style="it.style">
      <!-------- Block Container -------->
      <div
        class="grid-item-con"
        :class="it.className"
        :style="it.conStyle">
        <slot :item="it">
          <!-- 布局块-->
          <TiBlock
            v-if="'block' == it.type"
            v-bind="it.propsForBlock"
            :class-name="it.className"
            :icon="it.icon"
            :title="it.title"
            :name="it.name"
            :actions="it.actions"
            :action-vars="it.actionVars"
            :action-class="it.actionClass"
            :action-style="it.actionStyle"
            :head-class="it.headClass"
            :head-style="it.headStyle"
            :main-class="it.mainClass"
            :main-style="it.mainStyle"
            @happen="onBlockEventHappen" />
          <!-- 格子布局-->
          <TiLayoutGrid
            v-else-if="'grid' == it.type"
            v-bind="it.propsForLayoutGrid"
            :schema="schema"
            :class-name="it.className"
            :item-style="it.itemStyle"
            @block="emit('block', $event)" />
          <!-- 标签布局-->
          <TiLayoutTabs
            v-else-if="'tabs' == it.type"
            v-bind="it.propsForLayoutTabs"
            :schema="schema"
            :class-name="it.className"
            :item-style="it.itemStyle"
            @block="emit('block', $event)" />
          <!-- 未知布局-->
          <div v-else>
            Unknown layout item type: <code>{{ it.type }}</code>
          </div>
        </slot>
      </div>
      <!-------- 调整条 -------->
      <template v-if="it.adjustBars && it.adjustBars.length > 0">
        <div
          v-for="bar in it.adjustBars"
          class="adjust-bar"
          :bar-mode="bar.mode"
          :bar-adjust-index="bar.adjustIndex"
          :bar-position="bar.position"
          @dblclick="OnDblClickAdjustBar(bar)"></div>
      </template>
    </div>
    <!-- 
      Pop Panel
    -->
    <template v-for="pan in GridPanels">
      <Transition
        :name="pan.tranName"
        appear>
        <div
          v-if="pan.visible"
          class="layout-panel trans-mask"
          :class="pan.className"
          :panel-index="pan.index"
          :panel-ukey="pan.uniqKey"
          :style="pan.style"
          @click="OnClickPanelMask(pan)">
          <div
            class="layout-panel-con trans-box"
            :style="pan.conStyle"
            @click.stop>
            <slot
              name="panel"
              :panel="pan">
              <!-- 布局块-->
              <TiBlock
                v-if="'block' == pan.type"
                :title="pan.title"
                :icon="pan.icon"
                v-bind="pan.propsForBlock"
                @happen="onBlockEventHappen" />
              <!-- 格子布局-->
              <TiLayoutGrid
                v-else-if="'grid' == pan.type"
                v-bind="pan.propsForLayoutGrid"
                :schema="schema"
                @block="emit('block', $event)" />
              <!-- 标签布局-->
              <TiLayoutTabs
                v-else-if="'tabs' == pan.type"
                v-bind="pan.propsForLayoutTabs"
                :schema="schema"
                @block="emit('block', $event)" />
              <!-- 未知布局-->
              <div v-else>
                Unknown layout item type: <code>{{ pan.type }}</code>
              </div>
            </slot>
          </div>
        </div>
      </Transition>
    </template>
  </div>
</template>
<style lang="scss" scoped>
  @use '../../../../assets/style/_all.scss' as *;
  @import 'style/ti-layout-grid';
  @import '../layout-panel';
</style>
../layout-types.ts
