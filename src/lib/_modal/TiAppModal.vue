<script setup lang="ts">
  import { AppModalProps } from '..';

  const props = defineProps<AppModalProps>();
</script>
<template>
  <div class="ti-app-modal">I am modal</div>
</template>
<style lang="scss" scoped>
  @use '../../assets/style/_all.scss' as *;
</style>
