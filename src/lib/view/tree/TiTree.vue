<script lang="ts" setup>
  import {
    TiList,
    ToggleRowStatusPayload,
    TreeProps,
    useTreeData,
  } from '@site0/tijs';
  import _ from 'lodash';
  import { computed, watch } from 'vue';
  //-----------------------------------------------------
  const props = withDefaults(defineProps<TreeProps>(), {
    size: 'm',
    canSelect: true,
    canHover: true,
    allowUserSelect: false,
    autoI18n: true,
    textAsHtml: true,
    highlightChecked: true,
    rowIndicators: () => ({
      open: '<i class="zmdi zmdi-chevron-down"></i>',
      closed: '<i class="zmdi zmdi-chevron-right"></i>',
    }),
    rowStatusIcons: () => ({
      open: '<i class="fas fa-folder-open"></i>',
      closed: '<i class="fas fa-folder"></i>',
    }),
  });
  //-----------------------------------------------------
  const ListProps = computed(() => {
    let re =  _.omit(
      props,
      'data',
      // TreeDataProps
      'isLeafNode',
      'isNodeOpen',
      'childrenKey',
      'getNodeId',
      'getParntNodeId',
      'virtualRootNode',
      'forceUseVirtualRoot',
      // RowIndentProps
      'rowIndents',
      'rowStauts'
    );
    
    return re;
  });
  //-----------------------------------------------------
  const _tree = computed(() => useTreeData(props));
  //-----------------------------------------------------
  const TreeFlatenData = computed(() => _tree.value.getFlattenData());
  const TreeIndents = computed(() => _tree.value.getTreeIndents());
  const RowStatus = computed(() => _tree.value.getNodeStatus());
  //-----------------------------------------------------
  function onToggleRowStatus(payload: ToggleRowStatusPayload) {
    _tree.value.toggleNodeStatus(payload.id);
  }
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
  <!--pre>{{ TreeFlatenData }}</pre-->
  <TiList
    v-bind="ListProps"
    :data="TreeFlatenData"
    :row-indents="TreeIndents"
    :row-stauts="RowStatus"
    @toggle:status="onToggleRowStatus" />
</template>
<style lang="scss">
  @use './ti-tree.scss';
</style>
