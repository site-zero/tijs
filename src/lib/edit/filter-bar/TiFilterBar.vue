<script lang="ts" setup>
import { FilterBarProps, FilterBarEmitter } from "./ti-filter-bar-types";
import { useTiFilterBarApi } from "./use-ti-filter-bar-api";
//-----------------------------------------------------
const emit = defineEmits<FilterBarEmitter>();
const props = withDefaults(defineProps<FilterBarProps>(), {});
const _api = useTiFilterBarApi(props, emit);
//-----------------------------------------------------
//-----------------------------------------------------
</script>
<template>
  <div class="ti-filter-bar">
    <!-- 这里放置组件内容 -->
     Filter Bar
  </div>
</template>
<style lang="scss">
@use "./ti-filter-bar.scss";
</style>