import _ from 'lodash';
import { Util, Vars } from '../../../core';
import {
  DFT_GRID_LAYOUT_HINT,
  GridFieldsItemLayoutProps,
  GridLayoutHint,
  GridLayoutHintItem,
  GridLayoutTrackGetter,
} from './ti-grid-fields-types';

/**
 * 根据网格的宽度和布局提示，计算要显示的网格字段数量。
 * 
 * @param width - 网格的宽度。
 * @param hint - 网格的布局提示。
 * @returns 要显示的网格字段的数量。
 */
export function autoCountGrid(width: number, hint: GridLayoutHintItem): number {
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
 * @param layout 用户配置信息
 * @returns  标准形式的布局选择线索
 */
export function parseGridLayout(layout: GridLayoutHint): GridLayoutTrackGetter {
  let input: GridLayoutHint = layout;
  //  如果是字符串，那么就假设它是对的
  if (_.isString(input)) {
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
  throw `Invalid layout: '${JSON.stringify(layout)}'`;
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
export function buildGridFieldsLayoutStyle(
  props: GridFieldsItemLayoutProps
): (_w: number) => Vars {
  // 这段代码主要用于生成 CSS 格式的网格布局。
  // 首先，它从 props 对象中解构出 layout，layoutHint 和 layoutGridTracks 三个属性。
  // 如果这些属性没有被提供，它们会被赋予默认值。
  let {
    layout,
    layoutHint = DFT_GRID_LAYOUT_HINT,
    layoutGridTracks = (_i: number) => '1fr',
  } = props;

  // 然后，它使用 parseGridLayout 函数处理 layoutHint，得到一个函数 getTrackCount，
  // 这个函数接受一个数字参数，返回网格的轨道数。
  let getTrackCount = parseGridLayout(layoutHint);

  // 接下来，它检查 layoutGridTracks 是否为一个函数。
  // 如果是，就将其赋值给 getTrackSize。
  // 否则，getTrackSize 会被赋值为一个新的函数，
  // 这个函数接受一个数字参数 i，返回 layoutGridTracks 中的第 i 个元素，
  // 如果该元素不存在，则返回 '1fr'。
  let getTrackSize: (_i: number) => string;
  if (_.isFunction(layoutGridTracks)) {
    getTrackSize = layoutGridTracks;
  } else {
    getTrackSize = (i: number) => {
      return _.nth(layoutGridTracks, i) ?? '1fr';
    };
  }
  // 最后，它返回一个函数，这个函数接受一个数字参数 w，生成一个 CSS 格式的网格布局。
  // 这个函数首先创建一个空的 CSS 对象，然后使用 getTrackCount 函数计算网格的列数 N。
  // 然后，它创建一个空的列数组 cols，并使用 getTrackSize 函数生成每一列的大小。
  // 最后，它将 layout 和 gridTemplateColumns 属性合并到 CSS 对象中，并返回。
  return (w: number) => {
    let css: Vars = {};
    let N = getTrackCount(w) ?? 1;
    let cols = [] as string[];
    for (let i = 0; i < N; i++) {
      let col = getTrackSize(i);
      cols.push(col);
    }
    _.assign(css, layout, {
      gridTemplateColumns: cols.join(' '),
    });
    return css;
  };
}
