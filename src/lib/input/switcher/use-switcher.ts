import _ from 'lodash';
import { computed, reactive, ref } from 'vue';
import {
  AnyOptionItem,
  CssUtils,
  EventUtils,
  LogicType,
  TableRowID,
  Util,
  Vars,
} from '../../../core';
import { SelectableState, useOptions, useSelectable } from '../../../lib';
import { SwitcherProps } from './ti-switcher-types';

export type OptionDisplayItem = AnyOptionItem & {
  type?: LogicType;
  className?: any;
  style?: Vars;
  checked?: boolean;
};

export function useSwitcher(
  selection: SelectableState<TableRowID>,
  props: SwitcherProps
) {
  const { dict } = useOptions({
    options: props.options,
    dictVars: props.dictVars,
    mustInOptions: true,
  });
  const options = ref<OptionDisplayItem[]>([]);

  function getDisplayItems() {
    console.log('getDisplayItems');
    let items = _.cloneDeep(options.value);
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

  const selectable = computed(() =>
    useSelectable<any>({
      data: options.value,
      getId: 'value',
      multi: props.multi,
      checkedIds: SwitcherCheckedIds.value,
      canSelect: true,
      canCheck: true,
    })
  );

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
    selection.ids = ids;
  }

  function isChecked(it: OptionDisplayItem) {
    if ('cow' == it.value) {
      console.log('isChecked', it, selectable.value.isIDChecked(it.value));
    }
    return selectable.value.isIDChecked(selection, it.value);
  }

  function onSelect(it: OptionDisplayItem, event: Event) {
    console.log('onSelect', it);
    if (props.multi) {
      let se = EventUtils.getKeyboardStatus(event);
      selectable.value.select(selection, it, se);
    } else {
      selectable.value.selectId(selection, it.value);
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
  };
}
