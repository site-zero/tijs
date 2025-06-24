<script lang="ts" setup>
  import { computed, inject } from "vue";
  import { TiTree } from "../../../";
  import { TI_RICH_EDITOR_API_KEY } from "./ti-edit-rich-prose-types";
  //-----------------------------------------------------
  const _api = inject(TI_RICH_EDITOR_API_KEY);
  //-----------------------------------------------------
  const TreeStyle = computed(() => {
    return {
      lineHeight: "0.5em",
    };
  });
  //-----------------------------------------------------
</script>
<template>
  <TiTree
    :style="TreeStyle"
    :data="_api?.TreeData.value"
    :isNodeOpen="3"
    size="t" />
</template>
