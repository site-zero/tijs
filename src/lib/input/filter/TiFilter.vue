<script lang="ts" setup>
  import { computed } from 'vue';
  import { FilterProps } from './ti-filter-types';
  import { useFilter } from './use-filter';
  //-------------------------------------------------
  const props = defineProps<FilterProps>();
  //-------------------------------------------------
  const Flt = computed(() => useFilter(props));
  //-------------------------------------------------
</script>
<template>
  <div class="ti-filter">
    <div class="part-left">
      <slot name="head"></slot>
      
      <slot name="tail"></slot>
    </div>
    <div class="part-right"></div>
  </div>
</template>
<style lang="scss" scoped>
  @use '../../../assets/style/_all.scss' as *;
  @import './ti-filter.scss';
</style>
