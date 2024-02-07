<script lang="ts" setup>
  import { BarItemProp } from './action-bar-type';

  /*-------------------------------------------------------

                     Com Options

-------------------------------------------------------*/
  defineOptions({
    inheritAttrs: false,
  });
  /*-------------------------------------------------------

                        Props

-------------------------------------------------------*/
  let props = withDefaults(defineProps<BarItemProp>(), {});
</script>
<template>
  <div class="bar-item" :type="props.type" :class="props.className">
    This Status
  </div>
</template>
