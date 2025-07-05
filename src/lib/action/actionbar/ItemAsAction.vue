<script lang="ts" setup>
  import _ from "lodash";
  import { inject } from "vue";
  import { BUS_KEY } from "../../../_type";
  import BarItemTmpl from "./BarItemTmpl.vue";
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
  function OnFireAction() {
    //console.log("OnFireAction", props)
    if (_.isFunction(props.action)) {
      props.action(props.uniqKey, state?.vars || {}, bus);
    }
    state?.opened.clear();
  }
  //-------------------------------------------------------
</script>
<template>
  <BarItemTmpl v-bind="props" @click="OnFireAction" />
</template>
