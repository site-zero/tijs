<script lang="ts" setup>
  import _ from 'lodash';
  import {
    Ref,
    computed,
    onMounted,
    onUnmounted,
    reactive,
    ref,
    watch,
  } from 'vue';
  import {
    TiActionBar,
    TiRoadblock,
    useFieldChange,
    useLargeScrolling,
  } from '../../';
  import { Size2D, TableRowID } from '../../../_type';
  import { CssUtils } from '../../../core';
  import TableRow from './TableRow.vue';
  import { buildTableColumnsMap } from './build-table-column';
  import {
    HEAD_MARKER,
    TableCellChanged,
    TableEmitter,
    TableProps,
    TableSelection,
    TableStrictColumn,
  } from './ti-table-types';
  import {
    ColResizingState,
    getRowActivedColUniqKey,
    useTable,
  } from './use-table';
  import { TableScrolling, getTableDebugInfo } from './use-table-debug-info';
  import { useTableHeadMenu } from './use-table-head-menu';
  import { loadColumns, useKeepTable } from './use-table-keep';
  import { useViewMeasure } from './use-view-measure';

  //-------------------------------------------------------
  const debug = false;
  //-------------------------------------------------------
  const showDebugScrolling = false;
  const showDebugResizing = false;
  const showDebug = showDebugScrolling || showDebugResizing;
  //-------------------------------------------------------
  defineOptions({
    name: 'TiTable',
    inheritAttrs: true,
  });
  //-------------------------------------------------------
  let emit = defineEmits<TableEmitter>();
  //-------------------------------------------------------
  let props = withDefaults(defineProps<TableProps>(), {
    showRowIndex: true,
    showHeader: true,
    columnResizable: true,
    multi: true,
    showCheckbox: true,
    canHover: true,
    canSelect: true,
    canCheck: true,
    editable: true,
    getId: 'id',
    columnResizeInTime: 25,
    rowMinHeight: 32,
    rowGap: 1,
    colGap: 1,
    changeMode: 'diff',
    colDefaultWidth: 0,
    data: () => [],
    emptyRoadblock: () => ({
      text: 'i18n:empty-data',
      mode: 'auto',
      layout: 'A',
      size: 'normal',
      opacity: 'shadowy',
      icon: 'zmdi-apps',
    }),
  });
  //-------------------------------------------------------
  const Keep = computed(() => useKeepTable(props));
  let Table = computed(() => useTable(props, emit));
  //-------------------------------------------------------
  const $main: Ref<HTMLElement> = ref() as Ref<HTMLElement>;
  //-------------------------------------------------------
  // 如果采用 IntersectionObserver 就没必要监控 scrolling 的变化了
  const scrolling: TableScrolling = reactive({
    viewport: { width: 0, height: 0 },
    lineHeights: [] as number[],
    defaultLineHeight: props.rowMinHeight,
    lineCount: props.data.length,
    scrollTop: 0,
    cacheZoneHeight: 600,
    lineMarkers: [] as number[],
  });
  const selection = reactive({
    currentId: undefined,
    checkedIds: new Map<TableRowID, boolean>(),
    ids: [],
    uniqKey: null,
    lastSelectIndex: -1,
  } as TableSelection);
  //-------------------------------------------------------
  /**
   * 定制每个列的宽高，0 表示这个行是自动 `1fr`
   */
  const _column_sizes = ref<Record<string, number>>({});
  //-------------------------------------------------------
  const _col_resizing = reactive({
    activated: false,
    left: -1,
    colIndex: -1,
  } as ColResizingState);
  //-------------------------------------------------------
  //                     View Measure
  //-------------------------------------------------------
  const _mea = useViewMeasure({
    getMainElement: () => $main.value,
    setViewport: (viewport: Size2D) => {
      scrolling.viewport = viewport;
    },
    setScrollTop: (scrollTop: number) => {
      scrolling.scrollTop = scrollTop;
    },
    debounce: 300,
  });
  //-------------------------------------------------------
  //                  Computed
  //-------------------------------------------------------
  const isInRenderZone = computed(() => useLargeScrolling(scrolling));
  const TopClass = computed(() => CssUtils.mergeClassName(props.className));
  //-------------------------------------------------------
  const _table_column_map = computed(() => buildTableColumnsMap(props));
  const AllTableColumns = computed(() => {
    return Array.from(_table_column_map.value.values());
  });
  //-------------------------------------------------------
  const _display_column_keys = ref<string[]>([]);
  const TableColumns = computed(() => {
    let re = [] as TableStrictColumn[];
    // 采用默认
    if (_.isEmpty(_display_column_keys.value)) {
      for (let col of _table_column_map.value.values()) {
        if (!col.candidate) {
          re.push(col);
        }
      }
    }
    // 指定了 column key
    else {
      for (let key of _display_column_keys.value) {
        let col = _table_column_map.value.get(key);
        if (col) {
          re.push(col);
        }
      }
    }
    return re;
  });
  //-------------------------------------------------------
  const TableData = computed(() => {
    return Table.value.getTableData();
  });
  const hasData = computed(() => TableData.value.length > 0);
  //-------------------------------------------------------
  const ShowRowMarker = computed(
    () => props.showCheckbox || props.showRowIndex
  );
  //-------------------------------------------------------
  const HeadMenu = computed(() =>
    useTableHeadMenu(
      selection,
      Table.value,
      AllTableColumns,
      _column_sizes,
      _display_column_keys,
      Keep.value
    )
  );
  //-------------------------------------------------------
  const Change = useFieldChange(
    {
      changeMode: props.changeMode,
      linkFields: props.linkFields,
    },
    TableColumns.value
  );
  //-------------------------------------------------------
  //                      计算格子的列
  //-------------------------------------------------------
  const MainStyle = computed(() => {
    // console.log('re-computed MainStyle');
    let cols = [] as any[];
    const __push_col_size = function (sz: any) {
      if (_.isNumber(sz) && sz > 0) {
        cols.push(`${sz}px`);
      } else if (_.isString(sz)) {
        cols.push(sz);
      } else {
        cols.push('1fr');
      }
    };

    // 如果需要显示行头标记列 ...
    if (ShowRowMarker.value) {
      let w = _column_sizes.value[HEAD_MARKER] ?? '60px';
      __push_col_size(w);
    }
    // 每列都需要看看是否被定制了
    for (let col of TableColumns.value) {
      // 0 就表示 `1fr`
      let sz = _column_sizes.value[col.uniqKey] ?? 0;
      //console.log('- col:', col.uniqKey, sz, typeof sz);
      __push_col_size(sz);
    }
    //console.log('re-computed MainStyle', cols.join(' '));

    let re = _.assign({}, props.mainStyle, {
      'grid-template-columns': cols.join(' '),
      'grid-auto-rows': `minmax(${props.rowMinHeight - props.rowGap}px, auto)`,
      'row-gap': `${props.rowGap}px`,
      'column-gap': `${props.colGap}px`,
    });

    if (props.columnResizable || !_.isNil(props.rightPadding)) {
      re.paddingRight = CssUtils.toSize(props.rightPadding ?? '100px');
    }

    return re;
  });
  //-------------------------------------------------------
  //                 虚拟占位行
  //-------------------------------------------------------
  const VirtualRowStyle = computed(() => {
    let N = TableColumns.value.length;
    // 显示行头标记列，需要凭空为列+1
    if (ShowRowMarker.value) {
      N++;
    }
    return {
      'grid-column': `1 / ${N + 1}`,
    };
  });
  //-------------------------------------------------------
  //              提示列 resizing-bar
  //-------------------------------------------------------
  const ResizingBarStyle = computed(() => {
    return {
      left: `${_col_resizing.left + 1}px`,
    };
  });
  //-------------------------------------------------------
  //                     调试滚动信息
  //-------------------------------------------------------
  const DebugInfo = computed(() => getTableDebugInfo(scrolling, showDebug));
  //-------------------------------------------------------
  //                     Methods
  //-------------------------------------------------------
  // TODO 如果采用 IntersectionObserver ，那么这个就没必要了
  function updateRowHeight(rowIndex: number, height: number) {
    // 如果没有设置过真实行高，那么也更新一下默认
    if (_.isEmpty(scrolling.lineHeights)) {
      scrolling.defaultLineHeight = height + props.rowGap;
    }
    scrolling.lineHeights[rowIndex] = height + props.rowGap;
  }
  //-------------------------------------------------------
  //                Event Cell Changed
  //-------------------------------------------------------
  function onClickMain() {
    Table.value.selectNone(selection);
  }
  //-------------------------------------------------------
  function onCellChange(changed: TableCellChanged) {
    if (debug) console.log('OnCellChange', changed);

    // 首先通知单元格改动
    emit('cell-change', changed);

    // 尝试通知行改动
    let { colIndex, rowIndex } = changed;

    let oldRowData = _.nth(TableData.value, rowIndex)?.rawData;

    // 更新值，并通知改动
    Change.tidyValueChange(
      changed,
      { checkEquals: true, data: oldRowData || {} },
      (rowData, _changes, field) => {
        emit('row-change', {
          colIndex,
          rowIndex,
          uniqKey: field.uniqKey,
          name: field.name,
          changed: rowData,
          oldRowData,
        });
      }
    );
  }
  //-------------------------------------------------------
  //                  Life Hooks
  //-------------------------------------------------------
  watch(
    () => props.data,
    () => {
      scrolling.lineCount = props.data.length;
      scrolling.lineHeights = [];
      scrolling.lineMarkers = [];
      selection.ids = Table.value.getRowIds(props.data ?? []);
      if (!_mea.isMainWatched()) {
        _mea.watchMain();
      }
      _mea.updateMeasure();
    },
    { deep: true }
  );
  //-------------------------------------------------------
  watch(
    () => [props.currentId, props.checkedIds],
    () => {
      //console.log('updateSelection before:', props.currentId, props.checkedIds);
      Table.value.updateSelection(
        selection,
        props.data ?? [],
        props.currentId,
        props.checkedIds
      );
      // console.log(
      //   'updateSelection after',
      //   selection.currentId,
      //   selection.checkedIds
      // );
    },
    {
      immediate: true,
    }
  );
  // watch(
  //   () => TableColumns.value,
  //   () => {
  //     //console.log('columns changed', TableColumns.value.length);
  //   }
  // );
  //-------------------------------------------------------
  watch(
    () => props.keepColumns,
    () => {
      if (debug) console.log('keepColumns changed', props.keepColumns);
      loadColumns(
        AllTableColumns,
        _column_sizes,
        _display_column_keys,
        Keep.value
      );
      _mea.updateMeasure();
    }
  );
  //-------------------------------------------------------
  onMounted(() => {
    Table.value.bindTableResizing(
      $main.value,
      _col_resizing,
      _column_sizes,
      _display_column_keys,
      ShowRowMarker.value,
      onUnmounted,
      Keep
    );
    loadColumns(TableColumns, _column_sizes, _display_column_keys, Keep.value);
    _mea.watchMain();
  });
  //-------------------------------------------------------
  onUnmounted(() => {
    _mea.unWatchMain();
  });
  //-------------------------------------------------------
