<script lang="ts" setup>
  import { computed, reactive, watch } from 'vue';
  import { SelectableState, TiIcon } from '../../';
  import { CssUtils, TableRowID } from '../../../core';
  import { SwitcherProps } from './ti-switcher-types';
  import { useSwitcher } from './use-switcher';
  //-----------------------------------------------------
  defineOptions({
    inheritAttrs: false,
  });
  //-----------------------------------------------------
  const selection = reactive({
    currentId: null,
    checkedIds: new Map<TableRowID, boolean>(),
    ids: [],
  } as SelectableState<TableRowID>);
  //-----------------------------------------------------
  const props = withDefaults(defineProps<SwitcherProps>(), {
    itemSize: 'm',
    itemGap: 's',
    itemRadius: 's',
    nowrap: false,
  });
  //-----------------------------------------------------
  const Swt = computed(() => useSwitcher(selection, props));
  //-----------------------------------------------------
  const DisplayItems = computed(() => Swt.value.getDisplayItems());
  //-----------------------------------------------------
  const TopClass = computed(() =>
    CssUtils.mergeClassName(
      {
        'is-nowrap': props.nowrap,
      },
      `item-size-${props.itemSize ?? 'm'}`,
      `item-gap-${props.itemGap ?? 't'}`
    )
  );
  //-----------------------------------------------------
  const TopStyle = computed(() => CssUtils.toCssStyle(props.style));
  //-----------------------------------------------------
  watch(
    () => [props.options],
    () => {
      Swt.value.loadOptions();
    },
    {
      immediate: true,
      deep: true,
    }
  );
  //-----------------------------------------------------
</script>
<template>
  <div
    class="ti-switcher"
    :class="TopClass"
    :style="TopStyle">
    <div
      v-for="it in DisplayItems"
      class="sw-item"
      :class="it.className"
      :style="it.style"
      :data-type="it.type"
      @click.left="Swt.onSelect(it, $event)">
      <div
        class="it-icon"
        v-if="it.icon">
        <TiIcon :value="it.icon" />
      </div>
      <div
        class="it-text"
        v-if="it.text">
        {{ it.text }}
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
  @use '../../../assets/style/_all.scss' as *;
  @import './ti-switcher.scss';
</style>
