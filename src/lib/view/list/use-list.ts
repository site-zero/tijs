import _ from 'lodash';
import { computed } from 'vue';
import { AnyOptionItem, IconInput, TableRowID, Vars } from '../../../_type';
import { EventUtils, I18n, Tmpl, Util } from '../../../core';
import {
  SelectableState,
  useDataLogicType,
  useSelectable,
  useStdListItem,
} from '../../_features';
import { RoadblockProps } from '../../tile/roadblock/ti-roadblock-types';
import {
  IndentlyItem,
  ListEmitter,
  ListEvent,
  ListItem,
  ListProps,
  ListSelectEmitInfo,
} from './ti-list-types';

const debug = false;

export function useList(
  props: ListProps,
  selection: SelectableState<TableRowID>,
  emit: ListEmitter
) {
  // 启用特性: 选择行，对于列表 getId 与 getValue 通常用户只会指定一个
  let _get_id: undefined | string | ((it: Vars, index: number) => TableRowID) =
    undefined;
  //-----------------------------------------------------
  // 指定了获取 ID 的方式
  if (props.getId) {
    _get_id = props.getId;
  }
  // 指定了获取值的方式，也可以用来获取
  else if (props.getValue) {
    _get_id = props.getValue;
  }
  //-----------------------------------------------------
  const selectable = useSelectable<TableRowID>(
    { ...props, getId: _get_id },
    {
      getItem: (id: TableRowID) => {
        let it = getItemById(id);
        if (!it) {
          return;
        }
        return {
          id: it.value,
          rawData: it.rawData,
          index: it.index,
        };
      },
    }
  );
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
  const _id_index = new Map<TableRowID, number>();
  //-----------------------------------------------------
  function __build_option_items(): ListItem[] {
    _id_index.clear();
    let items = [] as ListItem[];
    if (!props.data) {
      return items;
    }
    for (let index = 0; index < props.data.length; index++) {
      let li = props.data[index];
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

      // 归纳映射表
      _id_index.set(value, index);

      // 准备判断是否可以选择
      let sIt = { id: value, rawData: li, index };
      let canCheck = selectable.canCheckItem(sIt);
      let canSelect = selectable.canSelectItem(sIt);

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
        rawData: li,
        canCheck,
        canSelect,
      };

      // 生成显示文字内容
      it.displayText = _format_display_text(it, li);

      // 记入列表
      items.push(it);
    } // ~ for (let li of props.data) {

    // 搞定返回
    return items;
  }
  //-----------------------------------------------------
  const Items = computed(() => __build_option_items());
  //-----------------------------------------------------
  function getItemByIndex(index: number): ListItem | undefined {
    return _.nth(Items.value, index);
  }
  //-----------------------------------------------------
  function getItemById(id: TableRowID): ListItem | undefined {
    let index = _id_index.get(id);
    if (_.isNil(index)) {
      return;
    }
    return _.nth(Items.value, index);
  }
  //-----------------------------------------------------
  function itemsHasIcon(items: IndentlyItem[]) {
    for (let it of items) {
      if (it.rowIcon) {
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
  function OnItemSelect(itemEvent: ListEvent) {
    if (debug) console.log('OnItemSelect', itemEvent);
    let { item, event } = itemEvent;
    if (
      !props.multi &&
      !selectable.canSelectItem({
        id: item.value,
        rawData: item.rawData,
        index: item.index,
      })
    ) {
      return;
    }
    let oldCurrentId = _.cloneDeep(selection.currentId);
    let oldCheckedIds = _.cloneDeep(selection.checkedIds);
    let se = EventUtils.getKeyboardStatus(event);
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
  function OnItemCheck(itemEvent: ListEvent) {
    if (debug) console.log('OnItemCheck', itemEvent);
    let { item } = itemEvent;
    if (
      !selectable.canCheckItem({
        id: item.value,
        rawData: item.rawData,
        index: item.index,
      })
    ) {
      return;
    }
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
    Items,
    getItemByIndex,
    getItemById,

    getRoadblock,
    itemsHasIcon,
    itemsHasTip,
    getMarkerIcons,

    updateSelection: selectable.updateSelection,

    OnItemSelect,
    OnItemCheck,
  };
}
