import { FuncA1, Size2D } from '../../_type';

/**
 * 计算视口内大量的行，应该渲染哪些行
 *
 * ```
 * [Row 0]
 * [Row 1]
 * [Row 2]..................
 * [Row 3]                ^
 * [Row 4]        Cache Zone
 * [Row 5]                |
 * [Row 6]----------      |
 * [Row 7]    ^           |
 * [Row 8] View port      |
 * [Row 9]    V           |
 * [Row A]----------      |
 * [Row C]                |
 * [Row D]                v
 * [Row F]..................
 * [Row G]
 * [Row H]
 * ...
 *
 * ```
 */
export type LargeScrollingState = {
  /**
   * 视口宽高，用来自动计算视口内行
   */
  viewport: Size2D;

  /**
   * 输入的各个行的行高(px)，0 表示采用默认行高
   */
  lineHeights: number[];

  /**
   * 默认行高(px)
   */
  defaultLineHeight: number;

  /**
   * 行总数
   */
  lineCount: number;

  /**
   * 视口内容器滚动高度(px)
   */
  scrollTop: number;

  /**
   * 滚动缓冲区高度(px)
   */
  cacheZoneHeight: number;

  /**
   * 整数表示的行渲染标记：
   *
   * - `0` 超出渲染区的行，无需渲染
   * - `1` 在渲染区，需要渲染的行
   */
  lineMarkers: number[];
};

export function useLargeScrolling(
  state: LargeScrollingState
): FuncA1<number, boolean> {
  // 解析参数
  let {
    viewport,
    lineHeights,
    defaultLineHeight,
    lineCount,
    scrollTop,
    cacheZoneHeight,
    lineMarkers,
  } = state;

  // 防守
  if (!viewport.height) {
    return () => false;
  }

  // 得到逻辑渲染区的尺寸范围
  let lrzStart = Math.max(scrollTop - cacheZoneHeight, 0);
  let lrzEnd = scrollTop + viewport.height + cacheZoneHeight;

  // 循环计算
  let sumHeight = 0;
  for (let rowIndex = 0; rowIndex < lineCount; rowIndex++) {
    let rowHeight = lineHeights[rowIndex] ?? defaultLineHeight;
    sumHeight += rowHeight;

    // 未标记渲染的，就渲染
    if (!lineMarkers[rowIndex]) {
      lineMarkers[rowIndex] =
        sumHeight >= lrzStart && sumHeight <= lrzEnd ? 1 : 0;
    }
  }

  // 返回标记结果的判断函数
  return (rowIndex: number) => {
    return lineMarkers[rowIndex] > 0;
  };
}
