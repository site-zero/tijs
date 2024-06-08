import { StdOptionItem, Vars, getLogger } from '../../../core';
import { Ref, computed } from 'vue';
import { ListProps, TableRowID } from '../../../lib';
import { useOptions, useStdListItem } from '../../../lib/_features';
import { TransferProps, TransferState } from './ti-transfer-types';
import _ from 'lodash';

const log = getLogger('ti-use-transfer');

export function useTransfer(state: TransferState, props: TransferProps) {
  let { dict } = useOptions(props);
  let { toStdItems } = useStdListItem(props);

  function getListConfig(): ListProps {
    return {
      getIcon: props.getIcon,
      getText: props.getText,
      getTip: props.getTip,
      getId: props.getValue,
    };
  }

  async function reloadOptions(force?: boolean): Promise<void> {
    if (!dict) {
      log.warn('NOT dict, unable to relodOptons!');
      state.options = [];
    } else {
      let list = await dict.getData(force);
      state.options = toStdItems(list);
    }
  }

  async function queryOptions(input: any): Promise<void> {
    if (!dict) {
      state.options = [];
    } else {
      let list = await dict.queryData(input);
      state.options = toStdItems(list);
    }
  }

  const valueSet = new Set<TableRowID>();
  if (props.value) {
    for (let v of props.value) {
      valueSet.add(v);
    }
  }

  function getCandidateList(): StdOptionItem[] {
    let list = [] as StdOptionItem[];
    for (let li of state.options) {
      if (!valueSet.has(li.value)) {
        list.push(_.cloneDeep(li));
      }
    }
    return list;
  }

  async function loadSelectedList(list: Ref<StdOptionItem[]>) {
    let re = [] as StdOptionItem[];
    if (props.value && dict) {
      let loading = [] as Promise<void>[];
      for (let v of props.value) {
        loading.push(
          new Promise<void>((resolve) => {
            dict!.getStdItem(v).then((it) => {
              let std = it?.toOptionItem();
              if (std) {
                re.push(std);
              } else {
                re.push({ value: v });
              }
              resolve();
            });
          })
        );
      }
      await Promise.all(loading);
    }
    list.value = re;
  }

  return {
    getListConfig,
    valueSet,
    reloadOptions,
    queryOptions,
    getCandidateList,
    loadSelectedList,
  };
}
