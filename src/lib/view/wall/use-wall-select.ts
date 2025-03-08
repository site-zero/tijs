import _ from 'lodash';
import { SelectableState, TableRowID, useSelectable } from '../../..';
import { CssUtils, EventUtils } from '../../../core';
import {
  WallEmitter,
  WallEvent,
  WallItem,
  WallProps,
  WallSelectEmitInfo,
} from './ti-wall-types';

export type WallSelectApi = ReturnType<typeof useWallSelect>;

export function useWallSelect(props: WallProps, emit: WallEmitter) {
  let selectable = useSelectable<TableRowID>(props);
  //-----------------------------------------------------
  function getItemClass(
    selection: SelectableState<TableRowID>,
    item: WallItem
  ) {
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
  function OnItemSelect(
    selection: SelectableState<TableRowID>,
    itemEvent: WallEvent
  ) {
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
  function OnItemCheck(
    selection: SelectableState<TableRowID>,
    itemEvent: WallEvent
  ) {
    // 防守
    if (!props.canCheck) {
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
  // 返回特性
  //-----------------------------------------------------
  return {
    getItemId: selectable.getDataId,
    resetSelection: selectable.resetSelection,
    getItemClass,
    OnItemSelect,
    OnItemCheck,
    updateSelection: selectable.updateSelection,
  };
}
