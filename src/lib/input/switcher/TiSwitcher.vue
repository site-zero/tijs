<script lang="ts" setup>
  import { computed, reactive, watch } from 'vue';
  import { SelectableState, TiIcon } from '../../';
  import { TableRowID } from '../../../_type';
  import { CssUtils } from '../../../core';
  import { SwitcherProps } from './ti-switcher-types';
  import { SwitcherEmitter, useSwitcher } from './use-switcher';
  //-----------------------------------------------------
  defineOptions({
    inheritAttrs: false,
  });
  //-----------------------------------------------------
  const emit = defineEmits<SwitcherEmitter>();
  //-----------------------------------------------------
  const selection = reactive({
    currentId: undefined,
    checkedIds: new Map<TableRowID, boolean>(),
    ids: [],
    lastSelectIndex: -1,
  } as SelectableState<TableRowID>);
  //-----------------------------------------------------
  const props = withDefaults(defineProps<SwitcherProps>(), {
    defaultItemType: 'info',
    itemSize: 'm',
    itemGap: 's',
    itemRadius: 's',
    nowrap: false,
  });
  //-----------------------------------------------------
  const Swt = useSwitcher(selection, props, emit);
  //-----------------------------------------------------
  const DisplayItems = computed(() => Swt.getDisplayItems());
  //-----------------------------------------------------
  const TopClass = computed(() =>
    CssUtils.mergeClassName(
      {
        'is-nowrap': props.nowrap,
        'is-readonly': props.readonly,
        'is-editable': !props.readonly,
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
    async () => {
      Swt.loadOptions();
      Swt.updateSelection(props.value);
    },
    {
      immediate: true,
      deep: true,
    }
  );
  //-----------------------------------------------------
  watch(
    () => [props.value],
    () => {
      Swt.updateSelection(props.value);
    },
    {
      immediate: true,
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
      :title="it.tip"
      @click.left="Swt.onSelect(it.value, $event)">
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
  @use './ti-switcher.scss';
</style>
