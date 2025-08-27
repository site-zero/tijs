import _ from "lodash";
import {
  BlockProps,
  LayoutGridProps,
  LayoutItem,
  LayoutProps,
  LayoutSchema,
  LayoutState,
  TabsLayoutProps,
} from "../../";
import { CssUtils } from "../../../core";

/**
 * 根据布局项块的特征，为其指定一个确定的类型
 *
 * @param it 布局项块
 */
export function autoSetLayoutItemType(it: LayoutItem) {
  if (!it.type) {
    // Grid
    if (it.layout) {
      it.type = "grid";
    }
    // Tabs
    else if (it.blocks) {
      it.type = "tabs";
    }
    // 默认就是 Block， 放个路障
    else {
      it.type = "block";
    }
  }
}

/**
 * 为布局项块，设置控件的配置信息 comType,comConf：
 *
 *  - `block`: 默认采用 TiRoadblock
 *  - `grid` : 提取 name,blocks,layout 作为自己的配置项
 *  - `tabs` : 提取 name,blocks,tabAt,tabAlign,defaultTab 作为自己的配置项
 *
 * @param it  布局项块
 * @param schema 布局项块的具体配置信息集合
 */
export function setLayoutItemConfig(it: LayoutItem, schema: LayoutSchema) {
  const __pick_props_for_block = (it: LayoutItem): BlockProps => {
    return {
      icon: it.icon,
      title: it.title,
      titleStyle: it.titleStyle,
      name: it.name,
      actions: it.actions,
      actionVars: it.actionVars,
      actionClass: it.actionClass,
      actionBar: it.actionBar,
      actionStyle: it.actionStyle,
      headClass: it.headClass,
      headStyle: it.headStyle,
      mainClass: it.mainClass,
      mainStyle: it.mainStyle,
      overflowMode: it.overflowMode,
    };
  };
  // 布局块
  if ("block" == it.type) {
    it.propsForBlock = _.cloneDeep(it);
    // 特殊的属性
    _.assign(it.propsForBlock, {
      className: it.bodyClass,
    } as BlockProps);
    // 直接指定了控件
    if (it.comType) {
      _.assign(it.propsForBlock, {
        comType: it.comType,
        comConf: it.comConf ?? {},
      });
    }
    // 获取参考控件
    else {
      let refName = it.body || it.name;
      if (refName) {
        let ref = schema[refName];
        _.assign(it.propsForBlock, ref);
      }
    }
    // 设置默认
    if (!it.propsForBlock.comType) {
      _.assign(it.propsForBlock, {
        comType: "TiRoadblock",
        comConf: {
          icon: "fas-person-digging",
          text: it.name || "Layout Block",
        },
      });
    }
  }
  // 格子布局
  else if ("grid" == it.type) {
    // 获取格子布局的属性
    let _layout_grid_props = _.pick(
      it,
      "name",
      "blocks",
      "conStyle",
      "layout",
      "keepSizes",
      "KeepShown",
      "layoutHint",
      "layoutGridTracks",
      "customizedGridTracks",
      "gridStyle",
      "resetLocalGridTracks"
    );

    // 格子布局还需要套上一个TiBlock
    if (it.title) {
      it.propsForBlock = __pick_props_for_block(it);
      // 特殊的属性
      _.assign(it.propsForBlock, {
        comType: "TiLayoutGrid",
        comConf: {
          className: it.gridClass,
          layout: it.layout,
          schema: schema,
          subLayout: true,
          itemStyle: it.itemStyle,
          itemClass: it.itemClass,
          ..._layout_grid_props,
          keepSizes: it.keep,
        } as LayoutGridProps,
      } as BlockProps);
    }
    // 纯格子布局
    else {
      it.propsForLayoutGrid = _layout_grid_props;
      // 特殊的属性
      _.assign(it.propsForLayoutGrid, {
        className: it.gridClass,
        itemStyle: it.itemStyle,
        itemClass: it.itemClass,
        keepSizes: it.keep,
      } as LayoutGridProps);
    }
  }
  // 标签布局
  else if ("tabs" == it.type) {
    let _layout_tabs_props = _.pick(
      it,
      "name",
      "blocks",
      "tabsAt",
      "tabsAlign",
      "wrapTabs",
      "tabMaxWidth",
      "tabItemSpace",
      "defaultTab",
      "keepTab"
    );
    // 格子布局还需要套上一个TiBlock
    if (it.title) {
      it.propsForBlock = __pick_props_for_block(it);
      // 特殊的属性
      _.assign(it.propsForBlock, {
        objectFit: "cover",
        comType: "TiLayoutTabs",
        comConf: {
          className: CssUtils.mergeClassName(it.tabsClass, "cover-parent"),
          schema: schema,
          subLayout: true,
          itemStyle: it.itemStyle,
          itemClass: it.itemClass,
          ..._layout_tabs_props,
        } as LayoutGridProps,
      } as BlockProps);
    }
    // 纯标签布局
    else {
      it.propsForLayoutTabs = _.assign(_layout_tabs_props, {
        classNme: it.tabsClass,
        itemStyle: it.itemStyle,
        itemClass: it.itemClass,
      } as TabsLayoutProps);
    }
  }
}

// export type LayoutItemsInput = Pick<
//   LayoutProps,
//   'blocks' | 'schema' | 'itemStyle' | 'itemClass'
// >;

/**
 * 根据布局属性，生成布局项块列表
 *
 * @param state 布局的运行时状态
 * @param props 布局的输入属性
 * @returns 布局项块列表
 */
export function getLayoutItem(state: LayoutState, props: LayoutProps) {
  let { blocks = [], schema = {}, itemStyle = {}, itemClass } = props;
  let { shown } = state;
  let list = [] as LayoutItem[];

  for (let i = 0; i < blocks.length; i++) {
    let item = blocks[i];
    //console.log(i, item.name)
    if (item.name && shown && false === shown[item.name]) {
      continue;
    }

    // 准备布局项目
    let it = _.cloneDeep(item) as LayoutItem;
    _.defaults(it, itemClass);
    it.index = i;
    if (!it.uniqKey) {
      it.uniqKey = it.name ?? `B${i}`;
    }
    autoSetLayoutItemType(it);

    // 布局项的 ClassName
    it.conClass = CssUtils.mergeClassName(it.conClass, `as-${it.type}`, {
      "cover-parent": "cover" == it.blockFit,
      "fit-parent": "fit" == it.blockFit,
    });
    it.blockClass = CssUtils.mergeClassName(it.blockClass, {
      "cover-parent": "cover" == it.blockFit,
      "fit-parent": "fit" == it.blockFit,
    });

    // 布局项的样式
    it.conStyle = CssUtils.mergeStyles([itemStyle, it.style]);
    it.style = CssUtils.mergeStyles([it.grid]);

    // 设置布局项的属性
    setLayoutItemConfig(it, schema);

    // 记入返回列表
    list.push(it);
  }
  return list;
}
