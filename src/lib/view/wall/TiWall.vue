<script lang="ts" setup>
  import {
    CssUtils,
    Dom,
    ElementScrollIntoViewOptions,
    RoadblockProps,
    SelectableState,
    TableRowID,
    TiRoadblock,
    TiTextSnippet,
    TiWallApi,
    useGridLayout,
    useViewport,
    Util,
  } from "@site0/tijs";
  import _ from "lodash";
  import {
    computed,
    nextTick,
    onMounted,
    onUnmounted,
    reactive,
    useTemplateRef,
    watch,
  } from "vue";
  import { WallEmitter, WallItem, WallProps } from "./ti-wall-types";
  import { useWall } from "./use-wall";

  //-------------------------------------------------
  const emit = defineEmits<WallEmitter>();
  //-----------------------------------------------------
  const props = withDefaults(defineProps<WallProps>(), {
    dftIdPrefix: "item",
  });
  //-------------------------------------------------
  const $el = useTemplateRef<HTMLElement>("$el");
  const _viewport = useViewport({
    getElement: () => $el.value,
    onMounted,
    onUnmounted,
  });
  //-------------------------------------------------
  const selection = reactive({
    currentId: undefined,
    checkedIds: new Map<TableRowID, boolean>(),
    ids: [],
    lastSelectIndex: -1,
  } as SelectableState<TableRowID>);
  //-----------------------------------------------------
  const _wall = computed(() => useWall(props, selection, emit));
  //-----------------------------------------------------
  let GridLayoutStyle = computed(() =>
    useGridLayout(props, _viewport.size.width)
  );
  //-----------------------------------------------------
  const TopClass = computed(() => {
    return CssUtils.mergeClassName(props.className, {
      "can-select": props.canSelect,
      "can-check": props.showChecker,
    });
  });
  //-----------------------------------------------------
  const TopStyle = computed(() => {
    return CssUtils.toStyle(props.style);
  });
  //-----------------------------------------------------
  const WallConStyle = computed(() => {
    return GridLayoutStyle.value.mergetStyle(props.conStyle ?? {});
  });
  //-----------------------------------------------------
  const WallRoadblock = computed(() => {
    return _.assign(
      {
        mode: "fit",
        layout: "B",
        size: "s",
        className: "is-track",
        text: "i18n:nil-content",
        icon: "zmdi-view-module",
      } as RoadblockProps,
      props.emptyRoadblock
    );
  });
  //-----------------------------------------------------
  function makeWallItemEventsHandler(item: WallItem): Record<string, Function> {
    let handlers = {} as Record<string, Function>;
    _.forEach(props.itemEventHandlers, (fn, key) => {
      handlers[key] = function (payload: any) {
        fn({ wall: _wall.value, item, payload });
      };
    });
    return handlers;
  }
  //-----------------------------------------------------
  function scrollIntoViewByIndex(
    index: number,
    options?: ElementScrollIntoViewOptions
  ) {
    // 防空
    if (!$el.value) {
      return;
    }
    // 找到对应的的元素
    let $item = Dom.find(`.wall-item[it-index="${index}"]`, $el.value);
    // console.log("scrollIntoViewByIndex", index, $item);
    if ($item && $item.parentElement) {
      let $viewport: HTMLElement | undefined = undefined;
      if (props.scrollViewPort) {
        $viewport = props.scrollViewPort();
      }
      // 否则就采用 `.wall-con
      if (!$viewport) {
        $viewport = $item.parentElement;
      }
      Dom.scrollIntoView($viewport, $item, options);
    }
  }
  //-----------------------------------------------------
  function scrollCheckedIntoView(smooth = true) {
    //console.log("scrollCheckedIntoView");
    let checkedIds = Util.mapTruthyKeys(selection.checkedIds);
    if (checkedIds.length > 0) {
      let fstId = checkedIds[0];
      let index = _wall.value.getWallItemIndex(fstId);
      if (index >= 0) {
        scrollIntoViewByIndex(index, { to: "center", smooth });
      }
    }
  }
  //-----------------------------------------------------
  watch(
    () => [props.currentId, props.checkedIds, props.data],
    () => {
      //console.log("updateSelection");
      _wall.value.updateSelection(
        selection,
        props.data ?? [],
        props.currentId,
        props.checkedIds
      );
      nextTick(() => {
        scrollCheckedIntoView(false);
      });
    },
    { immediate: true }
  );
  //-----------------------------------------------------
  defineExpose<TiWallApi>({
    scrollIntoViewByIndex,
    scrollCheckedIntoView,
  });
  //-----------------------------------------------------
</script>
<template>
  <div
    class="ti-wall"
    :class="TopClass"
    :style="TopStyle"
    :data-mode="props.mode || 'wall'"
    @click.left="_wall.OnItemCancel()">
    <!--===: Wall Head :===-->
    <slot name="head">
      <TiTextSnippet
        v-if="props.head"
        className="bar-head"
        :class="props.head.className"
        :style="props.head.style"
        :prefixIcon="props.head.icon"
        :text="props.head.text ?? ''"
        :auto-i18n="true"
        :textType="props.head.textType"
        :comType="props.head.comType"
        :comConf="props.head.comConf" />
    </slot>
    <!--===: Wall Body :===-->
    <div class="wall-con" :style="WallConStyle" ref="$el">
      <TiRoadblock v-if="_wall.isEmpty.value" v-bind="WallRoadblock" />
      <template v-else>
        <div
          v-for="wit in _wall.Items.value"
          class="wall-item"
          :class="wit.className"
          :style="wit.style"
          :it-index="wit.index"
          :it-type="wit.type">
          <div
            class="wall-item-con"
            :class="wit.conClass"
            :style="wit.conStyle"
            @click.left.stop="_wall.OnItemSelect(wit, $event)"
            @dblclick="emit('open', wit)">
            <component
              :is="wit.comType"
              v-bind="wit.comConf"
              v-on="makeWallItemEventsHandler(wit)" />
          </div>
        </div>
      </template>
    </div>
    <!--===: Wall Tail :===-->
    <slot name="tail">
      <TiTextSnippet
        v-if="props.tail"
        className="bar-tail"
        :class="props.tail.className"
        :style="props.tail.style"
        :prefixIcon="props.tail.icon"
        :text="props.tail.text ?? ''"
        :textType="props.tail.textType"
        :comType="props.tail.comType"
        :comConf="props.tail.comConf" />
    </slot>
  </div>
</template>
<style lang="scss" scoped>
  @use "./ti-wall.scss";
</style>
