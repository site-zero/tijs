<script lang="ts" setup>
  import { ScoreEmitter, ScoreProps } from "./ti-score-types";
  //-----------------------------------------------------
  const emits = defineEmits<ScoreEmitter>();
  //-----------------------------------------------------
  const props = withDefaults(defineProps<ScoreProps>(), {
    value: 0,
    minValue: 0,
    maxValue: 10,
    starts: 5,
    allowHalfStart: true,
  });
  //-----------------------------------------------------
  
  //-----------------------------------------------------
</script>
<template>
  <div>I am score</div>
</template>
<style lang="scss" scoped>
  @use "./ti-score.scss";
</style>
