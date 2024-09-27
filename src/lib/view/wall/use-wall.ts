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
  const TopClass = computed(() => {
    return CssUtils.mergeClassName(props.className);
  });
  //-----------------------------------------------------
  const TopStyle = computed(() => {
    return CssUtils.toStyle(props.style);
  });
  //-----------------------------------------------------
  const ConStyle = computed(() => {
    return CssUtils.mergeStyles([props.conStyle, props.layout]);
  });
  //-----------------------------------------------------
  // 逐个处理 Wall 项目
  const Items = computed(() => {
    let re = [] as WallItem[];
    let N = props.data?.length ?? 0;
    for (let i = 0; i < N; i++) {
      let item = data[i];

      let itVars = { ...vars, item };

      // 逻辑类型
      let type = getItemLogicType?.(item, i);

      // 样式
      let style = CssUtils.mergeStyles([itemStyle, getItemStyle?.(item, i)]);

      // 类
      let className = CssUtils.mergeClassName(
        {},
        {
          [`is-${type}`]: type ? true : false,
        },
        getItemClass?.(item, i)
      );

      // 处理控件
      let comType = Util.explainObj(
        itVars,
        props.comType ?? 'TiThumb'
      ) as string;
      let comConf = Util.explainObj(
        itVars,
        props.comConf ?? {
          width: '100%',
        }
      ) as Vars;

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
    TopClass,
    TopStyle,
    ConStyle,
    Items,
  };
}
