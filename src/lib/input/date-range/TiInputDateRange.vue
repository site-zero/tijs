<script lang="ts" setup>
  import {
    InputDateRangeEmitter,
    InputDateRangeProps,
  } from "./daterange-types";
  import { useTiInputDateRangeApi } from "./use-daterange-api";
  //-----------------------------------------------------
  const emit = defineEmits<InputDateRangeEmitter>();
  const props = withDefaults(defineProps<InputDateRangeProps>(), {});
  const _api = useTiInputDateRangeApi(props, emit);
  //-----------------------------------------------------
</script>
<template>
  <div class="daterange">This is TiInputDateRange</div>
</template>
<style lang="scss">
  @use "./daterange.scss";
</style>
