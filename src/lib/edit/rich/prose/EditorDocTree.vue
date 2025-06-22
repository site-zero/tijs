<script lang="ts" setup>
  import { inject } from "vue";
  import { TiTree } from "../../../";
  import { TI_RICH_EDITOR_API_KEY } from "./ti-edit-rich-prose-types";
  //-----------------------------------------------------
  const _api = inject(TI_RICH_EDITOR_API_KEY);
  //-----------------------------------------------------
</script>
<template>
  <TiTree :data="_api?.TreeData.value" :isNodeOpen="3" />
</template>
