import { computed } from 'vue';
import { Vars } from '../../..';
import { CssUtils, Util } from '../../../core';
import { WallItem, WallProps } from './ti-wall-types';

export type WallFeature = ReturnType<typeof useWall>;

export function useWall(props: WallProps) {
  let {
    data = [],
    vars = {},
    itemStyle = {},
    getItemStyle,
    getItemClass,
    getItemLogicType,
  } = props;

  //-----------------------------------------------------
  // 逐个处理 Wall 项目
  const WallItems = computed(() => {
    let re = [] as WallItem[];
    for (let i = 0; i < data.length; i++) {
      let item = data[i];

      let itVars = { ...vars, item };

      // 逻辑类型
      let type = getItemLogicType?.(item, i);

      // 样式
      let style = CssUtils.mergeStyles([itemStyle, getItemStyle?.(item, i)]);

      // 类
      let className = getItemClass?.(item, i) ?? {};

      // 处理控件
      let comType = Util.explainObj(itVars, props.comType) as string;
      let comConf = Util.explainObj(itVars, props.comConf) as Vars;

      re.push({
        index: i,
        item,
        type,
        style,
        className,
        comType,
        comConf,
      });
    }

    return re;
  });

  //-----------------------------------------------------
  // 返回特性
  //-----------------------------------------------------
  return {
    WallItems,
  };
}
