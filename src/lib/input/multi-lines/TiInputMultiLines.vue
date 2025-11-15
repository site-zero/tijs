<script lang="ts" setup>
  import { InputBoxProps, TiInput } from "@site0/tijs";
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
  const FormatedValue = computed(() => _api.formatValue());
  //-----------------------------------------------------
  const InputConfig = computed(() => {
    return _.assign(
      { readonly: props.readonly, boxFontSize: "s" } as InputBoxProps,
      props.inputConfig
    );
  });
  //-----------------------------------------------------
</script>
<template>
  <div class="ti-input-multi-lines">
    <div class="input-line" v-for="val in FormatedValue">
      <TiInput v-bind="InputConfig" :value="val" />
    </div>
  </div>
</template>
<style lang="scss">
  @use "./ti-input-multi-lines.scss";
</style>
