<script setup lang="ts">
  import { TiRoadblock } from '../../';
  import { RoadblockProps } from '../roadblock/ti-roadblock-types';

  let props = withDefaults(defineProps<RoadblockProps>(), {
    className: '',
    icon: 'fas-spinner fa-spin',
    text: 'i18n:loading',
    autoI18n: true,
  });
</script>

<template>
  <TiRoadblock
    class="ti-loading"
    v-bind="props" />
</template>
