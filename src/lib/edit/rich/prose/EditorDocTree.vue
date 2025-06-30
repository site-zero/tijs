<script lang="ts" setup>
  import { computed, inject } from "vue";
  import { TiTree, TreeNode } from "../../../";
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
  function isLeafNode(treeNode: TreeNode) {
    return treeNode.data.leaf ?? false;
  }
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
    :isNodeOpen="5"
    :isLeafNode="isLeafNode"
    size="t" />
</template>
