<script lang="ts" setup>
  import {
    ListSelectEmitInfo,
    RowIndentStatus,
    TableRowData,
    TableRowID,
    TiTable,
    ToggleRowStatusPayload,
    TreeEmitter,
    TreeSelectEmitInfo,
    TreeTableProps,
    useTreeData,
  } from '@site0/tijs';
  import _ from 'lodash';
  import { computed, reactive, watch } from 'vue';
  //-----------------------------------------------------
  const emit = defineEmits<TreeEmitter>();
  //-----------------------------------------------------
  const props = withDefaults(defineProps<TreeTableProps>(), {
    size: 'm',
    canSelect: true,
    canHover: true,
    allowUserSelect: false,
    highlightChecked: true,
    autoOpen: 0,
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
    let re = _.omit(
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
  const _node_status = reactive(new Map<TableRowID, RowIndentStatus>());
  const _tree = computed(() => useTreeData(props, _node_status));
  //-----------------------------------------------------
  const TreeFlatenData = computed(() => _tree.value.getFlattenData());
  const TreeIndents = computed(() => _tree.value.getTreeIndents());
  //-----------------------------------------------------
  function onToggleRowStatus(payload: ToggleRowStatusPayload) {
    _tree.value.toggleNodeStatus(payload.id);
  }
  //-----------------------------------------------------
  function onRowSelect(payload: ListSelectEmitInfo) {
    // 尝试自动打开下属节点
    let id = payload.currentId;
    if (!_.isNil(id) && props.autoOpen > 0) {
      let hie = _tree.value.getHierarchy(id);
      if (hie) {
        _tree.value.setNodeStatus(hie.id, 'open', props.autoOpen - 1);
      }
    }

    // 通知
    let re: TreeSelectEmitInfo = {
      ...payload,
      path: _tree.value.getAncestorNodes(id),
      currentNode: _tree.value.getNode(id),
      checkedNodes: _tree.value.getNodes(...payload.checkedIds.keys()),
    };
    emit('select', re);
  }
  //-----------------------------------------------------
  function onRowOpen(row: TableRowData) {
    let node = _tree.value.getNode(row.id);
    emit('open', node!);
  }
  //-----------------------------------------------------
  watch(
    () => props.data,
    (newData, oldData) => {
      if (!_.isEqual(newData, oldData)) {
        _tree.value.buildTree(props.data ?? []);
        _tree.value.resetNodeStatus({ force: true });
      }
    },
    { immediate: true }
  );
  //-----------------------------------------------------
</script>
<template>
  <TiTable
    v-bind="ListProps"
    :data="TreeFlatenData"
    :row-indents="TreeIndents"
    :row-stauts="_node_status"
    @toggle:status="onToggleRowStatus"
    @select="onRowSelect"
    @open="onRowOpen" />
</template>
