<script lang="ts" setup>
  import { InputBoxProps, TiWall } from "@site0/tijs";
  import _ from "lodash";
  import { computed } from "vue";
  import {
    TiInputMultiLinesEmitter,
    TiInputMultiLinesProps,
  } from "./ti-input-multi-lines-types";
  import { useTiInputMultiLinesApi } from "./use-ti-input-multi-lines-api";
  //-----------------------------------------------------
  const emit = defineEmits<TiInputMultiLinesEmitter>();
  const props = withDefaults(defineProps<TiInputMultiLinesProps>(), {});
  const _api = useTiInputMultiLinesApi(props, emit);
  //-----------------------------------------------------
  const InputConfig = computed(() => {
    return _.assign(
      { readonly: props.readonly, boxFontSize: "s" } as InputBoxProps,
      props.inputConfig,
      {
        value: "=item.value",
        keepEmptyValue: true,
        suffixIconFor: "clear",
      } as InputBoxProps
    );
  });
  //-----------------------------------------------------
</script>
<template>
  <div class="ti-input-multi-lines">
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
      :data="_api.LineItems.value"
      comType="TiInput"
      :comConf="InputConfig" />
  </div>
</template>
<style lang="scss">
  @use "./ti-input-multi-lines.scss";
</style>
