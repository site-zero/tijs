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
    layout: () => ({ gap: '1em' }),
    conStyle: () => ({ padding: '2em' }),
  });
  //-------------------------------------------------
  const $el = useTemplateRef<HTMLElement>('$el');
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
      'can-select': props.canSelect,
      'can-check': props.showChecker,
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
    () => _wall.value.resetSelection(selection, props.data),
    { immediate: true }
  );
  //-----------------------------------------------------
  watch(
    () => [props.currentId, props.checkedIds],
    () => {
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
    @click.left="_wall.resetSelection(selection, props.data)">
    <div
      class="wall-con"
      :style="WallConStyle"
      :hello="_viewport.size.width"
      ref="$el">
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
          @click.left.stop="_wall.OnItemSelect({ event: $event, item: wit })"
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
  @use './ti-wall.scss';
</style>
