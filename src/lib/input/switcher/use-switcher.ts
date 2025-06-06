import _ from 'lodash';
import { computed, ref } from 'vue';
import {
  KeyboardStatus,
  LogicType,
  OptionItem,
  TableRowID,
  Vars,
} from '../../../_type';
import { CssUtils, EventUtils, Util } from '../../../core';
import { SelectableState, useOptions, useSelectable } from '../../../lib';
import { SwitcherProps } from './ti-switcher-types';

export type SwitcherEmitter = {
  (event: 'change', payload: null | TableRowID | TableRowID[]): void;
};

export type OptionDisplayItem = OptionItem<TableRowID> & {
  type?: LogicType;
  className?: any;
  style?: Vars;
  checked?: boolean;
  index: number;
};

export function useSwitcher(
  selection: SelectableState<TableRowID>,
  props: SwitcherProps,
  emit: SwitcherEmitter
) {
  //-----------------------------------------------------
  //console.log('useSwitcher')
  const _sw_options = computed(() =>
    useOptions({
      options: props.options,
      dictVars: props.dictVars,
      mustInOptions: true,
    })
  );
  //-----------------------------------------------------
  const options = ref<OptionDisplayItem[]>([]);
  //-----------------------------------------------------
  const _id_index = new Map<TableRowID, number>();
  //-----------------------------------------------------
  function _build_display_items(): OptionDisplayItem[] {
    _id_index.clear();
    let items = _.cloneDeep(options.value);
    let dftStyle = CssUtils.toCssStyle(props.itemStyle);
    for (let i = 0; i < items.length; i++) {
      let it = items[i];
      it.checked = isChecked(it);
      _id_index.set(it.value, i);
      //.......................................
      if (!it.type) {
        it.type = props.defaultItemType;
      }
      //.......................................
      if (it.type) {
        it.className = CssUtils.mergeClassName(
          {},
          it.className,
          `item-r-${props.itemRadius ?? 's'}`,
          `is-${it.type}`
        );
      }
      //.......................................
      if (!it.style) {
        it.style = dftStyle;
      }
      if (it.checked) {
        it.className = CssUtils.mergeClassName({}, it.className, {
          'is-checked': it.checked,
        });
      }
    }
    return items;
  }
  //-----------------------------------------------------
  const DisplayItems = computed(() => _build_display_items());
  //-----------------------------------------------------
  function getItemByIndex(index: number): OptionDisplayItem | undefined {
    return _.nth(DisplayItems.value, index);
  }
  //-----------------------------------------------------
  function getItemById(id: TableRowID): OptionDisplayItem | undefined {
    let index = _id_index.get(id);
    if (_.isNil(index)) {
      return;
    }
    return _.nth(DisplayItems.value, index);
  }
  //-----------------------------------------------------
  const SwitcherValueInArray = computed(() => {
    if (_.isNil(props.value)) {
      return [];
    }
    if (_.isArray(props.value)) {
      return props.value;
    }
    return [props.value];
  });
  //-----------------------------------------------------
  const SwitcherValue = computed(() => {
    if (props.multi) {
      return SwitcherValueInArray.value;
    }
    return _.first(SwitcherValueInArray.value);
  });
  //-----------------------------------------------------
  const SwitcherCheckedIds = computed(() => {
    let vals = _.concat(SwitcherValueInArray.value);
    return Util.arrayToMap(vals);
  });
  //-----------------------------------------------------
  const selectable = computed(() =>
    useSelectable<TableRowID>(
      {
        getId: 'value',
        multi: props.multi,
        checkedIds: SwitcherCheckedIds.value,
        canSelect: props.readonly ? false : true,
        showChecker: props.readonly ? false : true,
        minChecked: props.minChecked,
        maxChecked: props.maxChecked,
      },
      {
        getItem: (id: TableRowID) => {
          let it = getItemById(id);
          if (!it) {
            return;
          }
          return {
            id: it.value,
            rawData: it,
            index: it.index,
          };
        },
      }
    )
  );
  //-----------------------------------------------------
  async function loadOptions() {
    //console.log('loadOptions');
    let dict = _sw_options.value.dict;
    let list = [] as OptionDisplayItem[];
    let ids = [] as TableRowID[];
    let items = await dict?.getData();
    if (items) {
      for (let i = 0; i < items.length; i++) {
        let item = items[i];
        let it = {
          ...dict!.toStdItem(item).toOptionItem(),
          index: i,
        } as OptionDisplayItem;
        //.......................................
        _.assign(it, _.pick(item, 'style', 'className', 'type'));
        //.......................................
        list.push(it);
        ids.push(it.value);
        //.......................................
      }
    }
    options.value = list;
    //selection.ids = ids;
    updateSelection(props.value);
  }
  //-----------------------------------------------------
  function isChecked(it: OptionDisplayItem) {
    return selectable.value.isIDChecked(selection, it.value);
  }
  //-----------------------------------------------------
  function onSelect(itemId: TableRowID, event?: Event) {
    if (props.readonly) {
      return;
    }
    //console.log('onSelect', itemId);
    let se: KeyboardStatus = { ctrlKey: true };
    // 多选
    if (props.multi) {
      if (event) {
        se = EventUtils.getKeyboardStatus(event);
        // 如果按了 ctrlKey，相当于单选
        if (se.ctrlKey || se.metaKey) {
          se = {};
        }
        // 多选，默认相当于按 toggle
        else if (!se.shiftKey) {
          se.ctrlKey = true;
        }
      }
      selectable.value.select(selection, itemId, se);
      // 通知改动
      let vals = Util.mapTruthyKeys(selection.checkedIds);
      if (!_.isEqual(vals, props.value)) {
        emit('change', vals);
      }
    }
    // 单选
    else {
      // 取消
      if (selection.currentId == itemId) {
        selectable.value.toggleId(selection, itemId);
      }
      // 选择
      else {
        selectable.value.selectId(selection, itemId);
      }
      // 通知改动
      let val = selection.currentId;
      if (!_.isEqual(val, props.value)) {
        emit('change', val ?? null);
      }
    }
  }
  //-----------------------------------------------------
  function updateSelection(value?: TableRowID | TableRowID[]) {
    //console.log('updateSelection', _.cloneDeep(value));
    if (_.isNil(value)) {
      selectable.value.updateSelection(selection, options.value, null, {});
    }
    // 多选
    else if (props.multi) {
      let currentId = null;
      let checkedIds = new Map<TableRowID, boolean>();
      if (!_.isNil(value)) {
        if (_.isArray(value)) {
          currentId = _.first(value);
          checkedIds = Util.arrayToMap(value);
        } else {
          currentId = value;
          checkedIds.set(value, true);
        }
      }
      //console.log(' --', currentId, checkedIds);
      selectable.value.updateSelection(
        selection,
        options.value,
        currentId,
        checkedIds
      );
    }
    // 单选
    else {
      let currentId = null;
      let checkedIds = new Map<TableRowID, boolean>();
      if (!_.isNil(value)) {
        if (_.isArray(value)) {
          currentId = _.first(value);
        } else {
          currentId = value;
        }
        if (!_.isNil(currentId)) {
          checkedIds.set(currentId as TableRowID, true);
        }
      }
      selectable.value.updateSelection(
        selection,
        options.value,
        currentId,
        checkedIds
      );
    }
  }
  //-----------------------------------------------------
  // 输出特性
  //-----------------------------------------------------
  return {
    options,
    DisplayItems,
    getItemByIndex,
    getItemById,

    SwitcherValueInArray,
    SwitcherValue,
    SwitcherCheckedIds,
    selection,
    loadOptions,
    onSelect,
    updateSelection,
  };
}
