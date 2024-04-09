<script lang="ts" setup>
import _ from 'lodash';
import {
  Ref,
  computed,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  watch
} from 'vue';
import {
  TiBlock,
  TiLayoutTabs
} from '../../../';
import { Vars } from '../../../../core';
import { LayoutPanelItem } from '../layout-panel';
import { loadAllState, useKeepLayoutGrid } from './use-grid-keep';
import {
  COM_TYPE,
  LayoutGridProps,
  LayoutGridState,
  useLayoutGrid,
} from './use-layout-grid';
/*-------------------------------------------------------

                 Com Options

-------------------------------------------------------*/
defineOptions({
  name: COM_TYPE,
  inheritAttrs: true,
});

/*-------------------------------------------------------

                    Props

-------------------------------------------------------*/
const props = withDefaults(defineProps<LayoutGridProps>(), {});
/*-------------------------------------------------------

                    State

-------------------------------------------------------*/
const $main: Ref<HTMLElement> = ref() as Ref<HTMLElement>;
const state = reactive({
  shown: _.cloneDeep(props.shown),
  columns: [],
  rows: [],
}) as LayoutGridState;
/*-------------------------------------------------------

              Bus & Notify & Emit

-------------------------------------------------------*/
let emit = defineEmits<{
  (event: 'show' | 'hide', name: string): void
}>();
/*-------------------------------------------------------

                Use features

-------------------------------------------------------*/
let Grid = computed(() => useLayoutGrid(state, props));
let Keep = computed(() => useKeepLayoutGrid(props));


function OnClickPanelMask(pan: LayoutPanelItem): void {
  if (pan.clickMaskToClose) {
    emit('hide', pan.uniqKey)
  }
}
/*-------------------------------------------------------

              Life Hooks

-------------------------------------------------------*/
watch(
  () => [props.keepShown, props.keepSizes],
  () => {
    loadAllState(props, state, Keep.value);
  }
);
watch(() => props.shown, (shown: Vars) => {
  console.log("props.show changed!!!!!")
  state.shown = _.cloneDeep(shown)
})
onMounted(() => {
  console.log("TiLayoutGrid onMounted")
  Grid.value.bindResizing($main.value, state, onUnmounted, Keep);
  loadAllState(props, state, Keep.value);
});
</script>
<template>
  <div class="ti-layout-grid" :class="Grid.TopClass" :style="Grid.TopStyle"
    ref="$main">
    <!--
      Grid Blocks
    -->
    <div v-for="it in Grid.Items" :key="it.uniqKey" class="grid-item"
      :it-index="it.index" :it-ukey="it.uniqKey" :style="it.style">
      <!-------- Block Container -------->
      <div class="grid-item-con" :class="it.className" :style="it.conStyle">
        <slot :item="it">
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
        </slot>
      </div>
      <!-------- 调整条 -------->
      <template v-if="it.adjustBars && it.adjustBars.length > 0">
        <div v-for="bar in it.adjustBars" class="adjust-bar" :bar-mode="bar.mode"
          :bar-adjust-index="bar.adjustIndex" :bar-position="bar.position"></div>
      </template>
    </div>
    <!-- 
      Pop Panel
    -->
    <template v-for="pan in Grid.Panels">
      <Transition :name="pan.tranName" appear>
        <!--@before-enter="console.log('before-enter')"
        @before-leave="console.log('before-leave')" @enter="console.log('enter')"
        @leave="console.log('leave')" @appear="console.log('appear')"
        @after-enter="console.log('after-enter')"
        @after-leave="console.log('after-leave')"
        @after-appear="console.log('after-appear')"
        @enter-cancelled="console.log('enter-cancelled')"
        @leave-cancelled="console.log('leave-cancelled')"
        @appear-cancelled="console.log('appear-cancelled')"-->
        <div v-if="pan.visible" class="layout-panel trans-mask" :class="pan.className"
          :panel-index="pan.index" :panel-ukey="pan.uniqKey" :style="pan.style"
          @click="OnClickPanelMask(pan)">
          <div class="layout-panel-con trans-box" :style="pan.conStyle" @click.stop>
            <slot name="panel" :panel="pan">
              <!-- 布局块-->
              <TiBlock v-if="'block' == pan.type" v-bind="pan.itemConfig" />
              <!-- 格子布局-->
              <TiLayoutGrid v-else-if="'grid' == pan.type" v-bind="pan.itemConfig"
                :schema="schema" />
              <!-- 标签布局-->
              <TiLayoutTabs v-else-if="'tabs' == pan.type" v-bind="pan.itemConfig"
                :schema="schema" />
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
@import './ti-layout-grid';
@import './../layout-panel';
@import './style/_grid-adjust-bar';
@import './style/_transition';
</style>
