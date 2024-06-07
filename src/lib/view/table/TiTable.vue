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
    Alert,
    TiIcon,
    TiRoadblock,
    useFieldChange,
    useLargeScrolling,
  } from '../../';
  import { CssUtils, Size2D, Util, getLogger } from '../../../core';
  import { COM_TYPES } from '../../lib-com-types';
  import TableRow from './TableRow.vue';
  import { buildTableColumns } from './build-table-column';
  import { TableCellChanged, TableEmitter, TableProps } from './ti-table-types';
  import {
    ColResizingState,
    getRowActivedColIndex,
    useTable,
  } from './use-table';
  import { TableScrolling, getTableDebugInfo } from './use-table-debug-info';
  import { loadColumnSizes, useKeepTable } from './use-table-keep';
  import { useViewMeasure } from './use-view-measure';
  //-------------------------------------------------------
  const COM_TYPE = COM_TYPES.Table;
  const log = getLogger(COM_TYPE);
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
    getId: 'id',
    showHeader: true,
    columnResizable: true,
    columnResizeInTime: 50,
    rowMinHeight: 32,
    showRowIndex: true,
    rowGap: 1,
    colGap: 1,
    showCheckbox: true,
    canHover: true,
    canSelect: true,
    canCheck: true,
    changeMode: 'diff',
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
  const selection = reactive(Table.value.createSelection());
  //-------------------------------------------------------
  /**
   * 定制每个列的宽高，0 表示这个行是自动 `1fr`
   */
  const columnSizes: Ref<number[]> = ref([]);
  //-------------------------------------------------------
  const colResizing = reactive({
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
  const TableColumns = computed(() => buildTableColumns(props));
  const TableData = computed(() => {
    return Table.value.getTableData(selection);
  });
  const hasData = computed(() => TableData.value.length > 0);
  const ShowRowMarker = computed(
    () => props.showCheckbox || props.showRowIndex
  );
  const RowCheckStatus = computed(() => Table.value.getCheckStatus(selection));
  const RowCheckStatusIcon = computed(() => {
    return {
      all: 'zmdi-check-square',
      part: 'zmdi-minus-square',
      none: 'zmdi-square-o',
    }[RowCheckStatus.value];
  });

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
  const RealN = computed(() => {
    let N = 0;
    for (let col of TableColumns.value) {
      if (!col.candidate) {
        N += 1;
      }
    }
    return N;
  });
  //-------------------------------------------------------
  const MainStyle = computed(() => {
    let N = RealN.value;
    let cols = [];
    // 未定制列的宽度
    if (_.isEmpty(columnSizes.value)) {
      if (ShowRowMarker.value) {
        cols.push(`60px`);
      }
      cols.push(`repeat(${N},  1fr)`);
    }
    // 采用定制宽度
    else {
      if (ShowRowMarker.value) {
        N += 1;
      }
      for (let i = 0; i < N; i++) {
        let colSize = _.nth(columnSizes.value, i) ?? '1fr';
        if (_.isNumber(colSize)) {
          colSize = `${colSize}px`;
        }
        cols.push(colSize);
      }
    }
    //console.log("re-computed MainStyle", cols.join(" "))
    return _.assign({}, props.mainStyle, {
      'grid-template-columns': cols.join(' '),
      'grid-auto-rows': `minmax(${props.rowMinHeight - props.rowGap}px, auto)`,
      'row-gap': `${props.rowGap}px`,
      'column-gap': `${props.colGap}px`,
    });
  });
  //-------------------------------------------------------
  //                 虚拟占位行
  //-------------------------------------------------------
  const VirtualRowStyle = computed(() => {
    let N = RealN.value;
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
      left: `${colResizing.left + 1}px`,
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
  function onClickSettings() {
    Alert(
      `设置包括：
       - 表格列布局(显示隐藏哪些列，以及列的顺序)，
       - 如何与其他用户分享设置
      同时我还没想好这个设置按钮放在哪里比较好，放在这里好像有点丑
      我可以有下面的选择:
       A. 放到最右侧
       B. 不放按钮，右键点击标题栏在菜单中体现
       C. 鼠标移动到标题第一栏，显示设置按钮`,
      {
        bodyIcon: 'far-lightbulb',
        clickMaskToClose: true,
      }
    );
  }
  //-------------------------------------------------------
  function onClickTop() {
    Table.value.OnTableHeadCheckerClick(selection, 'all');
  }
  //-------------------------------------------------------
  //                Event Cell Changed
  //-------------------------------------------------------
  function onCellChange(changed: TableCellChanged) {
    let { colIndex, rowIndex } = changed;
    log.debug('OnCellChange', changed);

    let oldRowData = _.nth(TableData.value, rowIndex)?.rawData;

    // 更新值，并通知改动
    Change.tidyValueChange(
      changed,
      { checkEquals: true, data: oldRowData || {} },
      (changedData, field) => {
        emit('row-change', {
          colIndex,
          rowIndex,
          uniqKey: field.uniqKey,
          name: field.name,
          changed: changedData,
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
      selection.ids = Table.value.getRowIds();
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
      selection.currentId = props.currentId;
      selection.checkedIds = Util.objToMap(props.checkedIds);
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
      log.debug('keepColumns changed', props.keepColumns);
      loadColumnSizes(columnSizes, Keep.value);
      _mea.updateMeasure();
    }
  );
  //-------------------------------------------------------
  onMounted(() => {
    Table.value.bindTableResizing(
      $main.value,
      colResizing,
      columnSizes,
      ShowRowMarker.value,
      onUnmounted,
      Keep
    );
    loadColumnSizes(columnSizes, Keep.value);
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
    :class="TopClass"
    @click="onClickTop">
    <main
      ref="$main"
      :style="MainStyle">
      <!-- 表格头 -->
      <template v-if="showHeader">
        <!-- 表头: 标记块 -->
        <div
          v-if="ShowRowMarker"
          class="table-cell as-head as-marker">
          <div
            class="as-checker"
            @click.stop="
              Table.OnTableHeadCheckerClick(selection, RowCheckStatus)
            ">
            <TiIcon :value="RowCheckStatusIcon" />
          </div>
          <div
            class="as-settings"
            @click.stop="onClickSettings">
            <TiIcon :value="'fas-bars'" />
          </div>
        </div>
        <!-- 表头: 列 -->
        <template
          v-for="(col, i) in TableColumns"
          :key="col.uniqKey">
          <div
            v-if="!col.candidate"
            class="table-cell as-head"
            :class="Table.getTableHeadClass(selection, i)"
            :col-index="i"
            :drag-index="col.dragIndex"
            :col-key="col.uniqKey">
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
          :showRowMarker="ShowRowMarker"
          :showCheckbox="showCheckbox"
          :showRowIndex="showRowIndex"
          :canHover="canHover"
          :canCheck="canCheck"
          :canSelect="canSelect"
          :row="row"
          :vars="vars"
          :activated="row.id == selection.currentId"
          :checked="Table.selectable.isIDChecked(selection, row.id)"
          :indent="row.indent"
          :activedColIndex="getRowActivedColIndex(selection, row)"
          :updateRowHeight="updateRowHeight"
          @row-select="Table.OnRowSelect(selection, $event)"
          @row-check="Table.OnRowCheck(selection, $event)"
          @row-open="Table.OnRowOpen(selection, $event)"
          @cell-select="Table.OnCellSelect(selection, $event, TableColumns)"
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
      v-if="colResizing.activated"></div>
    <!-- vvvvvvvvvvvvv 下面是调试信息，无需在意 vvvvvvvvvvvvv-->
    <div
      class="table-debug-info"
      v-if="showDebug">
      <template v-if="showDebugResizing">
        {{ columnSizes }} <br />
        [{{ colResizing.colIndex }}] -> {{ colResizing.left }}
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
  @use '../../../assets/style/_all.scss' as *;
  @import './style/ti-table.scss';
  @import './style/table-cell.scss';
  @import './style/table-resize.scss';
  @import './style/table-debug.scss';
</style>
