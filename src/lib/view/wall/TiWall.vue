<script lang="ts" setup>
  import {
    computed,
    onMounted,
    onUnmounted,
    reactive,
    useTemplateRef,
    watch,
  } from 'vue';
  import { SelectableState, useGridLayout, useViewport } from '../../';
  import { TableRowID } from '../../../';
  import { CssUtils } from '../../../core';
  import { WallEmitter, WallProps } from './ti-wall-types';
  import { useWall } from './use-wall';
  //-------------------------------------------------
  const emit = defineEmits<WallEmitter>();
  //-----------------------------------------------------
  const props = withDefaults(defineProps<WallProps>(), {
    dftIdPrefix: 'item',
  });
  //-------------------------------------------------
  const $el = useTemplateRef('$el');
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
  const Wall = useWall(props, emit);
  //-----------------------------------------------------
  let GridLayoutStyle = computed(() =>
    useGridLayout(props, _viewport.size.width)
  );
  //-----------------------------------------------------
  const TopClass = computed(() => {
    return CssUtils.mergeClassName(props.className, {
      'can-select': props.canSelect,
      'can-check': props.canCheck,
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
  watch(
    () => props.data,
    () => Wall.resetSelection(selection, props.data),
    {
      immediate: true,
    }
  );
  //-----------------------------------------------------
</script>
<template>
  <div
    class="ti-wall"
    :class="TopClass"
    :style="TopStyle">
    <div
      class="wall-con fit-parent"
      :style="WallConStyle"
      :hello="_viewport.size.width"
      ref="$el">
      <div
        v-for="wit in Wall.Items.value"
        class="wall-item"
        :class="Wall.getItemClass(selection, wit)"
        :style="wit.style"
        :it-index="wit.index"
        :it-type="wit.type">
        <div
          class="wall-item-con"
          :class="wit.conClass"
          :style="wit.conStyle"
          @click="Wall.OnItemSelect(selection, { event: $event, item: wit })"
          @dblclick="emit('open', wit)">
          <component
            :is="wit.comType"
            v-bind="wit.comConf" />
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
  @use '../../../assets/style/_all.scss' as *;
  @import './ti-wall.scss';
</style>
