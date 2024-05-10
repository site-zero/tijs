<script lang="ts" setup>
  import { computed } from 'vue';
  import { COM_TYPES } from '../../lib-com-types';
  import { CellChanged, CellEvents, CellProps } from '../../';
  import { useCell } from './use-cell';
  defineOptions({
    name: COM_TYPES.Cell,
    inheritAttrs: true,
  });
  let props = withDefaults(defineProps<CellProps>(), {
    autoValue: 'value',
    checkEquals: true,
    rowIndex: 0,
    colIndex: 0,
  });

  let emit = defineEmits<{
    (event: CellEvents, payload: CellChanged): void;
  }>();
  //
  // Use Cell Feature
  //
  const Cell = computed(() => useCell(props, { emit }));
</script>

<template>
  <div class="ti-cell">
    <div class="ti-cell-con">
      <component
        :is="Cell.CellComType"
        v-bind="Cell.CellComConf"
        v-on="Cell.CellListeners" />
    </div>
  </div>
</template>

<style lang="scss">
  @import './ti-cell.scss';
</style>
