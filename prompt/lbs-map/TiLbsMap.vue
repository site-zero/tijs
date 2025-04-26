<script setup lang="ts">
  import { LbsMapEmitter, LbsMapProps } from './ti-lbs-map-types';
  //--------------------------------------------
  const emit = defineEmits<LbsMapEmitter>();
  //--------------------------------------------
  const props = withDefaults(defineProps<LbsMapProps>(), {});
  //--------------------------------------------
</script>

<template>
  <div class="ti-lbs-map">
    <main>
      <!-- 地图容器 -->
       I am LBS Map
    </main>
  </div>
</template>

<style lang="scss" scoped></style>
