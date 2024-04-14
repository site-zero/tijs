import _ from 'lodash';
import {
  LayoutBlock,
  LayoutItem,
  LayoutProps,
  LayoutState,
  PopItemProps,
  TranName,
  TranSpeed,
} from '../../';
import { CssUtils, PopPosition, Vars } from '../../../core';

import { autoSetLayoutItemType, setLayoutItemConfig } from './layout-support';

function _position_to_transName(pos: PopPosition): TranName {
  return {
    'left': 'ti-slide-left',
    'right': 'ti-slide-right',
    'top': 'ti-slide-up',
    'bottom': 'ti-slide-down',
    'center': 'ti-zoom',
    'free': 'ti-zoom',
    'left-top': 'ti-zoom',
    'right-top': 'ti-zoom',
    'bottom-left': 'ti-zoom',
    'bottom-right': 'ti-zoom',
  }[pos] as TranName;
}

export type LayoutPanel = LayoutBlock & PopItemProps;

export type LayoutPanelItem = LayoutItem & {
  position: PopPosition;
  showMask?: boolean;
  clickMaskToClose?: boolean;
  /**
   * 得到过渡动画相关
   */
  tranSpeed?: TranSpeed;
  tranName: TranName;
  /**
   * 计算出来的，当前段面板是否是隐藏
   */
  hidden: boolean;
  visible: boolean;
};

export type LayoutPanelProps = {
  panels?: LayoutPanel[];
  panelStyle?: Vars;
};

export function getLayoutPanelItems(
  state: LayoutState,
  props: LayoutProps & LayoutPanelProps
): LayoutPanelItem[] {
  let { panels = [], schema = {}, panelStyle = {} } = props;
  let { shown } = state;
  let list = [] as LayoutPanelItem[];

  for (let i = 0; i < panels.length; i++) {
    let item = panels[i];

    // 准备布局项目
    let it = _.cloneDeep(item) as unknown as LayoutPanelItem;
    it.index = i;
    if (!it.uniqKey) {
      it.uniqKey = it.name ?? `B${i}`;
    }
    autoSetLayoutItemType(it);
    it.itemConfig = {};

    if (it.clickMaskToClose && _.isNil(it.showMask)) {
      it.showMask = true;
    }

    // 布局项的 ClassName
    it.className = CssUtils.mergeClassName(
      it.className,
      `as-${it.type}`,
      `at-${it.position || 'center'}`,
      'ti-trans',
      `origin-${it.position}`,
      {
        'show-mask': it.showMask,
        'no-mask': !it.showMask,
      }
    );
    if (it.tranSpeed) {
      it.className[`speed-${it.tranSpeed}`] = true;
    }

    let _out_style = {} as Vars;
    let _con_style = {} as Vars;

    //
    let posKey = ['left', 'right', 'top', 'bottom'];
    let sizKey = [
      'overflow',
      'width',
      'height',
      'maxWidth',
      'maxHeight',
      'minWidth',
      'minHeight',
    ];
    if ('free' == item.position) {
      _con_style = _.pick(item, ...[...posKey, ...sizKey]);
    } else {
      _con_style = _.pick(item, sizKey);
    }

    // 布局项的样式
    it.conStyle = CssUtils.mergeStyles([
      panelStyle,
      it.style,
      it.grid,
      _con_style,
    ]);
    it.style = CssUtils.mergeStyles([_out_style]);

    // 设置布局项的属性
    setLayoutItemConfig(it, schema);

    // 记入一下 Panel 相关属性
    it.visible = shown[it.uniqKey] ? true : false;
    it.hidden = !it.visible;
    it.tranName = _position_to_transName(it.position);

    // 记入返回列表
    list.push(it);
  }
  return list;
}
