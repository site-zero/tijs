<script lang="ts" setup>
  import _ from 'lodash';
  import { inject } from 'vue';
  import BarItemTmpl from './BarItemTmpl.vue';
  import { ABAR_STATE, ABarUsedItem } from './ti-action-bar-types';
  //-------------------------------------------------------
  defineOptions({
    inheritAttrs: false,
  });
  //-------------------------------------------------------
  const state = inject(ABAR_STATE);
  //-------------------------------------------------------
  let props = withDefaults(defineProps<ABarUsedItem>(), {});
  //-------------------------------------------------------
  function OnFireAction() {
    console.log("OnFireAction", props)
    if (_.isFunction(props.action)) {
      props.action(state?.vars || {});
    }
  }
  //-------------------------------------------------------
</script>
<template>
  <BarItemTmpl
    v-bind="props"
    @click="OnFireAction" />
</template>
