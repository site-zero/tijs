import _ from 'lodash';
import { CssGridLayout, IconInput, TextContentType, Vars } from '../../../core';
import {
  GridFieldLayoutMode,
  GridFieldsProps,
  GridFieldsStrictAbstractItem,
  GridFieldsStrictField,
  GridFieldsStrictGroup,
} from './ti-grid-fields-types';

type FieldItemStyleOptions = {
  hasTitle: boolean;
  hasTip: boolean;
};

export function getFieldTopStyle(
  props: GridFieldsStrictField,
  options: FieldItemStyleOptions
) {
  let css_1 = getGridItemStyle(props);
  let css_2 = getFieldLayoutStyle(
    props.fieldLayoutMode,
    props.maxFieldNameWidth ?? 100,
    options
  );
  return _.assign({}, props.style, css_1, css_2) as Vars;
}

function getFieldLayoutStyle(
  layoutMode: GridFieldLayoutMode,
  nameWidth: number | string,
  options: FieldItemStyleOptions
) {
  let NW = _.isNumber(nameWidth) ? `${nameWidth}px` : nameWidth;
  let css = {
    gridTemplateColumns: `${NW} 1fr`,
  } as CssGridLayout;

  let ss = layoutMode.split('-');
  let lk = [ss[0]];
  if (!/^(title|value)$/.test(ss[1])) {
    lk.push(ss[1]);
  }
  if (options.hasTitle) {
    lk.push('title');
  }
  if (options.hasTip) {
    lk.push('tip');
  }
  let lyKey = lk.join('-');

  _.assign(
    css,
    {
      // 左右布局，提示在底部，与值等宽
      'h-wrap-title-tip': {
        gridTemplateRows: 'auto 1fr',
        gridTemplateAreas: `"title value" "title tip"`,
      },
      'h-wrap-title': {
        gridTemplateRows: 'auto',
        gridTemplateAreas: `"title value"`,
      },
      'h-wrap-tip': {
        gridTemplateRows: 'auto 1fr',
        gridTemplateAreas: `"title value" "title tip"`,
      },
      'h-wrap': {},
      // 左右布局，提示在底部单独一整行
      'h-bottom-title-tip': {
        gridTemplateRows: 'auto 1fr',
        gridTemplateAreas: `"title value" "tip tip"`,
      },
      'h-bottom-title': {
        gridTemplateRows: 'auto 1fr',
        gridTemplateAreas: `"title value"`,
      },
      'h-bottom-tip': {
        gridTemplateRows: 'auto 1fr',
        gridTemplateAreas: `"value value" "tip tip"`,
      },
      'h-bottom': {
        gridTemplateRows: 'auto',
        gridTemplateAreas: `"value value"`,
      },
      // 上下布局，提示在底部
      'v-wrap-title-tip': {
        gridTemplateColumns: '1fr',
        gridTemplateRows: 'auto auto 1fr',
        gridTemplateAreas: `"title" "value" "tip"`,
      },
      'v-wrap-title': {
        gridTemplateColumns: '1fr',
        gridTemplateRows: 'auto auto',
        gridTemplateAreas: `"title" "value" `,
      },
      'v-wrap-tip': {
        gridTemplateColumns: '1fr',
        gridTemplateRows: 'auto 1fr',
        gridTemplateAreas: `"value" "tip"`,
      },
      'v-wrap': {
        gridTemplateRows: 'auto',
        gridTemplateAreas: `"value value"`,
      },
      // 左右布局，提示作为图标
      'h-title-tip': {
        gridTemplateRows: 'auto',
        gridTemplateAreas: `"title value"`,
      },
      'h-title': {
        gridTemplateRows: 'auto',
        gridTemplateAreas: `"title value"`,
      },
      'h-tip': {
        gridTemplateColumns: '1fr',
        gridTemplateRows: 'auto',
        gridTemplateAreas: `"value"`,
      },
      'h': {
        gridTemplateColumns: '1fr',
        gridTemplateRows: 'auto',
        gridTemplateAreas: `"value"`,
      },
      // 上下布局，提示作为图标
      'v-title-tip': {
        gridTemplateColumns: '1fr',
        gridTemplateRows: 'auto auto fr',
        gridTemplateAreas: `"title" "value" "tip"`,
      },
      'v-title': {
        gridTemplateColumns: '1fr',
        gridTemplateRows: 'auto auto',
        gridTemplateAreas: `"title" "value"`,
      },
      'v-tip': {
        gridTemplateColumns: '1fr',
        gridTemplateRows: 'auto 1fr',
        gridTemplateAreas: `"value" "tip`,
      },
      'v': {
        gridTemplateColumns: '1fr',
        gridTemplateRows: '1fr',
        gridTemplateAreas: `"value"`,
      },
    }[lyKey]
  );

  return css;
}

