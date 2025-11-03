<script lang="ts" setup>
  import { computed, watch } from "vue";
  import { TiSearchBarEmitter, TiSearchBarProps } from "./ti-search-bar-types";
  //-----------------------------------------------------
  const emit = defineEmits<TiSearchBarEmitter>();
  const props = withDefaults(defineProps<TiSearchBarProps>(), {});
  //-----------------------------------------------------
</script>
<template>
  <div class="ti-search-bar">This is TiSearchBar</div>
</template>
