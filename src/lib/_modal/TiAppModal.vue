<script setup lang="ts">
  import { AppModalProps } from '..';

  const props = withDefaults(defineProps<AppModalProps>(), {
    position: 'center',
    textOk: 'i18n:ok',
    textCancel: 'i18n:cancel',
  });
</script>
<template>
  <div class="ti-app-modal">
    I am modal
    
  </div>
</template>
<style lang="scss" scoped>
  @use '../../assets/style/_all.scss' as *;
</style>
