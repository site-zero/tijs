import _ from 'lodash';
import {
  LayoutPanelItem,
  LayoutPanelProps,
  LayoutProps,
  LayoutState,
  positionToTransName,
} from '../../';
import { CssUtils, Vars } from '../../../core';

import { autoSetLayoutItemType, setLayoutItemConfig } from './layout-support';

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
    it.tranName = positionToTransName(it.position);

    // 记入返回列表
    list.push(it);
  }
  return list;
}
