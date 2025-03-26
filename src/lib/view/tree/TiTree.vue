<script lang="ts" setup>
  import { TreeProps, useTreeData } from '@site0/tijs';
  import { computed, watch } from 'vue';
  //-----------------------------------------------------
  const props = defineProps<TreeProps>();
  //-----------------------------------------------------
  const _tree = computed(() => useTreeData(props));
  //-----------------------------------------------------
  const TreeFlatenData = computed(() => _tree.value.getTreeData());
  //-----------------------------------------------------
  watch(
    () => props.data,
    () => {
      _tree.value.buildTree(props.data ?? []);
    },
    { immediate: true }
  );
  //-----------------------------------------------------
</script>
<template>
  <div class="ti-tree">
    TiTree
    <pre style="font-size:10px; line-height: 1.2em;">{{ TreeFlatenData }}</pre>
  </div>
</template>
<style lang="scss">
  @use './ti-tree.scss';
</style>
