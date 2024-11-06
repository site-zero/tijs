<script lang="ts" setup>
  import { computed } from 'vue';
  import { getFieldValue } from '../../../_type';
  import { useFieldCom } from '../../_features/field';
  import { TableCellEmitter, TableCellProps } from './ti-table-types';
  //-------------------------------------------------------
  defineOptions({
    inheritAttrs: false,
  });
  //-------------------------------------------------------
  const emit = defineEmits<TableCellEmitter>();
  //-------------------------------------------------------
  const props = withDefaults(defineProps<TableCellProps>(), {
    autoValue: 'value',
    checkEquals: true,
    rowIndex: 0,
    colIndex: 0,
    editable: true,
  });
  //-------------------------------------------------------
  const CellValue = computed(() => {
    let val = getFieldValue(props.name, props.data);
    if (props.transformer) {
      return props.transformer(val, props.data, props.name);
    }
    return val;
  });
  //-------------------------------------------------------
  const Cell = computed(() => useFieldCom(props));
  const CellCom = computed(() => {
    return Cell.value.autoGetCom(
      { actived: props.activated && props.editable },
      {
        ...props.vars,
        data: props.data,
      },
      CellValue.value
    );
  });
  //-------------------------------------------------------
  const CellListeners = computed(() => {
    let listen = {} as Record<string, Function>;
    let changeEventName = props.changeEventName || 'change';
    if (changeEventName && !props.disabled) {
      listen[changeEventName] = (val: any) => {
        // 防守
        if (props.disabled) {
          return;
        }
        // 通知改动
        emit('cell-change', {
          uniqKey: props.uniqKey,
          name: props.name,
          value: val,
          oldVal: CellValue.value,
          rowIndex: props.rowIndex,
          colIndex: props.colIndex,
        });
      };
    }
    return listen;
  });
  //-------------------------------------------------------
</script>
<template>
  <div class="table-cell-wrapper">
    <component
      :is="CellCom.comType"
      v-bind="CellCom.comConf"
      v-on="CellListeners" />
  </div>
</template>
