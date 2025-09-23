import _ from 'lodash';
import {
  CssGridLayout,
  FieldStatusInfo,
  IconInput,
  TextContentType,
  Vars,
} from '../../../_type';
import { I18n, Util } from '../../../core';
import {
  FieldDynamicContext,
  FormFieldLayoutMode,
  GridFieldsProps,
  AbstractFormItem,
  FormFieldItem,
  FormItemGroup,
} from './ti-grid-fields-types';

type FieldItemStyleOptions = {
  hasTitle: boolean;
  hasTip: boolean;
};

export function getFieldTopStyle(
  props: FormFieldItem,
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
  layoutMode: FormFieldLayoutMode,
  nameWidth: number | string,
  options: FieldItemStyleOptions
) {
  let NW = _.isNumber(nameWidth) ? `${nameWidth}px` : nameWidth;
  let css = {} as CssGridLayout;

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
        gridTemplateColumns: `${NW} 1fr`,
        gridTemplateRows: 'auto 1fr',
        gridTemplateAreas: `
          "title value"
          "title tip"`,
      },
      'h-wrap-title': {
        gridTemplateColumns: `${NW} 1fr`,
        gridTemplateRows: 'auto',
        gridTemplateAreas: `"title value"`,
      },
      'h-wrap-tip': {
        gridTemplateColumns: `1fr`,
        gridTemplateRows: 'auto 1fr',
        gridTemplateAreas: `
          "value"
          "tip"`,
      },
      'h-wrap': {
        gridTemplateColumns: `1fr`,
        gridTemplateRows: 'auto',
        gridTemplateAreas: `"value"`,
      },
      // 左右布局，提示在底部单独一整行
      'h-bottom-title-tip': {
        gridTemplateColumns: `${NW} 1fr`,
        gridTemplateRows: 'auto 1fr',
        gridTemplateAreas: `
          "title value"
          "tip   tip"`,
      },
      'h-bottom-title': {
        gridTemplateColumns: `${NW} 1fr`,
        gridTemplateRows: 'auto',
        gridTemplateAreas: `"title value"`,
      },
      'h-bottom-tip': {
        gridTemplateColumns: `1fr`,
        gridTemplateRows: 'auto',
        gridTemplateAreas: `
          "value"
          "tip"`,
      },
      'h-bottom': {
        gridTemplateColumns: `1fr`,
        gridTemplateRows: 'auto',
        gridTemplateAreas: `"value"`,
      },
      // 上下布局，提示在底部
      'v-wrap-title-tip': {
        gridTemplateColumns: '1fr',
        gridTemplateRows: 'auto auto 1fr',
        gridTemplateAreas: `
          "title"
          "value"
          "tip"`,
      },
      'v-wrap-title': {
        gridTemplateColumns: '1fr',
        gridTemplateRows: 'auto auto',
        gridTemplateAreas: `
          "title"
          "value"`,
      },
      'v-wrap-tip': {
        gridTemplateColumns: '1fr',
        gridTemplateRows: 'auto 1fr',
        gridTemplateAreas: `
          "value"
          "tip"`,
      },
      'v-wrap': {
        gridTemplateColumns: `1fr`,
        gridTemplateRows: 'auto',
        gridTemplateAreas: `"value"`,
      },
      // 左右布局，提示作为图标
      'h-title-tip': {
        gridTemplateColumns: `${NW} 1fr`,
        gridTemplateRows: 'auto',
        gridTemplateAreas: `
          "title value"`,
      },
      'h-title': {
        gridTemplateColumns: `${NW} 1fr`,
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
        gridTemplateAreas: `
          "title"
          "value"
          "tip"`,
      },
      'v-title': {
        gridTemplateColumns: '1fr',
        gridTemplateRows: 'auto auto',
        gridTemplateAreas: `
          "title"
          "value"`,
      },
      'v-tip': {
        gridTemplateColumns: '1fr',
        gridTemplateRows: 'auto 1fr',
        gridTemplateAreas: `
          "value"
          "tip`,
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

export function getGridItemStyle(item: AbstractFormItem) {
  let css = _.cloneDeep(item.style || {});
  if (item.rowStart) {
    css.gridRowStart = item.rowStart;
  }
  if (item.rowSpan) {
    css.gridRowEnd = `span ${item.rowSpan}`;
  }
  if (item.colStart) {
    css.gridColumnStart = item.colStart;
  }
  if (item.colSpan) {
    let colSpan = _.clamp(item.colSpan, 1, item.maxTrackCount ?? 1);
    css.gridColumnEnd = `span ${colSpan}`;
  }
  return css;
}

export function getFieldTitleStyle(
  field: FormFieldItem,
  status?: FieldStatusInfo
) {
  let re = _.assign({}, field.titleStyle);
  if (status && status.type) {
    let colorType = {
      pending: 'secondary',
      error: 'danger',
      warn: 'warn',
      ok: 'success',
      highlight: 'hightlight',
    }[status.type];
    let bgColorType = {
      pending: 'secondary-r',
      error: 'danger-r',
      warn: 'warn-r',
      ok: 'success-r',
      highlight: 'hightlight-f',
    }[status.type];
    _.assign(re, {
      backgroundColor: `var(--ti-color-${bgColorType})`,
      color: `var(--ti-color-${colorType})`,
    });
  }
  return re;
}

type FieldTipIconInfo = {
  position: 'title' | 'value';
  type: 'prefix' | 'suffix';
};

function getFieldTipIcon(
  field: FormFieldItem,
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

export function getFieldTitleAlign(field: FormFieldItem): string {
  if (!field.titleAlign) {
    return /^h-/.test(field.fieldLayoutMode) ? 'right' : 'left';
  }
  return field.titleAlign;
}

export type FieldTitleIcon = {
  tipAsIcon: boolean;
  titlePrefixIcon?: IconInput;
  titleSuffixIcon?: IconInput;
  titlePrefixTip?: string;
  titleSuffixTip?: string;
  tipPrefixIcon?: IconInput;
  tipSuffixIcon?: IconInput;
  valueIcon?: IconInput;
  valueTip?: string;
};

/**
 * 包括提示信息图标，以及 required 图标
 */
export function getFieldIcon(
  field: FormFieldItem,
  hasTitle: boolean,
  hasTip: boolean,
  status?: FieldStatusInfo
): FieldTitleIcon {
  //
  // 提示图标
  //
  let tipIconInfo = getFieldTipIcon(field, hasTip);
  let reIcon: FieldTitleIcon = { tipAsIcon: tipIconInfo ? true : false };
  let fieldTip = Util.selectValue(field.vars, field.tip, {
    explain: true,
  });
  reIcon.titleSuffixIcon = field.titleIcon;
  if (tipIconInfo && tipIconInfo.type) {
    // 标题区提示图标
    if (hasTitle && tipIconInfo.position == 'title') {
      // 提示在前缀
      if ('prefix' == tipIconInfo.type) {
        reIcon.titlePrefixIcon = field.tipIcon;
        reIcon.titlePrefixTip = fieldTip;
        reIcon.titleSuffixIcon = field.titleIcon;
      }
      // 提示在后缀
      else if ('suffix' == tipIconInfo.type) {
        reIcon.titleSuffixIcon = field.tipIcon;
        reIcon.titleSuffixTip = fieldTip;
        reIcon.titlePrefixIcon = field.titleIcon;
      }
    }
    // 值区提示图标
    else if (tipIconInfo.position == 'value') {
      // ... 好像没什么需要做的
      reIcon.titleSuffixIcon = field.titleIcon;
    }
    // 提示区图标
    else if (hasTip) {
      // 提示在前缀
      if ('prefix' == tipIconInfo.type) {
        reIcon.tipPrefixIcon = field.tipIcon;
      }
      // 提示在后缀
      else if ('suffix' == tipIconInfo.type) {
        reIcon.tipSuffixIcon = field.tipIcon;
      }
    }
  }
  //
  // 状态图标
  //
  if (status && status.icon) {
    let statusTip = status.text ?? fieldTip;
    Util.selectValue(field.vars, field.tip, {
      explain: true,
    });
    // 显示标题
    if (hasTitle) {
      reIcon.titleSuffixIcon = status.icon;
      reIcon.titleSuffixTip = statusTip;
    }
    // 显示提示区
    else if (hasTip) {
      reIcon.tipPrefixIcon = status.icon;
      reIcon.titlePrefixTip = statusTip;
    }
    // 那么就是 Value 区了
    else {
      reIcon.valueIcon = status.icon;
      reIcon.valueTip = statusTip;
    }
  }

  return reIcon;
}

export type FieldTextInfo = {
  title: string;
  titleType?: TextContentType;
  tip?: string;
  tipType?: TextContentType;
};

export function getFieldTextInfo(
  field: Pick<
    FormFieldItem,
    | 'title'
    | 'titleType'
    | 'fieldTitleBy'
    | 'tip'
    | 'tipType'
    | 'isRequired'
    | 'data'
  >,
  vars?: Vars
): FieldTextInfo {
  let {
    title: title_arms,
    titleType,
    fieldTitleBy,
    isRequired,
    tip: tip_arms,
    tipType,
  } = field;
  let ctx: FieldDynamicContext = { data: field.data, vars: vars ?? {} };

  // for title
  let title: string | undefined;
  if (_.isFunction(title_arms)) {
    title = title_arms(ctx);
  } else if (title_arms) {
    title = Util.selectValue(ctx, title_arms, {
      explain: true,
    });
  }

  // auto i18n
  if (title) {
    title = I18n.text(title);
  }
  if (isRequired && isRequired(field.data) && title && !fieldTitleBy) {
    if ('text' == titleType) {
      title = _.escape(title);
    }
    title = '<b class="required-mark">*</b>' + title;
    titleType = 'html';
  }

  // for tip
  let tip = Util.selectValue(ctx, tip_arms, { explain: true });

  return { title: title ?? '', titleType, tip, tipType };
}

export function getBodyPartStyle(
  props: FormItemGroup | GridFieldsProps
): Vars {
  let css = _.cloneDeep(props.bodyPartStyle) || {};
  if (props.bodyPartDense) {
    css['grid-auto-flow'] = 'dense';
  }
  return css;
}
