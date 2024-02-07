<script lang="ts" setup>
  import { CssUtils } from '../../../../core';
  import { TiCell } from '../../../';
  import _ from 'lodash';
  import { Ref, computed, onMounted, ref } from 'vue';
  import { TableRowEvent, TableRowEventName } from '../table-types';
  import { TableRowProps } from './use-table-row';
  /*-------------------------------------------------------

                     Com Options

-------------------------------------------------------*/
  defineOptions({
    name: 'TableRow',
    inheritAttrs: false,
  });

  const $cells = ref() as Ref<Array<HTMLElement> | HTMLElement>;
  /*-------------------------------------------------------

                      Props

-------------------------------------------------------*/
  const props = withDefaults(defineProps<TableRowProps>(), {
    showRowMarker: true,
    showCheckbox: true,
    showRowIndex: true,
    canHover: true,
    canCheck: true,
    canSelect: true,
  });
  /*-------------------------------------------------------

                    Event Bus

-------------------------------------------------------*/
  let emit = defineEmits<{
    (event: TableRowEventName, payload: TableRowEvent): void;
  }>();
  /*-------------------------------------------------------

                      Computed

-------------------------------------------------------*/
  // 是否显示行前的空白标记单元格
  const ShowIndentor = computed(() => (props.indent ?? 0) > 0);
  const RowCellClass = computed(() =>
    CssUtils.mergeClassName({
      'is-actived': props.activated,
      'is-checked': props.checked,
      'can-hover': props.canHover,
    }),
  );
  const RowIndentStyle = computed(() => {
    if (props.indent && props.indent > 0) {
      let indent;
      if (_.isNumber(props.indentSize)) {
        indent = `${props.indentSize * props.indent}px`;
      } else {
        indent = `calc(${props.indentSize} * ${props.indent})`;
      }
      return {
        width: indent,
      };
    }
  });

  onMounted(() => {
    let els = $cells.value;
    let $cell: HTMLElement;
    if (els instanceof HTMLElement) {
      $cell = els;
    } else if (_.isArray(els)) {
      $cell = els[0];
    } else {
      return;
    }
    let { row, updateRowHeight } = props;
    let H = $cell.getBoundingClientRect().height;
    //console.log(`row ${props.rowIndex} mounted`, H, $cell)
    updateRowHeight(row.index, H);
  });
</script>
<template>
  <!--空白指示单元格-->
  <div
    v-if="props.showRowMarker"
    class="table-row-marker"
    :class="RowCellClass"
    :row-id="props.row.id"
    :row-index="props.row.index"
    @click="emit('select', { row: props.row, event: $event })">
    <!--选择框-->
    <template v-if="props.showCheckbox">
      <span
        class="as-checker"
        @click.stop="emit('check', { row: props.row, event: $event })">
        <i v-if="props.checked" class="zmdi zmdi-check-square"></i>
        <i v-else class="zmdi zmdi-square-o"></i>
      </span>
    </template>
    <!--行号-->
    <span v-if="props.showRowIndex" class="as-row-index">{{
      props.row.index + 1
    }}</span>
    <!--Activated 指示器-->
    <span
      class="as-actived"
      @click="emit('open', { row: props.row, event: $event })"
      ><i v-if="props.activated" class="zmdi zmdi-caret-right"></i
    ></span>
  </div>
  <!--正式列单元格-->
  <template v-for="(cell, i) in props.columns" :key="cell.uniqKey">
    <div
      class="table-cell as-body"
      :row-id="props.row.id"
      :row-index="props.row.index"
      :col="i"
      :class="RowCellClass"
      ref="$cells">
      <!--首列，这里有可能插入缩进占位块-->
      <div
        v-if="0 === i && ShowIndentor"
        class="row-indent"
        :style="RowIndentStyle"></div>
      <!--插入单元格控件-->
      <TiCell
        v-bind="cell"
        :rowIndex="props.row.index"
        :colIndex="i"
        :data="props.row.rawData"
        :vars="props.vars"
        :activated="props.activated && i == props.activedColIndex"
        @click="emit('cell', { row: props.row, event: $event, colIndex: i })"
        @dblclick="
          emit('cell-open', { row: props.row, event: $event, colIndex: i })
        " />
    </div>
  </template>
</template>
<style lang="scss">
  @import './table-row.scss';
</style>
