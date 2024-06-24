import _ from 'lodash';
import { computed, ref } from 'vue';
import {
  AnyOptionItem,
  KeyboardStatus,
  LogicType,
  TableRowID,
  Vars,
} from '../../../_type';
import { CssUtils, EventUtils, Util } from '../../../core';
import { SelectableState, useOptions, useSelectable } from '../../../lib';
import { SwitcherProps } from './ti-switcher-types';

export type SwitcherEmitter = {
  (event: 'change', payload: null | TableRowID | TableRowID[]): void;
};

export type OptionDisplayItem = AnyOptionItem & {
  type?: LogicType;
  className?: any;
  style?: Vars;
  checked?: boolean;
};

export function useSwitcher(
  selection: SelectableState<TableRowID>,
  props: SwitcherProps,
  emit: SwitcherEmitter
) {
  const { dict } = useOptions({
    options: props.options,
    dictVars: props.dictVars,
    mustInOptions: true,
  });
  const options = ref<OptionDisplayItem[]>([]);

  function getDisplayItems() {
    let items = _.cloneDeep(options.value);
    //console.log('getDisplayItems', items.length);
    let dftStyle = CssUtils.toCssStyle(props.itemStyle);
    for (let it of items) {
      it.checked = isChecked(it);
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

  const SwitcherValueInArray = computed(() => {
    if (_.isNil(props.value)) {
      return [];
    }
    if (_.isArray(props.value)) {
      return props.value;
    }
    return [props.value];
  });

  const SwitcherValue = computed(() => {
    if (props.multi) {
      return SwitcherValueInArray.value;
    }
    return _.first(SwitcherValueInArray.value);
  });

  const SwitcherCheckedIds = computed(() => {
    let vals = _.concat(SwitcherValueInArray.value);
    return Util.arrayToMap(vals);
  });

  const selectable = useSelectable<any>({
    getId: 'value',
    multi: props.multi,
    checkedIds: SwitcherCheckedIds.value,
    canSelect: props.readonly ? false : true,
    canCheck: props.readonly ? false : true,
    minChecked: props.minChecked,
    maxChecked: props.maxChecked,
  });

  async function loadOptions() {
    let list = [] as OptionDisplayItem[];
    let ids = [] as TableRowID[];
    let items = await dict?.getData();
    if (items) {
      for (let item of items) {
        let it = {
          ...dict!.toStdItem(item).toOptionItem(),
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

  function isChecked(it: OptionDisplayItem) {
    return selectable.isIDChecked(selection, it.value);
  }

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
      selectable.select(selection, itemId, se);
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
        selectable.toggleId(selection, itemId);
      }
      // 选择
      else {
        selectable.selectId(selection, itemId);
      }
      // 通知改动
      let val = selection.currentId;
      if (!_.isEqual(val, props.value)) {
        emit('change', val ?? null);
      }
    }
  }

  function updateSelection(value?: TableRowID | TableRowID[]) {
    //console.log('updateSelection', _.cloneDeep(value));
    if (_.isNil(value)) {
      selectable.updateSelection(selection, options.value, null, {});
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
      selectable.updateSelection(
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
      selectable.updateSelection(
        selection,
        options.value,
        currentId,
        checkedIds
      );
    }
  }

  return {
    options,
    SwitcherValueInArray,
    SwitcherValue,
    SwitcherCheckedIds,
    selection,
    loadOptions,
    getDisplayItems,
    onSelect,
    updateSelection,
  };
}
