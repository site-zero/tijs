<script lang="ts" setup>
import {
  Ref,
  computed,
  inject,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  watch
} from "vue";
import { BUS_KEY, TiAppEvent, TiBlock, TiLayoutTabs, useBusEmit } from "../../../";
import { TiLayoutGridInfo } from "./ti-layout-grid-index";
import { loadAllState, useKeepLayoutGrid } from "./use-grid-keep";
import {
  COM_TYPE,
  LayoutGridEvents,
  LayoutGridProps,
  LayoutGridState,
  useLayoutGrid,
} from "./use-layout-grid";
/*-------------------------------------------------------

                     Com Options

-------------------------------------------------------*/
defineOptions({
  name: COM_TYPE,
  inheritAttrs: true
});
/*-------------------------------------------------------

                        State

-------------------------------------------------------*/
const $main: Ref<HTMLElement> = ref() as Ref<HTMLElement>;
const state = reactive({
  shown: {},
  columns: [],
  rows: []
}) as LayoutGridState;
/*-------------------------------------------------------

                        Props

-------------------------------------------------------*/
const props = withDefaults(defineProps<LayoutGridProps>(), {});

/*-------------------------------------------------------

                  Bus & Notify & Emit

-------------------------------------------------------*/
let outer_bus = inject(BUS_KEY);
let emit = defineEmits<{
  (event: LayoutGridEvents, payload: TiAppEvent): void;
}>();
// 准备通知函数
let notify = useBusEmit(TiLayoutGridInfo, props, emit, outer_bus);
/*-------------------------------------------------------

                    Use features

-------------------------------------------------------*/
let Grid = computed(() => useLayoutGrid(state, props, { notify }));
let Keep = computed(() => useKeepLayoutGrid(props))
/*-------------------------------------------------------

                  Life Hooks

-------------------------------------------------------*/
watch(
  () => [props.keepShown, props.keepSizes],
  () => {
    loadAllState(state, Keep.value);
  }
);
onMounted(() => {
  Grid.value.bindResizing($main.value, state, onUnmounted, Keep.value);
  loadAllState(state, Keep.value);
});
</script>
<template>
  <div class="ti-layout-grid" :class="Grid.TopClass" :style="Grid.TopStyle"
    ref="$main">
    <div v-for="it in Grid.Items" :key="it.uniqKey" class="grid-item"
      :it-index="it.index" :it-ukey="it.uniqKey" :style="it.style">
      <!-------- 块内容 -------->
      <div class="grid-item-con" :class="it.className" :style="it.conStyle">
        <!-- 布局块-->
        <TiBlock v-if="'block' == it.type" v-bind="it.itemConfig" />
        <!-- 格子布局-->
        <TiLayoutGrid v-else-if="'grid' == it.type" v-bind="it.itemConfig"
          :schema="schema" />
        <!-- 标签布局-->
        <TiLayoutTabs v-else-if="'tabs' == it.type" v-bind="it.itemConfig"
          :schema="schema" />
        <!-- 未知布局-->
        <div v-else>
          Unknown layout item type: <code>{{ it.type }}</code>
        </div>
      </div>
      <!-------- 调整条 -------->
      <template v-if="it.adjustBars && it.adjustBars.length > 0">
        <div v-for="bar in it.adjustBars" class="adjust-bar" :bar-mode="bar.mode"
          :bar-adjust-index="bar.adjustIndex" :bar-position="bar.position"></div>
      </template>
    </div>
  </div>
</template>
<style lang="scss">
@use "../../../../assets/style/_all.scss" as *;
@import "./ti-layout-grid.scss";
</style>