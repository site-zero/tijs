import _ from 'lodash';
import { EventUtils, IconInput, Vars, getLogger } from '../../../core';
import { SelectableState, useSelectable } from '../../_features';
import { RoadblockProps } from '../../tile/roadblock/ti-roadblock-types';
import { TableRowID } from '../table/ti-table-type';
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

  let {
    getIcon = (item: Vars) => item.icon,
    getText = (item: Vars) => item.text ?? item.title ?? item.nickname,
    getTip = (item: Vars) => item.tip,
  } = props;

  function getItemValue(it: Vars): TableRowID | undefined {
    return selectable.getDataId(it);
  }

  function getItemIcon(it: Vars): IconInput | undefined {
    if (getIcon) {
      if (_.isString(getIcon)) {
        return _.get(it, getIcon);
      }
      return getIcon(it);
    }
  }

  function getItemText(it: Vars): string | undefined {
    if (getText) {
      if (_.isString(getText)) {
        return _.get(it, getText);
      }
      return getText(it);
    }
  }

  function getItemTip(it: Vars): string | undefined {
    if (getTip) {
      if (_.isString(getTip)) {
        return _.get(it, getTip);
      }
      return getTip(it);
    }
  }

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
    _.assign(re, props.blankAs);
    return re as RoadblockProps;
  }

  function buildOptionItems(
    selection: SelectableState<TableRowID>
  ): ListItem[] {
    let items = [] as ListItem[];
    if (props.data) {
      let index = 0;
      for (let li of props.data) {
        let is_current = selectable.isDataActived(selection, li);
        let is_checked = selectable.isDataChecked(selection, li);
        let it = {
          index,
          current: is_current,
          checked: is_checked,
          className: {
            'is-current': is_current,
            'is-checked': is_checked,
          } as Vars,
        } as ListItem;
        it.value = getItemValue(li);
        it.icon = getItemIcon(li);
        it.text = getItemText(li);
        it.tip = getItemTip(li);
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
    // Guard
    if (!props.selectable) {
      return;
    }
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
    // Guard
    if (!props.selectable) {
      return;
    }
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
    selectable,
    getItemValue,
    getItemIcon,
    getItemText,
    getItemTip,
    getRoadblock,
    buildOptionItems,
    itemsHasIcon,
    itemsHasTip,

    OnItemSelect,
    OnItemCheck,
  };
}
