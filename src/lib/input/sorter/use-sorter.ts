import _ from 'lodash';
import { computed, ref } from 'vue';
import { Dicts, IconInput } from '../../../core';
import { openAppModal, useOptions } from '../../../lib';
import { SorterProps, SorterValue } from './ti-sorter-types';

export type SorterItem = {
  name: string;
  text: string;
  // 1:ASC; -1:DESC
  value: number;
  sortIcon: IconInput;
  className?: any;
};

export function useSorter(props: SorterProps) {
  let { dict } = useOptions({ options: props.options });
  let options = ref<Dicts.DictItem<string>[]>();
  let sorterIcons = props.sorterIcons ?? {
    ASC: 'fas-arrow-down-short-wide',
    DESC: 'fas-arrow-up-wide-short',
  };

  async function loadOptions() {
    options.value = await dict?.getStdData();
  }

  const OptionsMap = computed(() => {
    let map = new Map<string, string>();
    if (options.value) {
      for (let it of options.value) {
        map.set(it.value, it.text);
      }
    }
    return map;
  });

  const SorterItems = computed(() => {
    let items = [] as SorterItem[];
    if (props.value) {
      for (let key of _.keys(props.value)) {
        let text = OptionsMap.value.get(key) || key;
        let value = props.value[key];
        items.push({
          name: key,
          text,
          value,
          sortIcon: value > 0 ? sorterIcons.ASC : sorterIcons.DESC,
          className: `is-${props.colorType ?? 'track'}`,
        });
      }
    }
    return items;
  });

  const isEmpty = computed(() => _.isEmpty(SorterItems.value));

  function removeValue(it: SorterItem) {
    let re = _.clone(props.value || {});
    return _.omit(re, it.name);
  }

  function toggleValue(it: SorterItem) {
    let re = _.clone(props.value || {});
    let k = it.name;
    let v = re[k];
    re[k] = v > 0 ? -1 : 1;
    return re;
  }

  async function onSetup(): Promise<SorterValue | undefined> {
    if (!props.canSetup) {
      return;
    }
    let vals = _.keys(props.value ?? {});
    let re = await openAppModal({
      title: 'i18n:ti-sorter-choose',
      type: 'info',
      position: 'top',
      width: '640px',
      height: '80%',
      clickMaskToClose: true,
      result: vals,
      comType: 'TiTransfer',
      comConf: {
        options: options.value,
      },
    });
    // 用户取消
    if (!re) {
      return;
    }
    // 返回值
    let vmap = props.value ?? {};
    let rev = {} as SorterValue;
    for (let k of re) {
      rev[k] = vmap[k] ?? 1;
    }
    return rev;
  }

  if (props.exportApi) {
    props.exportApi({ onSetup });
  }

  return {
    loadOptions,
    OptionsMap,
    SorterItems,
    isEmpty,
    removeValue,
    toggleValue,
    onSetup,
  };
}
