<script lang="ts" setup>
  import _ from "lodash";
  import { computed, inject } from "vue";
  import { TableSelectEmitInfo, TiTree } from "../../../";
  import { Util } from "../../../../core";
  import { TI_RICH_EDITOR_API_KEY } from "./ti-edit-rich-prose-types";
  //-----------------------------------------------------
  const api = inject(TI_RICH_EDITOR_API_KEY);
  //-----------------------------------------------------
  const TreeStyle = computed(() => {
    return {
      lineHeight: "2em",
    };
  });
  //-----------------------------------------------------
  const isLeafNode = {
    leaf: true,
  };
  //-----------------------------------------------------
</script>
<template>
  <TiTree
    class="fit-parent"
    :style="TreeStyle"
    :data="api?.TreeData.value"
    :checkedIds="api?.TreeCheckedIds.value"
    :canSelect="false"
    :multi="true"
    :autoScrollIntoView="true"
    :isNodeOpen="3"
    :isLeafNode="isLeafNode"
    size="t" />
</template>
