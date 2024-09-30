import _ from 'lodash';
import {
  GridLayoutHint,
  GridLayoutHintItem,
  GridLayoutProps,
  GridLayoutTrackGetter,
  Vars,
} from '../../_type';
import { Str, Util } from '../../core';

const DFT_GRID_LAYOUT_HINT: GridLayoutHint = [
  [5, 1500],
  [4, 1200],
  [3, 900],
  [2, 500],
  1,
];

/**
 * 根据网格的宽度和布局提示，计算要显示的网格字段数量。
 *
 * @param width - 网格的宽度。
 * @param hint - 网格的布局提示。
 * @returns 要显示的网格字段的数量。
 */
function autoCountGrid(width: number, hint: GridLayoutHintItem): number {
  //console.log('autoCountGrid', view, layout);
  let by = function (arm: [number, any], width: number): number | undefined {
    let [v, m] = arm;
    let isDftArm = _.isNil(m);
    // 没有宽度，那么必须要默认的 Arm
    if (!width && isDftArm) {
      return v;
    }
    // 进行判断
    else if (isDftArm || width >= m) {
      return v;
    }
  };
  let re = Util.selectValue(width, hint, { by });
  //console.log(' > selectValue => ', re);
  return re ?? 1;
}

/**
 * 将 layout 的输入变成标准形式
 * @param layoutHint 用户配置信息
 * @returns  标准形式的布局选择线索
 */
function parseGridLayout(
  layoutHint: GridLayoutHint = DFT_GRID_LAYOUT_HINT
): GridLayoutTrackGetter {
  let input: GridLayoutHint = layoutHint;
  //  如果是字符串，那么就假设它是对的
  if (_.isString(input)) {
    // 如果字符串格式为 '<500>' 表示每个轨道宽度为 500px，
    // 根据视口的宽度，自动计算轨道数量
    let m = /^<([0-9]+)>$/.exec(input);
    if (m) {
      let tkWidth = parseInt(m[1]);
      return (_w: number) => Math.floor(_w / tkWidth);
    }
    // 否则则必须可以被 JSON 解析为 GridHintItem[]
    // 否则会发生不可预知的错误
    input = JSON.parse(input);
  }

  // 仅仅是数字
  if (_.isNumber(input)) {
    return (_w: number) => input as number;
  }

  // 智能选择
  if (_.isArray(input)) {
    return (w: number) => {
      return autoCountGrid(w, input as GridLayoutHintItem);
    };
  }
  throw `Invalid layout: '${JSON.stringify(layoutHint)}'`;
}

/**
 * Builds the grid fields layout style based on the provided props.
 *
 * @param props - The props for the grid fields item layout.
 * @returns A function that takes the width as a parameter
 * and returns the CSS variables for the layout.
 *
 * > ! Recommanded use it in a computed variable
 */
function buildGridFieldsLayoutStyle(
  props: GridLayoutProps
): (_track_count: number) => Vars {
  // 这段代码主要用于生成 CSS 格式的网格布局。
  // 首先，它从 props 对象中解构出 layout，layoutHint 和 layoutGridTracks 三个属性。
  // 如果这些属性没有被提供，它们会被赋予默认值。
  let { layout, layoutGridTracks, customizedGridTracks } = props;

  // Default Track Getter
  let gridTracks = ['1fr'];
  if (_.isString(layoutGridTracks) || _.isArray(layoutGridTracks)) {
    gridTracks = _.concat(layoutGridTracks);
  }
  // 逐个轨道分析
  let _map_tracks = new Map<number, string[]>();
  let _dft_tracks = [] as string[];
  for (let tr of gridTracks) {
    let m = /^#([0-9]+):(.+)$/.exec(tr);
    if (m) {
      let k = parseInt(m[1]);
      let v = Str.splitIgnoreBlank(m[2]);
      _map_tracks.set(k, v);
    } else {
      _dft_tracks = Str.splitIgnoreBlank(tr);
    }
  }

  // 接下来，它检查 layoutGridTracks 是否为一个函数。
  // 如果是，就将其赋值给 getTrackSize。
  // 否则，getTrackSize 会被赋值为一个新的函数，
  // 这个函数接受一个数字参数 i，返回 layoutGridTracks 中的第 i 个元素，
  // 如果该元素不存在，则返回 '1fr'。
  function defaultGetTrackSize(i: number, track_count: number) {
    let tracks = _map_tracks.get(track_count) ?? _dft_tracks;
    if (_.isEmpty(tracks)) {
      return '1fr';
    }
    let realI = _.clamp(i, 0, tracks.length - 1);
    return tracks[realI]!;
  }

  // 准备函数
  let getTrackSize: (_i: number, _track_count: number) => string;

  // customized function call
  if (_.isFunction(customizedGridTracks)) {
    getTrackSize = (_i: number, _track_count: number): string => {
      return customizedGridTracks!(_i, _track_count, defaultGetTrackSize);
    };
  } else {
    getTrackSize = defaultGetTrackSize;
  }

  // 最后，它返回一个函数，这个函数接受一个数字参数 w，生成一个 CSS 格式的网格布局。
  // 这个函数首先创建一个空的 CSS 对象，然后使用 getTrackCount 函数计算网格的列数 N。
  // 然后，它创建一个空的列数组 cols，并使用 getTrackSize 函数生成每一列的大小。
  // 最后，它将 layout 和 gridTemplateColumns 属性合并到 CSS 对象中，并返回。
  return (trackCount = 1) => {
    let css: Vars = {};
    _.assign(css, layout);
    if (!css.gridTemplateColumns) {
      let cols = [] as string[];
      for (let i = 0; i < trackCount; i++) {
        let col = getTrackSize(i, trackCount);
        cols.push(col);
      }
      css.gridTemplateColumns = cols.join(' ');
    }
    return css;
  };
}

export type GridLayoutTrackFeature = ReturnType<typeof useGridLayoutTrack>;
export function useGridLayoutTrack(props: GridLayoutProps) {
  const getTrackCount = parseGridLayout(props.layoutHint);
  const getLayoutCss = buildGridFieldsLayoutStyle(props);

  return {
    getTrackCount,
    getLayoutCss,
  };
}

export type GridLayoutStyleFeature = ReturnType<typeof useGridLayoutStyle>;
export function useGridLayoutStyle(
  grid: GridLayoutTrackFeature,
  _viewport_width: number
) {
  const trackCount = grid.getTrackCount(_viewport_width);
  const layoutCss = grid.getLayoutCss(trackCount);
  return {
    trackCount,
    layoutCss,
    mergetStyle: (css: Vars) => {
      let re = _.cloneDeep(layoutCss);
      _.assign(re, css);
      return re;
    },
  };
}

export type GridLayoutFeature = ReturnType<typeof useGridLayout>;
export function useGridLayout(props: GridLayoutProps, _viewport_width: number) {
  let grid = useGridLayoutTrack(props);
  const trackCount = grid.getTrackCount(_viewport_width);
  const layoutCss = grid.getLayoutCss(trackCount);
  return {
    trackCount,
    layoutCss,
    mergetStyle: (css: Vars) => {
      let re = _.cloneDeep(layoutCss);
      _.assign(re, css);
      return re;
    },
  };
}
