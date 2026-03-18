<script lang="ts" setup>
  import { computed, inject } from "vue";
  import { BUS_KEY } from "../../../_type";
  import BarItemTmpl from "./BarItemTmpl.vue";
  import { useAsyncFire } from "./support/use-async-fire";
  import { ABAR_STATE, ABarUsedItem } from "./ti-action-bar-types";
  //-------------------------------------------------------
  defineOptions({
    inheritAttrs: false,
  });
  //-------------------------------------------------------
  const state = inject(ABAR_STATE);
  const bus = inject(BUS_KEY);
  //-------------------------------------------------------
  let props = withDefaults(defineProps<ABarUsedItem>(), {});
  //-------------------------------------------------------
  // 阻止用户频繁点击
  const _async_fire = computed(() => {
    let val = props.value ?? props.uniqKey;
    let args = [val, state?.vars || {}, bus];
    return useAsyncFire({
      fn: props.action,
      args,
      logName: "ItemAsGroup:" + props.uniqKey,
    });
  });
  //-------------------------------------------------------
  async function OnFireAction() {
    await _async_fire.value();
    state?.opened.clear();
  }
  //-------------------------------------------------------
</script>
<template>
  <BarItemTmpl v-bind="props" @click="OnFireAction" />
</template>
