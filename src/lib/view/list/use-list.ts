import _ from 'lodash';
import { EventUtils, I18n, TableRowID, Vars, getLogger } from '../../../core';
import {
  SelectableState,
  useSelectable,
  useStdListItem,
} from '../../_features';
import { RoadblockProps } from '../../tile/roadblock/ti-roadblock-types';
import {
  ListEmitter,
  ListEvent,
  ListItem,
  ListProps,
  ListSelectEmitInfo,
} from './ti-list-types';

const log = getLogger('TiList.use-list');

export function useList(props: ListProps, emit: ListEmitter) {
  // 启用特性
  let selectable = useSelectable<TableRowID>(props);

  // 标准列表
  let { getItemValue, getItemIcon, getItemText, getItemTip } = useStdListItem({
    ...props,
    getValue: (it: Vars, index: number) => {
      return selectable.getRowId(it, index);
    },
  });

  function getRoadblock() {
    let re = {
      icon: 'fas-list',
      text: 'i18n:empty-data',
      autoI18n: true,
      mode: 'auto',
      layout: 'B',
      size: 'small',
      opacity: 'faint',
    };
    _.assign(re, props.emptyRoadblock);
    return re as RoadblockProps;
  }

  function buildOptionItems(
    selection: SelectableState<TableRowID>
  ): ListItem[] {
    let items = [] as ListItem[];
    if (props.data) {
      let index = 0;
      for (let li of props.data) {
        let is_current = selectable.isDataActived(selection, index, li);
        let is_checked = selectable.isDataChecked(selection, index, li);
        let it = {
          index,
          current: is_current,
          checked: is_checked,
          className: {
            'is-current': is_current,
            'is-checked': is_checked,
          } as Vars,
        } as ListItem;
        it.value = getItemValue(li, index);
        it.icon = getItemIcon(li);
        it.text = getItemText(li);
        it.tip = getItemTip(li);
        if (props.autoI18n) {
          if (it.text) {
            it.text = I18n.text(it.text);
          }
          if (it.tip) {
            it.tip = I18n.text(it.tip);
          }
        }
        items.push(it);
        index++;
      }
    }
    return items;
  }

  function itemsHasIcon(items: ListItem[]) {
    for (let it of items) if (it.icon) return true;
    return false;
  }

  function itemsHasTip(items: ListItem[]) {
    for (let it of items) if (it.tip) return true;
    return false;
  }

  function OnItemSelect(
    selection: SelectableState<TableRowID>,
    itemEvent: ListEvent
  ) {
    log.debug('OnItemSelect', itemEvent);
    let oldCurrentId = _.cloneDeep(selection.currentId);
    let oldCheckedIds = _.cloneDeep(selection.checkedIds);
    let se = EventUtils.getKeyboardStatus(itemEvent.event);
    if (props.multi) {
      selectable.select(selection, itemEvent.item.value, se);
    } else {
      selectable.selectId(selection, itemEvent.item.value);
    }

    let info = selectable.getSelectionEmitInfo(
      selection,
      props.data || [],
      oldCheckedIds,
      oldCurrentId
    ) as ListSelectEmitInfo;
    emit('select', info);
  }

  function OnItemCheck(
    selection: SelectableState<TableRowID>,
    itemEvent: ListEvent
  ) {
    log.debug('OnItemCheck', itemEvent);
    let oldCurrentId = _.cloneDeep(selection.currentId);
    let oldCheckedIds = _.cloneDeep(selection.checkedIds);
    if (props.multi) {
      selectable.toggleId(selection, itemEvent.item.value);
    } else {
      selectable.selectId(selection, itemEvent.item.value);
    }

    let info = selectable.getSelectionEmitInfo(
      selection,
      props.data || [],
      oldCheckedIds,
      oldCurrentId
    ) as ListSelectEmitInfo;
    emit('select', info);
  }

  return {
    getItemValue,
    getItemIcon,
    getItemText,
    getItemTip,
    getRoadblock,
    buildOptionItems,
    itemsHasIcon,
    itemsHasTip,

    updateSelection: selectable.updateSelection,

    OnItemSelect,
    OnItemCheck,
  };
}
