import { computed } from 'vue';
import { TiRoadblock, Vars } from '../../..';
import { CssUtils, tiGetComponent, Util } from '../../../core';
import { WallEmitter, WallItem, WallProps } from './ti-wall-types';
import { useWallSelect } from './use-wall-select';

export type WallFeature = ReturnType<typeof useWall>;

export function useWall(props: WallProps, emit: WallEmitter) {
  let _wall_select = useWallSelect(props, emit);
  //-----------------------------------------------------
  let {
    data = [],
    vars = {},
    itemStyle = {},
    itemConStyle = {},
    getItemStyle,
    getItemConStyle,
    getItemClass,
    getItemConClass,
    getItemLogicType,
  } = props;
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
      let conStyle = CssUtils.mergeStyles([
        itemConStyle,
        getItemConStyle?.(item, i),
      ]);

      // 类
      let className = CssUtils.mergeClassName(
        {},
        {
          [`is-${type}`]: type ? true : false,
        },
        getItemClass?.(item, i)
      );

      let conClass = CssUtils.mergeClassName(
        {},
        {
          [`is-${type}`]: type ? true : false,
        },
        getItemConClass?.(item, i)
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
        id: _wall_select.getItemId(item, i),
        rawData: item,
        type,
        style,
        className,
        conStyle,
        conClass,
        comType: tiGetComponent(comType)?.com ?? TiRoadblock,
        comConf,
      });
    }

    return re;
  });

  //-----------------------------------------------------
  // 返回特性
  //-----------------------------------------------------
  return {
    Items,
    ..._wall_select,
  };
}
