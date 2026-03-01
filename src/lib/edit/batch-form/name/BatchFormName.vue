<script lang="ts" setup>
  import { CssUtils } from "@site0/tijs";
  import _ from "lodash";
  import { computed } from "vue";
  import {
    BatchFormNameEmitter,
    BatchFormNameProps,
  } from "./batch-form-name-types";
  //-----------------------------------------------------
  const emit = defineEmits<BatchFormNameEmitter>();
  const props = withDefaults(defineProps<BatchFormNameProps>(), {});
  //-----------------------------------------------------
  const TopStyle = computed(() => {
    return CssUtils.mergeStyles([
      {
        lineHeight: "1em",
      },
      props.style,
    ]);
  });
  //-----------------------------------------------------
  const isChecked = computed(() => {
    let map = props.checkedNames || {};
    let nms = _.concat([], props.name);
    for (let nm of nms) {
      let isCheck = map[nm] ?? false;
      if (!isCheck) return false;
    }
    return true;
  });
  //-----------------------------------------------------
  const FieldCheckIcon = computed(() => {
    return isChecked.value ? "zmdi-check-square" : "zmdi-square-o";
  });
  const FieldCheckIconClass = computed(() => {
    return "zmdi " + FieldCheckIcon.value;
  });
  //-----------------------------------------------------
</script>
<template>
  <div>
    <div class="batch-form-name" :style="TopStyle">
      <span class="as-text">{{ props.title }}</span>
      <span class="as-icon">
        <i :class="FieldCheckIconClass"></i>
      </span>
    </div>
  </div>
</template>
<style lang="scss" scoped>
  @use "./batch-form-name.scss";
</style>
