import _ from 'lodash';
import { AnyOptionItem, IconInput, TableRowID, Vars } from '../../../_type';
import { EventUtils, I18n, Tmpl, Util } from '../../../core';
import { getLogger } from '../../../core/log/ti-log';
import {
  SelectableState,
  useDataLogicType,
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
  // 启用特性: 选择行，对于列表 getId 与 getValue 通常用户只会指定一个
  let _get_id: undefined | string | ((it: Vars, index: number) => TableRowID) =
    undefined;
  if (props.getId) {
    _get_id = props.getId;
  } else if (props.getValue) {
    _get_id = props.getValue;
  }
  let selectable = useSelectable<TableRowID>({ ...props, getId: _get_id });
  const getRowType = useDataLogicType(props.getRowType);
  //-----------------------------------------------------
  // 标准列表
  let { toStdItem } = useStdListItem({
    ...props,
    getValue: (it: Vars, index: number) => {
      return selectable.getDataId(it, index);
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
  function getMarkerIcons(): [IconInput, IconInput] | undefined {
    if (props.markerIcons) {
      if ('auto' == props.markerIcons) {
        if (props.multi) {
          return ['zmdi-square-o', 'zmdi-check-square'];
        }
        return ['zmdi-circle-o', 'zmdi-dot-circle'];
      }
      return props.markerIcons;
    }
    // 如果是多选，但是没有指定 markerIcon
    else if (_.isNil(props.markerIcons) && props.multi) {
      return ['zmdi-square-o', 'zmdi-check-square'];
    }
    return undefined;
  }
  //-----------------------------------------------------
  // 准备格式化文本函数
  //-----------------------------------------------------
  let _gen_format_ctx = (it: AnyOptionItem, raw: Vars): Vars => {
    let re = {
      text: it.text,
      tip: it.tip,
      value: it.value,
      raw,
    };
    // 为了 HTML 需要逃逸一下
    if (props.textAsHtml) {
      re = Util.escapeAnyForHtml(re);
    }
    // 搞定
    return re;
  };
  let _format_display_text: (it: AnyOptionItem, raw: Vars) => string;
  // 默认的渲染方式用文本
  let _text_format = props.textFormat ?? '<em>${text}</em><abbr>${tip}</abbr>';

  // 字符串格式化模板
  if (_.isString(_text_format)) {
    const _tmpl = Tmpl.parse(_text_format);
    _format_display_text = (it: AnyOptionItem, raw: Vars): string => {
      let ctx = _gen_format_ctx(it, raw);
      return _tmpl.render(ctx);
    };
  }
  // 自定义格式化函数
  else {
    _format_display_text = _text_format;
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
      let type = getRowType ? getRowType(li) : undefined;
      if (type) {
        className[`is-${type}`] = true;
      }
      // 选项信息
      let stdItem = toStdItem(li, index);
      let { value, icon, text, tip } = stdItem;

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
      let it: ListItem = {
        className,
        value,
        icon,
        text,
        tip,

        index,
        current: is_current,
        checked: is_checked,
        displayText: text ?? '',
      };

      // 生成显示文字内容
      it.displayText = _format_display_text(it, li);

      // 记入列表
      items.push(it);

      // 计数
      index++;
    } // ~ for (let li of props.data) {

    // 搞定返回
    return items;
  }
  //-----------------------------------------------------
  function itemsHasIcon(items: ListItem[]) {
    for (let it of items) {
      if (it.icon) {
        return true;
      }
    }
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
    getRoadblock,
    buildOptionItems,
    itemsHasIcon,
    itemsHasTip,
    getMarkerIcons,

    updateSelection: selectable.updateSelection,

    OnItemSelect,
    OnItemCheck,
  };
}