export function getGridItemStyle(item: GridFieldsStrictAbstractItem) {
  let css = _.cloneDeep(item.style || {});
  if (item.rowSpan) {
    css.gridRowEnd = `span ${item.rowSpan}`;
  }
  if (item.colSpan) {
    let colSpan = _.clamp(item.colSpan, 1, item.maxTrackCount ?? 1);
    css.gridColumnEnd = `span ${colSpan}`;
  }
  return css;
}

export function getFieldTitleStyle(field: GridFieldsStrictField) {
  return _.assign({}, field.fieldTitleStyle, {
    'grid-area': 'title',
  });
}

type FieldTipIconInfo = {
  position: 'title' | 'value';
  type: 'prefix' | 'suffix';
};

function getFieldTipIcon(
  field: GridFieldsStrictField,
  hasTip: boolean
): FieldTipIconInfo | undefined {
  if (hasTip) {
    let m = /^[hv]-(title|value)-icon-(suffix|prefix)$/.exec(
      field.fieldLayoutMode
    );
    if (m) {
      return {
        position: m[1],
        type: m[2],
      } as FieldTipIconInfo;
    }
  }
}

export function getFieldTitleAlign(field: GridFieldsStrictField): string {
  if (!field.titleAlign) {
    return /^h-/.test(field.fieldLayoutMode) ? 'right' : 'left';
  }
  return field.titleAlign;
}

export type FieldpTitleIcon = {
  tipAsIcon: boolean;
  titlePrefixIcon?: IconInput;
  titleSuffixIcon?: IconInput;
  tipPrefixIcon?: IconInput;
  tipSuffixIcon?: IconInput;
};

/**
 * 包括提示信息图标，以及 required 图标
 */
export function getFieldIcon(
  field: GridFieldsStrictField,
  hasTitle: boolean,
  hasTip: boolean
): FieldpTitleIcon {
  let tipIcon = getFieldTipIcon(field, hasTip);
  let reIcon: FieldpTitleIcon = { tipAsIcon: tipIcon ? true : false };
  // 标题区提示图标
  if (hasTitle) {
    if (tipIcon && tipIcon.position == 'title' && tipIcon.type) {
      // 提示在前缀
      if ('prefix' == tipIcon.type) {
        reIcon.titlePrefixIcon = field.tipIcon;
      }
      // 提示在后缀
      else if ('suffix' == tipIcon.type) {
        reIcon.titleSuffixIcon = field.tipIcon;
      }
    }
  }
  // 值区提示图标
  return reIcon;
}

export type FieldTitleTextInfo = {
  title: string;
  type?: TextContentType;
};

export function getFieldTitle(
  field: GridFieldsStrictField
): FieldTitleTextInfo {
  let { title, titleType, fieldTitleBy, required } = field;
  title = title || '';
  if (required && required(field.data) && title && !fieldTitleBy) {
    if ('text' == titleType) {
      title = _.escape(title);
    }
    title = '<b class="required-mark">*</b>' + title;
    titleType = 'html';
  }

  return { title, type: titleType };
}

export function getBodyPartStyle(
  props: GridFieldsStrictGroup | GridFieldsProps
): Vars {
  let css = _.cloneDeep(props.bodyPartStyle) || {};
  if (props.bodyPartDense) {
    css['grid-auto-flow'] = 'dense';
  }
  return css;
}
