<script lang="ts" setup>
  import _ from 'lodash';
  import { inject } from 'vue';
  import BarItemTmpl from './BarItemTmpl.vue';
  import { ABAR_STATE, ABarUsedItem } from './ti-action-bar-types';
  import { BUS_KEY } from '../../../core';
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
      props.action(state?.vars || {}, bus);
    }
  }
  //-------------------------------------------------------
</script>
<template>
  <BarItemTmpl
    v-bind="props"
    @click="OnFireAction" />
</template>
