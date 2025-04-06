import _ from 'lodash';
import { computed } from 'vue';
import {
  SelectableState,
  TableRowID,
  TiRoadblock,
  useSelectable,
  Vars,
} from '../../..';
import { CssUtils, EventUtils, tiGetComponent, Util } from '../../../core';
import {
  WallEmitter,
  WallEvent,
  WallItem,
  WallProps,
  WallSelectEmitInfo,
} from './ti-wall-types';

export type WallSelectApi = ReturnType<typeof useWall>;

export function useWall(
  props: WallProps,
  selection: SelectableState<TableRowID>,
  emit: WallEmitter
) {
  const selectable = useSelectable<TableRowID>(props, {
    getItem: (id: TableRowID) => getWallItemById(id),
  });
  //-----------------------------------------------------
  function getWallItemClass(item: WallItem) {
    let id = item.id;
    let isCurrent = selectable.isDataActived(
      selection,
      item.index,
      item.rawData
    );
    let isChecked = selectable.isDataChecked(
      selection,
      item.index,
      item.rawData
    );
    return CssUtils.mergeClassName(item.className, {
      'is-current': isCurrent,
      'is-checked': isChecked,
    });
  }
  //-----------------------------------------------------
  function OnItemSelect(itemEvent: WallEvent) {
    // 防守
    if (!props.canSelect) {
      return;
    }
    let oldCurrentId = _.cloneDeep(selection.currentId);
    let oldCheckedIds = _.cloneDeep(selection.checkedIds);
    let se = EventUtils.getKeyboardStatus(itemEvent.event);
    if (props.multi) {
      selectable.select(selection, itemEvent.item.id, se);
    } else {
      selectable.selectId(selection, itemEvent.item.id);
    }

    let info = selectable.getSelectionEmitInfo(
      selection,
      props.data || [],
      oldCheckedIds,
      oldCurrentId
    ) as WallSelectEmitInfo;
    emit('select', info);
  }
  //-----------------------------------------------------
  function OnItemCheck(itemEvent: WallEvent) {
    // 防守
    if (!props.showChecker) {
      return;
    }
    let oldCurrentId = _.cloneDeep(selection.currentId);
    let oldCheckedIds = _.cloneDeep(selection.checkedIds);
    if (props.multi) {
      selectable.toggleId(selection, itemEvent.item.id);
    } else {
      selectable.selectId(selection, itemEvent.item.id);
    }

    let info = selectable.getSelectionEmitInfo(
      selection,
      props.data || [],
      oldCheckedIds,
      oldCurrentId
    ) as WallSelectEmitInfo;
    emit('select', info);
  }
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
  const _id_index = new Map<TableRowID, number>();
  //-----------------------------------------------------
  const Items = computed(() => {
    _id_index.clear();
    let re = [] as WallItem[];
    let N = data.length ?? 0;
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

      let rowId = selectable.getDataId(item, i);
      _id_index.set(rowId, i);
      re.push({
        index: i,
        id: rowId,
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
  function getWallItemByIndex(index: number): WallItem | undefined {
    return _.nth(Items.value, index);
  }
  //-----------------------------------------------------
  function getWallItemById(id: TableRowID): WallItem | undefined {
    let index = _id_index.get(id);
    if (_.isNil(index)) {
      return;
    }
    return _.nth(Items.value, index);
  }
  //-----------------------------------------------------
  // 返回特性
  //-----------------------------------------------------
  return {
    Items,
    getWallItemByIndex,
    getWallItemById,
    getItemId: selectable.getDataId,
    resetSelection: selectable.resetSelection,
    getWallItemClass,
    OnItemSelect,
    OnItemCheck,
    updateSelection: selectable.updateSelection,
  };
}
