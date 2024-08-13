import _ from 'lodash';
import {
  LayoutPanelItem,
  LayoutPanelProps,
  LayoutProps,
  LayoutState,
  positionToTransName,
} from '../../';
import { ActionBarItem, Vars } from '../../../_type';
import { CssUtils } from '../../../core';

import { autoSetLayoutItemType, setLayoutItemConfig } from './layout-support';

export function getLayoutPanelItems(
  state: LayoutState,
  props: LayoutProps & LayoutPanelProps
): LayoutPanelItem[] {
  let { panels = [], schema = {}, panelStyle = {} } = props;
  let { shown } = state;
  let list = [] as LayoutPanelItem[];

  for (let i = 0; i < panels.length; i++) {
    let pan = panels[i];

    // 准备布局项目
    let it = _.cloneDeep(pan) as unknown as LayoutPanelItem;
    it.index = i;
    if (!it.uniqKey) {
      it.uniqKey = it.name ?? `B${i}`;
    }
    autoSetLayoutItemType(it);

    if (it.clickMaskToClose && _.isNil(it.showMask)) {
      it.showMask = true;
    }

    // 布局项的 ClassName
    it.conClass = CssUtils.mergeClassName(
      it.conClass,
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
      it.conClass[`speed-${it.tranSpeed}`] = true;
    }

    let _out_style = {} as Vars;
    let _con_style = {} as Vars;

    // 位置
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
    if ('free' == pan.position) {
      _con_style = _.pick(pan, ...[...posKey, ...sizKey]);
    } else {
      _con_style = _.pick(pan, sizKey);
    }

    // 布局项的样式
    it.conStyle = CssUtils.mergeStyles([
      panelStyle,
      it.style,
      it.grid,
      _con_style,
    ]);
    it.style = CssUtils.mergeStyles([_out_style]);

    // 如果未定义 clickMaskToClose，那么总得有个关闭按钮
    if (!it.clickMaskToClose || pan.showCloser) {
      it.actions = it.actions || [];
      it.actions.push({
        icon: 'zmdi-close',
        className: { 'hover-rotate': true, 'bg-transparent': true },
        action: { name: '__close_panel', payload: it },
      } as ActionBarItem);
      //console.log('auto actions', it.actions);
    }

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
