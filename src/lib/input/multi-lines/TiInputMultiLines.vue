<script lang="ts" setup>
  import _ from "lodash";
  import { computed } from "vue";
  import {
    CssUtils,
    InputBoxProps,
    TiActionBar,
    TiWall,
    WallItemEventHandlers,
    WallSelectEmitInfo,
  } from "../../../";
  import {
    InputMultiLinesEmitter,
    InputMultiLinesProps,
  } from "./ti-input-multi-lines-types";
  import { useMultiLinesAction } from "./use-multi-lines-action";
  import { useTiInputMultiLinesApi } from "./use-ti-input-multi-lines-api";
  //-----------------------------------------------------
  const emit = defineEmits<InputMultiLinesEmitter>();
  const props = withDefaults(defineProps<InputMultiLinesProps>(), {});
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
  function onItemSelect(payload: WallSelectEmitInfo) {
    _api.selectLines(payload.currentId, payload.checkedIds);
  }
  //-----------------------------------------------------
</script>
<template>
  <div class="ti-input-multi-lines" :class="TopClass" :style="TopStyle">
    <!-- <div class="input-line" v-for="(item, index) in _api.LineItems.value">
      <TiInput
        v-bind="InputConfig"
        :value="item.value"
        :keepEmptyValue="true"
        suffix-icon-for="clear"
        @change="_api.onLineChange(index, $event)" />
    </div> -->
    <TiWall
      mode="list"
      :multi="true"
      :data="_api.LineItems.value"
      :getId="'index'"
      :currentId="_api.CurrentId.value"
      :checkedIds="_api.CheckedIds.value"
      comType="TiInput"
      :comConf="InputConfig"
      :canSelect="true"
      :itemEventHandlers="WallItemEvents"
      @select="onItemSelect">
      <template #head>
        <TiActionBar v-bind="ActionBarConfig" />
      </template>
    </TiWall>
  </div>
</template>
<style lang="scss">
  @use "./ti-input-multi-lines.scss";
</style>
