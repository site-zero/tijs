<script lang="ts" setup>
  import { CssUtils } from "@site0/tijs";
  import { computed } from "vue";
  import { InputNumRangeEmitter, InputNumRangeProps } from "./inrange-types";
  import { useTiInputNumRangeApi } from "./use-inrange-api";
  //-----------------------------------------------------
  const emit = defineEmits<InputNumRangeEmitter>();
  const props = withDefaults(defineProps<InputNumRangeProps>(), {});
  const _api = useTiInputNumRangeApi(props, emit);
  //-----------------------------------------------------
  const TopClass = computed(() => {
    return CssUtils.mergeClassName(props.className, {
      "is-empty": _api.isEmpty.value,
      "has-value": !_api.isEmpty.value,
    });
  });
  //-----------------------------------------------------
  const TopStyle = computed(() => {
    return CssUtils.toStyle(props.style);
  });
  //-----------------------------------------------------
</script>
<template>
  <div class="ti-input-range-box as-num" :class="TopClass" :style="TopStyle">
    <span v-if="props.readonly">{{ _api.InfoText.value }}</span>
    <template v-else>
      <a class="for-edit" @click.left="_api.editRange()"
        ><i class="fa-regular fa-pen-to-square"></i
      ></a>
      <a class="for-val" @click.left="_api.editRange()">
        {{ _api.InfoText.value }}
      </a>
      <a
        v-if="!_api.isEmpty.value"
        class="for-del"
        @click.left="_api.clearRange()"
        ><i class="zmdi zmdi-close"></i
      ></a>
    </template>
  </div>
</template>
<style lang="scss">
  @use "./inrange.scss";
</style>
