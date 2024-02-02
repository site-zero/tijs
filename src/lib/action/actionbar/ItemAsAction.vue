<script lang="ts" setup>
import BarItemTmpl from "./BarItemTmpl.vue";
import { BarItemProp } from "./action-bar-type";
/*-------------------------------------------------------

                     Com Options

-------------------------------------------------------*/
defineOptions({
  inheritAttrs: false
});
/*-------------------------------------------------------

                        Props

-------------------------------------------------------*/
let props = withDefaults(defineProps<BarItemProp>(), {});
</script>
<template>
  <BarItemTmpl v-bind="props" />
</template>
