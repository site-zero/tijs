<script lang="ts" setup>
  import _ from "lodash";
  import { computed } from "vue";
  import {
    CssUtils,
    InputBoxProps,
    TiActionBar,
    TiIcon,
    WallItemEventHandlers,
  } from "../../../";
  import {
    InputMultiLinesEmitter,
    InputMultiLinesProps,
  } from "./ti-input-multi-lines-types";
  import { useMultiLinesAction } from "./use-multi-lines-action";
  import { useTiInputMultiLinesApi } from "./use-ti-input-multi-lines-api";
  //-----------------------------------------------------
  const emit = defineEmits<InputMultiLinesEmitter>();
  const props = withDefaults(defineProps<InputMultiLinesProps>(), {
    newItem: " ",
    checkedItemType: "primary",
    emptyRoadblock: () => ({
      size: "small",
    }),
  });
  const _api = useTiInputMultiLinesApi(props, emit);
  //-----------------------------------------------------
  const ActionBarConfig = computed(() => useMultiLinesAction(props, _api));
  //-----------------------------------------------------
  const TopClass = computed(() => CssUtils.mergeClassName(props.className));
  const TopStyle = computed(() => CssUtils.toStyle(props.style));
  //-----------------------------------------------------
  const InputConfig = computed(() => {
    return _.assign(
      { readonly: props.readonly, boxFontSize: "s" } as InputBoxProps,
      props.inputConfig,
      {
        value: "=item.value",
        keepEmptyValue: true,
        prefixIcon: "=item.prefixIcon",
        prefixHoverIcon: "=item.prefixIcon",
        prefixIconFor: "click",
        suffixIconFor: "clear",
        type: "=item.type",
      } //as InputBoxProps
    );
  });
  //-----------------------------------------------------
  const WallItemEvents = {
    "click:prefix-icon": async ({ item, wall }) => {
      wall.toggleByIndex(item.index);
    },
    "change": async ({ item, payload }) => {
      _api.onLineChange(item.index, payload);
    },
  } as WallItemEventHandlers;
  //-----------------------------------------------------
  // function onItemSelect(payload: WallSelectEmitInfo) {
  //   if (_api.selectLines(payload.currentId, payload.checkedIds)) {
  //     _api.buildListItems();
  //   }
  // }
  //-----------------------------------------------------
  function onToggleItem(index: number) {
    _api.toggleLine(index);
  }
  //-----------------------------------------------------
  function onInputFocus(index: number) {
    _api.selectLines(index, [index]);
  }
  //-----------------------------------------------------
  function onInputChange(index: number, evt: Event) {
    let $el = evt.target as HTMLInputElement;
    _api.onLineChange(index, $el.value);
  }
//-----------------------------------------------------
  function onClearItem(index: number) {
    _api.onLineChange(index, null);
  }
  //-----------------------------------------------------
  // watch(
  //   () => props.value,
  //   (newVal, oldVal) => {
  //     console.log(newVal, oldVal);
  //     if (!_.isEqual(newVal, oldVal)) {
  //       _api.buildListItems();
  //     }
  //   },
  //   { immediate: true }
  // );
  //-----------------------------------------------------
</script>
<template>
  <div class="ti-input-multi-lines" :class="TopClass" :style="TopStyle">
    <TiActionBar v-if="!props.readonly" v-bind="ActionBarConfig" />
    <main>
      <div
        v-for="(item, index) in _api.LineItems.value"
        class="line-item"
        :class="item.className">
        <span class="as-checker" @click.left="onToggleItem(index)">
          <TiIcon :value="item.prefixIcon" />
        </span>
        <input
          :value="item.value"
          @focus="onInputFocus(index)"
          @change="onInputChange(index, $event)" />
        <a class="line-del" @click.left="onClearItem(index)">
          <i class="zmdi zmdi-minus"></i>
          <i class="zmdi zmdi-close"></i>
        </a>
      </div>
    </main>
  </div>
</template>
<style lang="scss">
  @use "./ti-input-multi-lines.scss";
</style>
