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
    ActionBarEmitter,
    ActionBarEvent,
    BlockEvent,
    TabChangeEvent,
    TiBlock,
    useGridLayoutStyle,
    useGridLayoutTrack,
    useViewport,
  } from '../../../';
  import { Rect, Vars } from '../../../../_type';
  import { CssUtils } from '../../../../core';
  import {
    loadAllState,
    resetSizeState,
    useKeepLayoutGrid,
  } from '../grid/use-grid-keep';
  import { useGridResizing } from '../grid/use-grid-resizing';
  import { getLayoutPanelItems } from '../layout-panel';
  import { LayoutBar, LayoutPanelItem } from '../layout-types';
  import {
    GridItemTabChangeEvent,
    LayoutGridItem,
    LayoutGridProps,
    LayoutGridState,
  } from './ti-layout-grid-types';
  import { getLayoutGridItems, isLayoutAdjustable } from './use-grid-items';
  import { getTopStyle } from './use-grid-util';
  //-------------------------------------------------
  defineOptions({
    inheritAttrs: false,
  });
  //-------------------------------------------------
  import { TiLayoutTabs } from '../tabs/ti-layout-tabs-index';
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
  type LayoutGridEmitter = ActionBarEmitter & {
    (event: 'show' | 'hide', name: string): void;
    (event: 'resize', payload: Rect): void;
    (event: 'block', payload: BlockEvent): void;
    (event: '_sub_block', payload: BlockEvent): void;
    (event: 'tab-change', payload: GridItemTabChangeEvent): void;
  };
  let emit = defineEmits<LayoutGridEmitter>();
  //-------------------------------------------------
  const _viewport = useViewport({
    el: $main,
    emit,
    onMounted,
    onUnmounted,
  });
  //-------------------------------------------------
  let GridLayout = computed(() =>
    useGridLayoutTrack({
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
      itemClass: props.itemClass,
      blockOverflowMode: props.blockOverflowMode,
    })
  );
  //-------------------------------------------------
  let GridPanels = computed(() => getLayoutPanelItems(state, props));
  //-------------------------------------------------
  let isAdjustable = computed(() => isLayoutAdjustable(GridItems.value));
  let Keep = computed(() => useKeepLayoutGrid(props));
  let release_resizing = ref<() => void>();
  //-------------------------------------------------
  function onClickPanelMask(pan: LayoutPanelItem): void {
    if (pan.clickMaskToClose) {
      console.log('OnClickPanelMask', pan.clickMaskToClose, pan);
      emit('hide', pan.uniqKey);
    }
  }
  //-------------------------------------------------
  function onDblClickAdjustBar(_bar: LayoutBar) {
    resetSizeState(state, Keep.value);
  }
  //-------------------------------------------------
  function onBlockActionFire(event: ActionBarEvent) {
    // 直接关闭
    if ('__close_panel' == event.name) {
      let pan: LayoutPanelItem = event.payload;
      if (pan?.uniqKey) {
        emit('hide', pan.uniqKey);
      }
    }
    // 否则通知出去
    else {
      //emit('fire', event);
    }
  }
  //-------------------------------------------------
  function OnBlockEventHappen(event: BlockEvent) {
    //console.log('OnBlockEventHappen', event);
    if (props.subLayout) {
      //console.log('> subblock');
      emit('_sub_block', event);
    } else {
      //console.log('> block');
      emit('block', event);
    }
  }
  //-------------------------------------------------
  function onGridItemTabChange(event: TabChangeEvent, item: LayoutGridItem) {
    // console.log(event, item);
    emit('tab-change', {
      ...event,
      items: [item],
      path: [item.uniqKey],
    });
  }
  //-------------------------------------------------
  function onGridLayoutTabChange(
    event: GridItemTabChangeEvent,
    item: LayoutGridItem
  ) {
    emit('tab-change', {
      ..._.omit(event, 'items', 'path'),
      items: _.concat(event.items, item),
      path: _.concat(event.path, item.uniqKey),
    });
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
    (newShown: Vars, oldShown: Vars) => {
      if (!_.isEqual(newShown, oldShown)) {
        console.log('props.show changed!!!!!', newShown);
        state.shown = _.cloneDeep(newShown);
      }
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
        :class="it.conClass"
        :style="it.conStyle">
        <slot :item="it">
          <!-- 布局块-->
          <!-- 格子布局:带标题-->
          <TiBlock
            v-if="it.propsForBlock"
            v-bind="it.propsForBlock"
            @fire="emit('fire', $event)"
            @happen="OnBlockEventHappen" />
          <!-- 格子布局:仅内容-->
          <TiLayoutGrid
            v-else-if="it.propsForLayoutGrid"
            v-bind="it.propsForLayoutGrid"
            :schema="schema"
            :sub-layout="true"
            @fire="emit('fire', $event)"
            @_sub_block="OnBlockEventHappen"
            @tab-change="onGridLayoutTabChange($event, it)" />
          <!-- 标签布局-->
          <TiLayoutTabs
            v-else-if="it.propsForLayoutTabs"
            v-bind="it.propsForLayoutTabs"
            :schema="schema"
            :sub-layout="true"
            @_sub_block="OnBlockEventHappen"
            @tab-change="onGridItemTabChange($event, it)" />
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
          @dblclick="onDblClickAdjustBar(bar)"></div>
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
          :class="pan.conClass"
          :panel-index="pan.index"
          :panel-ukey="pan.uniqKey"
          :style="pan.style"
          @click="onClickPanelMask(pan)">
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
                overflow-mode="fit"
                v-bind="pan.propsForBlock"
                @fire="onBlockActionFire"
                @happen="OnBlockEventHappen" />
              <!-- 格子布局-->
              <TiLayoutGrid
                v-else-if="'grid' == pan.type"
                v-bind="pan.propsForLayoutGrid"
                :schema="schema"
                :sub-layout="true"
                @fire="emit('fire', $event)"
                @_sub_block="OnBlockEventHappen" />
              <!-- 标签布局-->
              <TiLayoutTabs
                v-else-if="'tabs' == pan.type"
                v-bind="pan.propsForLayoutTabs"
                :schema="schema"
                :sub-layout="true"
                @_sub_block="OnBlockEventHappen" />
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
  @use './style/ti-layout-grid';
  @use './style/grid-adjust-bar';
  @use '../layout-panel';
</style>
