<script lang="ts" setup>
  import _ from "lodash";
  import {
    computed,
    onMounted,
    onUnmounted,
    reactive,
    useTemplateRef,
    watch,
  } from "vue";
  import {
    RoadblockProps,
    SelectableState,
    TiRoadblock,
    useGridLayout,
    useViewport,
  } from "../../";
  import { TableRowID, TiTextSnippet } from "../../../";
  import { CssUtils } from "../../../core";
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
    el: $el,
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
        size: "normal",
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
  watch(
    () => selection.checkedIds,
    (newVal, oldVal) => {
      console.log(
        "checkedIds changed",
        [...oldVal.keys()].join(",") || "<empty>",
        "=>",
        [...newVal.keys()].join(",") || "<empty>"
      );
    }
  );
  //-----------------------------------------------------
  watch(
    () => props.data,
    () => {
      console.log("reset selection");
      _wall.value.resetSelection(selection, props.data);
    },
    { immediate: true }
  );
  //-----------------------------------------------------
  watch(
    () => [props.currentId, props.checkedIds],
    () => {
      console.log("updateSelection");
      _wall.value.updateSelection(
        selection,
        props.data ?? [],
        props.currentId,
        props.checkedIds
      );
    },
    { immediate: true }
  );
  //-----------------------------------------------------
</script>
<template>
  <div
    class="ti-wall"
    :class="TopClass"
    :style="TopStyle"
    :data-mode="props.mode || 'wall'"
    @click.left="_wall.resetSelection(selection, props.data)">
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
          :class="_wall.getWallItemClass(wit)"
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
