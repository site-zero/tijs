import _ from 'lodash';
import { Dragging, useDraggable } from '../../../';
import {
  Callback,
  Callback1,
  CssUtils,
  Dom,
  NameStrValue,
  Num,
  Str,
} from '../../../../core';
import { LayoutBar } from '../layout-support';
import { LayoutGridKeepFeature, keepSizesState } from './use-grid-keep';
import { ComputedRef } from 'vue';

export type GridResizingState = {
  /**
   * 格子的列，如果为空，就表示未定制，将采用默认设置
   */
  columns: string[];
  /**
   * 格子的行，如果为空，就表示未定制，将采用默认设置
   */
  rows: string[];
};

type ResizeMeasure = {
  template: number[];
  gap: number;
  pad0: number;
  pad1: number;
  /**
   * 最小尺度
   */
  minSize: number;
  /**
   * 触发拖动的块下标
   */
  myIndex: number;
  /**
   * 被动调整的块下标
   */
  taIndex: number;

  /**
   * 排序后的块下标
   */
  indexes: [number, number];

  /**
   * 调整区域的尺度限制 `[最小值, 最大值]`
   */
  scope: [number, number];
};

function getLayouBar($bar: HTMLElement): LayoutBar {
  let vars = Dom.attrs($bar, (name, value): boolean | NameStrValue => {
    let m = /^bar-(.+)$/.exec(name);
    if (m && value) {
      let k = _.camelCase(m[1]);
      return { name: k, value };
    }
    return false;
  });
  let bar = {} as LayoutBar;
  _.forEach(vars, (v, k) => {
    if ('adjustIndex' == k) {
      v = parseInt(v);
    }
    _.set(bar, k, v);
  });
  return bar;
}

function getGridMeasure(bar: LayoutBar, $grid: HTMLElement): ResizeMeasure {
  let toPixel = CssUtils.toPixel;
  let tmp = Dom.getComputedStyle($grid, `grid-template-${bar.mode}s`);
  let gap = Dom.getComputedStyle($grid, `${bar.mode}-gap`);
  let pad0 = Dom.getComputedStyle(
    $grid,
    bar.mode == 'row' ? 'padding-top' : 'padding-left'
  );
  let pad1 = Dom.getComputedStyle(
    $grid,
    bar.mode == 'row' ? 'padding-bottom' : 'padding-right'
  );
  return {
    template: _.map(Str.splitIgnoreBlank(tmp, /\s+/), (v) =>
      toPixel(v)
    ) as number[],
    gap: toPixel(gap),
    pad0: toPixel(pad0),
    pad1: toPixel(pad1),
    minSize: 10,
    myIndex: -1,
    taIndex: -1,
    indexes: [-1, -1],
    scope: [0, 0],
  };
}

function setMeasureScope(mea: ResizeMeasure) {
  let { myIndex, taIndex, template, pad0, gap } = mea;
  mea.indexes = [myIndex, taIndex].sort() as [number, number];
  let [I0, I1] = mea.indexes;
  // 收集尺度
  let s = pad0;
  for (let i = 0; i < template.length; i++) {
    // 范围结束
    if (i >= I1) {
      s += template[i];
      mea.scope[1] = s;
      break;
    }
    // 范围开始
    else if (i >= I0) {
      mea.scope[0] = s;
    }
    // 累加
    s += template[i] + gap;
  }
}

