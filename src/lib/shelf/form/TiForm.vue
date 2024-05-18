<script lang="ts" setup>
  import { FormProps, TiGridFields } from '../..';
  const props = defineProps<FormProps>();
</script>
<template>
  <TiGridFields v-bind="props" />
</template>
<style lang="scss" scoped>
  @use '../../../assets/style/_all.scss' as *;
</style>
