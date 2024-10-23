<script lang="ts" setup>
  import { computed } from 'vue';
  import { TiInput } from '../../';
  //-----------------------------------------------------
  defineOptions({
    inheritAttrs: false,
  });
  //-----------------------------------------------------
  let emit = defineEmits<{
    (event: 'change', payload: string): void;
  }>();
</script>
<template>
  <div>Unknown Components</div>
</template>
<style lang="scss" scoped>
  @use './ti-input-currency.scss';
</style>
