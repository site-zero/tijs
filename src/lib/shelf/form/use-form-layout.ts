import JSON5 from 'json5';
import _ from 'lodash';
import { CssGridLayout, CssUtils, Size2D, Util, Vars } from '../../../core';
import { FormField } from './ti-form-types';

const DFT_LAYOUT: AutoGridHint = [[5, 1500], [4, 1200], [3, 900], [2, 500], 1];
/**
 * 字段组，或者表单的字段布局相关属性。
 *
 * 如果是表单，则会应用到表单上的每个字段组，除非字段组有自己的设置
 */
export type FormGridLayout = CssGridLayout & {
  autoGrid?: AutoGridHint;
};

/**
 * 描述了一个条件: [3, 500] 相当于尺寸大于500，就是 3
 *
 * 如果就是一个数字，则表示固定的结果
 */
type AutoGridHintItem = number | [number, number];
/**
 * 可以支持三种形式的值来描述一个维度的轨道布局
 *
 * ### String
 *
 * 如果传入的是字符串，则必须可以被 JSON 解析为 GridHintItem[]
 * 否则会发生不可预知的错误
 *
 * ### Number
 *
 * 指定了轨道数量
 *
 * ### `AutoGridHintItem[]`
 *
 * 根据本维度尺寸自动计算
 *
 */
export type AutoGridHint = string | AutoGridHintItem | AutoGridHintItem[];
/*-----------------------------------------------------

                   Utilities
                
-----------------------------------------------------*/
export function normalizeGridLayout(
  layout?: AutoGridHint | FormGridLayout
): FormGridLayout {
  if (_.isNil(layout)) {
    return {
      autoGrid: DFT_LAYOUT,
    };
  }
  // 合并情况
  if (_.isNumber(layout)) {
    layout = [layout];
  } else if (_.isString(layout)) {
    layout = JSON.parse(layout);
  }

  if (_.isArray(layout)) {
    layout = { autoGrid: layout };
  }

  if (!(layout instanceof Object)) {
    throw new Error(
      'Invalid layout and it is impossiable: ' + JSON5.stringify(layout)
    );
  }
  layout = _.cloneDeep(layout);

  // 如果未声明 templateColumns 和 templateRow 以及autoGrid 给一个默认值
  let { autoGrid, gridTemplateColumns, gridTemplateRows } = layout;
  if (!autoGrid && !gridTemplateColumns && !gridTemplateRows) {
    layout.autoGrid = DFT_LAYOUT;
  }

  return layout;
}

/**
 * Calculate the Grid track number by given view
 *
 * @param view
 * @param layout
 * @returns grid track number
 */

export function autoCountGrid(view: Size2D, layout: FormGridLayout) {
  //console.log('autoCountGrid', view, layout);
  let by = function (arm: [number, any], view: Size2D): number | undefined {
    let width = view.width;
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
  let re = Util.selectValue(view, layout.autoGrid, { by });
  //console.log(' > selectValue => ', re);
  return re;
}
/*-----------------------------------------------------

                   Use Feature
                
-----------------------------------------------------*/
export function buildFieldsGroupStyle(
  layout: FormGridLayout,
  autoTrackCount: number
): Vars {
  // 自动模式
  if (layout.autoGrid) {
    let trackCount = autoTrackCount;

    // 纵向排布
    if (layout.gridAutoFlow && layout.gridAutoFlow.indexOf('column') >= 0) {
      layout.gridTemplateRows = _.repeat(' 1fr ', trackCount).trim();
      _.defaults(layout, { gridTemplateColumns: 'auto' });
    }
    // 横向排布
    else {
      layout.gridTemplateColumns = _.repeat(' 1fr ', trackCount).trim();
      _.defaults(layout, { gridTemplateRows: 'auto' });
    }
  }

  // 那么已经变成精确模式了
  return CssUtils.mergeStyles(layout, { filter: (k) => 'auto-grid' != k });
}

/**
 * 为字段建立样式对象
 *
 * @param field 传入的字段定义
 * @returns  字段的样式对象
 */
export function buildFieldItemStyle(field: FormField): Vars {
  let sty = _.cloneDeep(field.style) || {};
  CssUtils.pickGridItemStyle(field);
  _.assign(sty, CssUtils.pickGridItemStyle(field));
  return sty;
}
