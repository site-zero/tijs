import _ from 'lodash';
import { computed } from 'vue';
import { SelectableState, TableRowID, TiRoadblock, Vars } from '../../..';
import { CssUtils, tiGetComponent, Util } from '../../../core';
import { WallItem, WallProps } from './ti-wall-types';
import { WallSelectApi } from './use-wall-select';

export type WallFeature = ReturnType<typeof useWall>;

export function useWall(props: WallProps, _wall_select: WallSelectApi) {
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
      let comConf = Util.explainObj(itVars, props.comConf ?? {}) as Vars;

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
  // //-----------------------------------------------------
  // function updateSelection(selection: SelectableState<TableRowID>) {
  //   selection.currentId = props.currentId;

  //   // 没有选择
  //   if (_.isNil(props.checkedIds)) {
  //     selection.checkedIds = new Map();
  //   }
  //   // 数组
  //   else if (_.isArray(props.checkedIds)) {
  //     selection.checkedIds = Util.arrayToMap(props.checkedIds);
  //   }
  //   // 本身就是 Map
  //   else if (props.checkedIds instanceof Map) {
  //     selection.checkedIds = props.checkedIds;
  //   }
  //   // 普通对象
  //   else {
  //     selection.checkedIds = Util.objToMap(props.checkedIds);
  //   }
  // }

  //-----------------------------------------------------
  // 返回特性
  //-----------------------------------------------------
  return {
    Items,
  };
}
