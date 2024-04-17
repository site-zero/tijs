<script lang="ts" setup>
  import _ from 'lodash';
  import BarItemTmpl from './BarItemTmpl.vue';
  import { BarItemProp } from './action-bar-type';
  defineOptions({
    inheritAttrs: false,
  });
  let props = withDefaults(defineProps<BarItemProp>(), {});

  function OnFireAction() {
    if (_.isFunction(props.action)) {
      props.action();
    }
  }
</script>
<template>
  <BarItemTmpl
    v-bind="props"
    @click="OnFireAction" />
</template>
