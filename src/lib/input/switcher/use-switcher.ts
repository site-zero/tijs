import _ from 'lodash';
import { computed, ref } from 'vue';
import { Util, Vars } from '../../../core';
import { useOptions, useSelectable } from '../../../lib';
import { SwitcherProps } from './ti-switcher-types';

export function useSwitcher(props: SwitcherProps) {
  const { dict } = useOptions({
    options: props.options,
    dictVars: props.dictVars,
    mustInOptions: true,
  });
  const options = ref<Vars[]>([]);

  async function loadOptions() {
    let list = [] as Vars[];
    let items = await dict?.getStdData();
    if (items) {
      for (let it of items) {
        list.push(it.toOptionItem());
      }
    }
    options.value = list;
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

  return {
    options,
    SwitcherValueInArray,
    SwitcherValue,
    SwitcherCheckedIds,
    selectable,
    loadOptions,
  };
}