</script>
<template>
  <div
    class="ti-table"
    :class="TopClass">
    <main
      ref="$main"
      :style="MainStyle"
      @click="onClickMain">
      <!-- 表格头 -->
      <template v-if="showHeader">
        <!-- 表头: 标记块 -->
        <div
          v-if="ShowRowMarker"
          class="table-cell as-head as-marker"
          :col-key="HEAD_MARKER"
          @click.stop>
          <TiActionBar v-bind="HeadMenu" />
        </div>
        <!-- 表头: 列 -->
        <template
          v-for="(col, i) in TableColumns"
          :key="col.uniqKey">
          <div
            class="table-cell as-head"
            :class="Table.getTableHeadClass(selection, col)"
            :col-index="i"
            :cols-count="TableColumns.length"
            :col-key="col.uniqKey"
            :col-prev-key="i == 0 ? HEAD_MARKER : TableColumns[i - 1]?.uniqKey"
            :title="col.tip">
            <div class="head-cell-con">
              <!-- 调整列宽的控制柄 -->
              <div class="column-resize-hdl for-prev"></div>
              <!-- 列标题 -->
              <span class="head-text">{{ col.title || col.name }}</span>
              <!-- 调整列宽的控制柄: 最后一列 -->
              <div
                v-if="i == TableColumns.length - 1"
                class="column-resize-hdl for-self"></div>
            </div>
          </div>
        </template>
      </template>
      <!-- 表格体 -->

      <template
        v-for="row in TableData"
        :key="row.id">
        <!--================== < 表格行 > ================-->
        <div
          v-if="!isInRenderZone(row.index)"
          class="virtual-row"
          :style="VirtualRowStyle"></div>
        <TableRow
          v-else
          :columns="TableColumns"
          :columnMap="_table_column_map"
          :showRowMarker="ShowRowMarker"
          :showCheckbox="showCheckbox"
          :showRowIndex="showRowIndex"
          :row="row"
          :vars="vars"
          :activated="row.id == selection.currentId"
          :checked="Table.selectable.isIDChecked(selection, row.id)"
          :indent="row.indent"
          :editable="props.editable"
          :activedColUniqKey="getRowActivedColUniqKey(selection, row)"
          :updateRowHeight="updateRowHeight"
          @row-select="Table.OnRowSelect(selection, $event)"
          @row-check="Table.OnRowCheck(selection, $event)"
          @row-open="Table.OnRowOpen(selection, $event)"
          @cell-select="
            Table.OnCellSelect(selection, $event, _table_column_map)
          "
          @cell-open="Table.OnCellOpen(selection, $event)"
          @cell-change="onCellChange" />
      </template>
      <!-- 显示空数据提示 -->
      <div
        v-if="!hasData"
        class="empty-tip"
        :style="VirtualRowStyle">
        <TiRoadblock v-bind="props.emptyRoadblock" />
      </div>
    </main>
    <!-- 显示拖拽的列分割条-->
    <div
      class="resizing-bar"
      :style="ResizingBarStyle"
      v-if="_col_resizing.activated"></div>
    <!-- vvvvvvvvvvvvv 下面是调试信息，无需在意 vvvvvvvvvvvvv-->
    <div
      class="table-debug-info"
      v-if="showDebug">
      <template v-if="showDebugResizing">
        {{ _column_sizes }} <br />
        [{{ _col_resizing.colIndex }}] -> {{ _col_resizing.left }}
      </template>
      <template v-if="showDebugScrolling">
        {{ scrolling.viewport }}
        - {{ scrolling.scrollTop }} x {{ scrolling.defaultLineHeight }} - fill:
        {{ scrolling.lineHeights.length }} / {{ scrolling.lineCount }}
        <ul>
          <li v-for="(info, i) in DebugInfo">
            <code>{{ i }}) </code> <code>{{ info }}</code>
          </li>
        </ul>
        <div class="scroll-marker">
          {{
            _.map(scrolling.lineMarkers, (v: any) => (v ? 'x' : '-')).join('')
          }}
        </div>
      </template>
    </div>
    <!--^^^^^^^^^^^^^ 上面是调试信息，无需在意 ^^^^^^^^^^^^^-->
  </div>
</template>
<style lang="scss">
  @use './style/ti-table.scss';
  @use './style/table-row.scss';
  @use './style/table-cell.scss';
  @use './style/table-resize.scss';
  @use './style/table-color.scss';
  @use './style/table-debug.scss';
  @use './style/table-zebra.scss';
</style>
