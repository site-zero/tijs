import _ from 'lodash';
import { AnyOptionItem, TableRowID, Vars } from '../../../_type';
import { EventUtils, I18n, Str, Tmpl } from '../../../core';
import { getLogger } from '../../../core/log/ti-log';
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
  //-----------------------------------------------------
  // 标准列表
  let { getItemValue, getItemIcon, getItemText, getItemTip } = useStdListItem({
    ...props,
    getValue: (it: Vars, index: number) => {
      return selectable.getRowId(it, index);
    },
  });
  //-----------------------------------------------------
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
  //-----------------------------------------------------
  // 准备格式化文本函数
  //-----------------------------------------------------
  let _format_display_text: (it: AnyOptionItem, raw: Vars) => string;
  // 直接采用文本
  if (!props.textFormat) {
    _format_display_text = (it: AnyOptionItem, _raw: Vars): string => {
      return it.text ?? Str.anyToStr(it.value);
    };
  }
  // 字符串格式化模板
  else if (_.isString(props.textFormat)) {
    const _tmpl = Tmpl.parse(props.textFormat);
    _format_display_text = (it: AnyOptionItem, raw: Vars): string => {
      let ctx = { ...it, raw };
      return _tmpl.render(ctx);
    };
  }
  // 自定义格式化函数
  else {
    _format_display_text = props.textFormat;
  }
  //-----------------------------------------------------
  function buildOptionItems(
    selection: SelectableState<TableRowID>
  ): ListItem[] {
    let items = [] as ListItem[];
    if (!props.data) {
      return items;
    }
    let index = 0;
    for (let li of props.data) {
      let is_current = selectable.isDataActived(selection, index, li);
      let is_checked = selectable.isDataChecked(selection, index, li);
      let className: Vars = {
        'is-current': is_current,
        'is-checked': is_checked,
      };
      // 选项信息
      let value = getItemValue(li, index);
      let icon = getItemIcon(li);
      let text = getItemText(li);
      let tip = getItemTip(li);

      // 翻译多国语音
      if (props.autoI18n) {
        if (text) {
          text = I18n.text(text);
        }
        if (tip) {
          tip = I18n.text(tip);
        }
      }

      // 准备列表项
      let it: AnyOptionItem = { className, value, icon, text, tip };

      // 生成显示文字内容
      let displayText = _format_display_text(it, li);

      // 记入列表
      items.push({
        index,
        current: is_current,
        checked: is_checked,
        displayText,
        ...it,
      } as ListItem);

      // 计数
      index++;
    } // ~ for (let li of props.data) {

    // 搞定返回
    return items;
  }
  //-----------------------------------------------------
  function itemsHasIcon(items: ListItem[]) {
    for (let it of items) if (it.icon) return true;
    return false;
  }
  //-----------------------------------------------------
  function itemsHasTip(items: ListItem[]) {
    for (let it of items) if (it.tip) return true;
    return false;
  }
  //-----------------------------------------------------
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
  //-----------------------------------------------------
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
  //-----------------------------------------------------
  // 输出特性
  //-----------------------------------------------------
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