const Moving = {
  bar_row_prev(resizing: GridResizingState, mea: ResizeMeasure, ing: Dragging) {
    let { scope, minSize, gap, myIndex, taIndex } = mea;
    return () => {
      let p = ing.inview.y;
      let my = Math.max(minSize, scope[1] - p);
      let ta = scope[1] - scope[0] - gap - my;
      my = Num.round(my, 100);
      ta = Num.round(ta, 100);
      resizing.rows[myIndex] = `${my}px`;
      resizing.rows[taIndex] = `${ta}px`;
      //console.log(`bar_row_prev my=${my} + ta=${ta}  == ${my + ta}`);
    };
  },
  bar_row_next(resizing: GridResizingState, mea: ResizeMeasure, ing: Dragging) {
    let { scope, minSize, gap, myIndex, taIndex } = mea;
    return () => {
      let p = ing.inview.y;
      let my = Math.max(minSize, p - scope[0]);
      let ta = scope[1] - scope[0] - gap - my;
      my = Num.round(my, 100);
      ta = Num.round(ta, 100);
      resizing.rows[myIndex] = `${my}px`;
      resizing.rows[taIndex] = `${ta}px`;
      //console.log(`bar_row_next: my=${my} + ta=${ta}  == ${my + ta}`);
    };
  },
  bar_column_prev(
    resizing: GridResizingState,
    mea: ResizeMeasure,
    ing: Dragging
  ) {
    let { scope, minSize, gap, myIndex, taIndex } = mea;
    return () => {
      let p = ing.inview.x;
      let my = Math.max(minSize, scope[1] - p);
      let ta = scope[1] - scope[0] - gap - my;
      my = Num.round(my, 100);
      ta = Num.round(ta, 100);
      resizing.columns[myIndex] = `${my}px`;
      resizing.columns[taIndex] = `${ta}px`;
      //console.log(`bar_row_next: my=${my} + ta=${ta}  == ${my + ta}`);
    };
  },
  bar_column_next(
    resizing: GridResizingState,
    mea: ResizeMeasure,
    ing: Dragging
  ) {
    let { scope, minSize, gap, myIndex, taIndex } = mea;
    return () => {
      let p = ing.inview.x;
      let my = Math.max(minSize, p - scope[0]);
      let ta = scope[1] - scope[0] - gap - my;
      my = Num.round(my, 100);
      ta = Num.round(ta, 100);
      resizing.columns[myIndex] = `${my}px`;
      resizing.columns[taIndex] = `${ta}px`;
      //console.log(`bar_row_next: my=${my} + ta=${ta}  == ${my + ta}`);
    };
  },
};

function toPercent(ns: number[], gap: number) {
  let tota = _.sum(ns) + Math.max(0, ns.length - 1) * gap;
  let re = [];
  for (let i = 0; i < ns.length; i++) {
    let per = Str.toPercent(ns[i] / tota);
    re.push(per);
  }
  re[re.length - 1] = '1fr';
  return re;
}

const MoveEnd = {
  column: function (resizing: GridResizingState, mea: ResizeMeasure) {
    return () => {
      let ns = _.map(resizing.columns, (s) => CssUtils.toPixel(s));
      resizing.columns = toPercent(ns, mea.gap);
    };
  },
  row: function (resizing: GridResizingState, mea: ResizeMeasure) {
    return () => {
      let ns = _.map(resizing.rows, (s) => CssUtils.toPixel(s));
      resizing.rows = toPercent(ns, mea.gap);
    };
  },
};

export function useGridResizing(
  $main: HTMLElement,
  resizing: GridResizingState,
  onDestroy: Callback1<Callback>,
  Keep: ComputedRef<LayoutGridKeepFeature>
) {
  console.log("useGridResizing", $main)
  useDraggable({
    onDestroy,
    getWatchTarget: () => $main,
    getDragTarget: (target: HTMLElement): HTMLElement | undefined => {
      return Dom.closest(target, '.adjust-bar', { includeSelf: true });
    },
    onReady: (ing: Dragging) => {
      console.log('onReady', ing);
      //ing.watchZone = Rects.createBy(ing.body!);
      ing.watchMode = 'stop';
      //console.log("onReady", ing.activated, ing.client);
    },
    onStart: (ing: Dragging) => {
      console.log('onStart', ing);
      if (!ing.target || !ing.viwportElement) {
        return;
      }

      // 获取 Bar 信息区
      let bar = getLayouBar(ing.target);

      // 获取关键元素
      let $view = ing.viwportElement;

      // 获取整个格子的布局
      // 因为采用了计算属性，所以直接获得就是 '300.578px 541.047px' 这样的数组
      let mea = getGridMeasure(bar, $view);
      mea.myIndex = bar.adjustIndex;

      // 我需要知道调整哪两个列
      mea.taIndex = {
        prev: () => bar.adjustIndex - 1,
        next: () => bar.adjustIndex + 1,
      }[bar.position]();

      setMeasureScope(mea);

      // 记录
      ing.setVar(
        'moving',
        Moving[`bar_${bar.mode}_${bar.position}`](resizing, mea, ing)
      );
      ing.setVar('move_end', MoveEnd[bar.mode](resizing, mea));
      // console.log("onStart", bar, mea);
    },
    onMoving: (ing: Dragging) => {
      console.log('onMoving', ing);
      let moving = ing.getVar('moving');
      if (_.isFunction(moving)) {
        moving();
      }
    },
    onEnd: (ing: Dragging) => {
      console.log('onEnd', ing);
      let fn = ing.getVar('move_end');
      if (_.isFunction(fn)) {
        fn();
      }
      keepSizesState(resizing, Keep.value);
    },
  });
}
