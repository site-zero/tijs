<script lang="ts" setup>
  import _ from "lodash";
  import { computed } from "vue";
  import { getFieldValue } from "../../../_type";
  import { CssUtils } from "../../../core";
  import { FieldComFeature, useFieldCom } from "../../_features/field";
  import {
    TableCellEmitter,
    TableCellEventPayload,
    TableCellProps,
  } from "./ti-table-types";
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
  const TopClass = computed(() => {
    return CssUtils.mergeClassName({
      "is-actived": FieldActived.value,
      "is-checked": props.rowChecked,
      "has-actived-com": props.activatedComType ? true : false,
      "can-hover": props.rowCanHover,
      [`is-${props.rowType ?? ""}`]: props.rowType ? true : false,
      "is-odd": props.rowIsOdd,
      "is-even": !props.rowIsOdd,
    });
  });
  //-------------------------------------------------------
  const CellValue = computed(() => {
    let ctx = CellDynamicContext.value;
    let val = ctx.$field?.value;
    //console.log("CellValue, name=", props.name, ", val=", val);
    if (props.transformer) {
      return props.transformer(val, ctx, props.name);
    }
    return val;
  });
  //-------------------------------------------------
  function getCellDynamicContext() {
    let val = getFieldValue(props.name, props.data);
    return {
      ...props.data,
      $vars: props.vars,
      $field: {
        uniqKey: props.uniqKey,
        name: props.name,
        value: val,
      },
    };
  }
  //-------------------------------------------------
  const CellDynamicContext = computed(() => getCellDynamicContext());
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
  const FieldActived = computed(() => {
    if (!props.activated || FieldDisabled.value || FieldReadonly.value) {
      return false;
    }
    if (props.useReadonly) {
      return true;
    }
    return props.editable;
  });
  //-------------------------------------------------------
  const Cell = computed((): FieldComFeature => useFieldCom(props));
  const CellCom = computed(() => {
    const readonly = FieldReadonly.value;
    const actived = FieldActived.value;
    const ctx = CellDynamicContext.value;
    const _cell = Cell.value;
    const _cell_val = CellValue.value;
    let re = _cell.autoGetCom({ actived, readonly }, ctx, _cell_val);
    // 如果是标签控件，可以悄悄做更都操作
    // 暗戳戳的标记一下控件的 disabled 状态，因为有些控件可以针对这个状态做特殊显示
    if (re.comConf && FieldDisabled.value) {
      if ("TiLabel" === re.comType.name && !re.comConf.type) {
        re.comConf.type = "fog";
      } else {
        re.comConf.disable = true;
      }
    }
    // 如果是 Input 控件，那么设置一下默认属性
    if (re.comConf && /^(TiInput)/.test(re.comType.name)) {
      _.defaults(re.comConf, {
        boxRadius: "none",
        hideBorder: true,
        autoSelect: true,
        autoFocus: true,
      });
    }
    // 有主题的 row 可以让 Label 继承自己的颜色
    if (
      props.rowType &&
      "TiLabel" === re.comType.name &&
      !re.comConf.boxInherit
    ) {
      re.comConf.boxInherit = ["text"];
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
  function onCell(eventName: "cell-select" | "cell-open", event: Event) {
    let payload: TableCellEventPayload = {
      uniqKey: props.uniqKey,
      colIndex: props.colIndex,
      rowIndex: props.rowIndex,
      event,
    };
    if ("cell-select" === eventName) {
      emit("cell-select", payload);
    } else {
      emit("cell-open", payload);
    }
  }
  //-------------------------------------------------------
</script>
<template>
  <div
    :key="props.uniqKey"
    class="table-cell as-body"
    :row-id="props.rowId"
    :row-index="props.rowIndex"
    :col="props.colIndex"
    :class="TopClass"
    ref="$cells"
    @click.stop="onCell('cell-select', $event)"
    @dblclick.stop="onCell('cell-open', $event)">
    <div
      v-if="0 === props.colIndex && props.showIndentor"
      class="row-indent"
      :style="props.rowIndentStyle"></div>
    <div class="table-cell-wrapper">
      <component
        :is="CellCom.rawCom"
        v-bind="CellCom.comConf"
        v-on="CellListeners" />
    </div>
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
