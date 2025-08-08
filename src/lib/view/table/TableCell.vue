<script lang="ts" setup>
  import { computed } from "vue";
  import { getFieldValue } from "../../../_type";
  import { useFieldCom } from "../../_features/field";
  import { TableCellEmitter, TableCellProps } from "./ti-table-types";
  //-------------------------------------------------------
  defineOptions({
    inheritAttrs: false,
  });
  //-------------------------------------------------------
  const emit = defineEmits<TableCellEmitter>();
  //-------------------------------------------------------
  const props = withDefaults(defineProps<TableCellProps>(), {
    autoValue: "value",
    checkEquals: true,
    rowIndex: 0,
    colIndex: 0,
    editable: true,
  });
  //-------------------------------------------------------
  const CellValue = computed(() => {
    let val = getFieldValue(props.name, props.data);
    // if ("load_etd" == props.name && val && val.startsWith('2025-09-09')) {
    //   console.log("CellValue, name=", props.name, ", val=", val);
    // }
    if (props.transformer) {
      return props.transformer(val, props.data, props.name);
    }
    return val;
  });
  //-------------------------------------------------
  const CellDynamicContext = computed(() => {
    return {
      ...(props.vars ?? {}),
      uniqKey: props.uniqKey,
      name: props.name,
      value: CellValue.value,
      data: props.data,
    };
  });
  //-------------------------------------------------
  const FieldReadonly = computed(() => {
    if (props.readonly) {
      return props.readonly.test(CellDynamicContext.value);
    }
    return false;
  });
  //-------------------------------------------------
  const FieldDisabled = computed(() => {
    if (props.disabled) {
      return props.disabled.test(CellDynamicContext.value);
    }
    return false;
  });
  //-------------------------------------------------------
  const Cell = computed(() => useFieldCom(props));
  const CellCom = computed(() => {
    let readonly = FieldReadonly.value;
    let disabled = FieldDisabled.value;
    let re = Cell.value.autoGetCom(
      { actived: props.activated && props.editable && !disabled, readonly },
      CellDynamicContext.value,
      CellValue.value
    );
    // 暗戳戳的标记一下控件的 disabled 状态，因为有些控件可以针对这个状态做特殊显示
    if (re.comConf && FieldDisabled.value) {
      if ("TiLabel" === re.comType.name) {
        re.comConf.type = "disable";
      } else {
        re.comConf.disable = true;
      }
    }
    return re;
  });
  //-------------------------------------------------------
  const CellListeners = computed(() => {
    let listen = {} as Record<string, Function>;
    let changeEventName = props.changeEventName || "change";
    if (changeEventName && !FieldDisabled.value) {
      listen[changeEventName] = (val: any) => {
        // 防守
        if (FieldDisabled.value) {
          return;
        }
        // 通知改动
        emit("cell-change", {
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
      :is="CellCom.rawCom"
      v-bind="CellCom.comConf"
      v-on="CellListeners" />
  </div>
</template>
<style lang="scss">
  @use "@site0/tijs/sass/_all.scss" as *;
  .table-cell-wrapper {
    @include flex-align-nowrap($jc: stretch, $ai: stretch);
    > * {
      flex: 1 1 auto;
    }
  }
</style>
