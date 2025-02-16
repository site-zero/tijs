import { ComputedRef, Ref } from 'vue';
import { Dragging, useDragging } from '../../';
import { Callback, Callback1, FuncA0 } from '../../../_type';
import { Dom, Num } from '../../../core';
import { ColResizingState } from './use-table';
import { keepColumnSizes, TableKeepFeature } from './use-table-keep';

const debug = false;

/**
 * 为表格绑定拖拽调整列宽的特性
 *
 * @param $main 表格主区域的元素
 */
export function useTableResizing(
  $main: HTMLElement,
  colResizing: ColResizingState,
  _column_sizes: Ref<Record<string, number>>,
  showRowMarker: boolean,
  onDestroy: Callback1<Callback>,
  isColumnResizeInTime: FuncA0<boolean>,
  Keep: ComputedRef<TableKeepFeature>
) {
  const __update_colmun_sizes = function (ing: Dragging) {
    let colLeftInView = Num.round(ing.getMeasure('col_offset_x') ?? 0, 100);
    let scrollLeft = Num.round(ing.viwportElement?.scrollLeft ?? 0, 100);
    let i = showRowMarker ? colResizing.colIndex + 1 : colResizing.colIndex;
    let colSize = Num.round(colResizing.left + scrollLeft - colLeftInView, 100);
    let key = colResizing.colUniqKey;
    _column_sizes.value[key] = Math.max(10, colSize);

    if (debug) {
      console.log(
        'moving',
        `${colResizing.left} + ${scrollLeft} - ${colLeftInView} = ${colSize}`
      );
    }
  };

  useDragging({
    onDestroy,
    getWatchTarget: () => $main,
    getDragTarget: (target: HTMLElement): HTMLElement | undefined => {
      return Dom.closest(target, '.column-resize-hdl', { includeSelf: true });
    },
    onReady: (ing: Dragging) => {
      //ing.watchZone = Rects.createBy(ing.body!);
      ing.watchMode = 'play';
      ing.setVar('resize-in-time', isColumnResizeInTime());
      if (debug) console.log('onReady', ing.activated, ing.client);
    },
    onStart: (ing: Dragging) => {
      if (!ing.target || !ing.viwportElement) {
        return;
      }

      // 获取关键元素
      let $view = ing.viwportElement;
      let isForPrev = Dom.is(ing.target, '.for-prev');
      let $target_cell = Dom.closest(ing.target, '.table-cell.as-head');
      let $head_cells = Dom.findAll('.table-cell.as-head', $view);
      let colPrevUniqKey = $target_cell!.getAttribute('col-prev-key') ?? '';
      let colUniqKey = $target_cell!.getAttribute('col-key') ?? '';

      // 记录初始的拖动位置
      let colIndex = parseInt($target_cell!.getAttribute('drag-index')!);
      colResizing.colIndex = isForPrev ? colIndex - 1 : colIndex;
      colResizing.activated = true;
      colResizing.left = ing.inview.x;
      colResizing.colUniqKey = isForPrev ? colPrevUniqKey : colUniqKey;

      if (debug)
        console.log(
          `onStart[${isForPrev ? 'prev' : 'self'}]`,
          ing.activated,
          ing
        );

      // 获取标题初始列宽
      for (let $cell of $head_cells) {
        let w = $cell.getBoundingClientRect().width;
        let colIndex = parseInt(Dom.attr($cell, 'drag-index', -1));
        w = Num.round(w, 100);
        let i = showRowMarker ? colIndex + 1 : colIndex;
        let colKey = $cell.getAttribute('col-key');
        if (!colKey) {
          throw `Table Resize drag-index: ${colIndex} without col-key`;
        }
        _column_sizes.value[colKey] = w;
      }

      // 记录列初始的 left
      let $drafCell = isForPrev
        ? $target_cell?.previousElementSibling!
        : $target_cell;
      let cellLeft = Num.round($drafCell!.getBoundingClientRect().left!, 100);
      let viewLeft = Num.round(ing.viewport.left, 100);
      let scrollLeft = Num.round(ing.viwportElement?.scrollLeft ?? 0, 100);
      let colLeftInView = cellLeft + scrollLeft - viewLeft;
      ing.setMeasure('col_offset_x', Num.round(colLeftInView, 100));

      if (debug) {
        console.log('onStart', `${cellLeft} - ${viewLeft} = ${colLeftInView}`);
      }
    },
    onMoving: (ing: Dragging) => {
      let resizeInTime = ing.getVar('resize-in-time');
      colResizing.left = Num.round(ing.inview.x, 100);
      if (resizeInTime) {
        __update_colmun_sizes(ing);
      }
    },
    onEnd: (ing: Dragging) => {
      __update_colmun_sizes(ing);
      if (debug) console.log('onEnd', ing.activated, ing);
      colResizing.activated = false;
      colResizing.left = -1;
      colResizing.colIndex = -1;
      if (Keep.value) {
        keepColumnSizes(_column_sizes, Keep.value);
      }
    },
  });
}
