import _ from 'lodash';
import { LayoutItem, LayoutProps, LayoutSchema, LayoutState } from '../../';
import { CssUtils } from '../../../core';

/**
 * 根据布局项块的特征，为其指定一个确定的类型
 *
 * @param it 布局项块
 */
export function autoSetLayoutItemType(it: LayoutItem) {
  if (!it.type) {
    // Grid
    if (it.layout) {
      it.type = 'grid';
    }
    // Tabs
    else if (it.blocks) {
      it.type = 'tabs';
    }
    // 默认就是 Block， 放个路障
    else {
      it.type = 'block';
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
  // 布局块
  if ('block' == it.type && !it.comType) {
    let refName = it.body || it.name;
    if (refName) {
      let ref = schema[refName];
      _.assign(it.itemConfig, ref);
    }
    // 设置默认
    if (!it.itemConfig?.comType) {
      _.assign(it.itemConfig, {
        comType: 'TiRoadblock',
        comConf: {
          icon: 'fas-person-digging',
          text: it.name || 'Layout Block',
        },
      });
    }
  }
  // 格子布局
  else if ('grid' == it.type) {
    it.itemConfig = _.pick(it, 'name', 'blocks', 'layout');
  }
  // 标签布局
  else if ('tabs' == it.type) {
    it.itemConfig = _.pick(
      it,
      'name',
      'blocks',
      'tabAt',
      'tabAlign',
      'defaultTab'
    );
  }
}

export type LayoutItemsInput = Pick<
  LayoutProps,
  'blocks' | 'schema' | 'itemStyle'
>;

/**
 * 根据布局属性，生成布局项块列表
 *
 * @param state 布局的运行时状态
 * @param props 布局的输入属性
 * @returns 布局项块列表
 */
export function getLayoutItem(state: LayoutState, props: LayoutItemsInput) {
  let { blocks = [], schema = {}, itemStyle = {} } = props;
  let { shown } = state;
  let list = [] as LayoutItem[];

  for (let i = 0; i < blocks.length; i++) {
    let item = blocks[i];
    if (item.name && shown && false === shown[item.name]) {
      continue;
    }

    // 准备布局项目
    let it = _.cloneDeep(item) as LayoutItem;
    //console.log(i, it);
    it.index = i;
    if (!it.uniqKey) {
      it.uniqKey = it.name ?? `B${i}`;
    }
    autoSetLayoutItemType(it);
    it.itemConfig = {};

    // 布局项的 ClassName
    it.className = CssUtils.mergeClassName(it.className, `as-${it.type}`);

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
