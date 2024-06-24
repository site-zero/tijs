import _ from 'lodash';
import { Ref } from 'vue';
import {
  ActionBarItem,
  IconInput,
  StdOptionItem,
  TableRowID,
} from '../../../_type';
import { Util } from '../../../core';
import { getLogger } from '../../../core/log/ti-log';
import { ListProps, RoadblockProps } from '../../../lib';
import { useOptions, useStdListItem } from '../../../lib/_features';
import { TransferProps, TransferState } from './ti-transfer-types';

const log = getLogger('ti-use-transfer');

export type TransferEmitter = {
  (event: 'change', payload: TableRowID[]): void;
};

export function useTransfer(
  state: TransferState,
  props: TransferProps,
  emit: TransferEmitter
) {
  let { dict } = useOptions(props);
  let { toStdItems } = useStdListItem(props);

  function getSelMenuItems() {
    return [
      {
        icon: 'fas-arrow-up-long',
        text: 'i18n:ti-transfer-move-up',
        enabled: { hasSelChecked: true },
        action: () => {
          let val = Util.moveCheckedById(
            props.value ?? [],
            state.sel_checked_ids,
            'prev'
          );
          if (!_.isNil(val)) {
            emit('change', val);
          }
        },
      },
      {
        icon: 'fas-arrow-down-long',
        text: 'i18n:ti-transfer-move-down',
        enabled: { hasSelChecked: true },
        action: () => {
          let val = Util.moveCheckedById(
            props.value ?? [],
            state.sel_checked_ids,
            'next'
          );
          if (!_.isNil(val)) {
            emit('change', val);
          }
        },
      },
      {
        icon: 'fas-trash-can',
        text: 'i18n:clear',
        enabled: { hasValues: true },
        action: () => {
          emit('change', []);
        },
      },
    ] as ActionBarItem[];
  }

  function getListConfig(): ListProps {
    return {
      borderStyle: 'solid',
      getIcon: props.getIcon,
      getText: props.getText,
      getTip: props.getTip,
      getId: props.getValue,
    };
  }

  function getListEmptyRoadblock(text: string, icon: IconInput) {
    return {
      text,
      icon,
      mode: 'cover',
      size: 'normal',
      layout: 'A',
    } as RoadblockProps;
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
    let fv = state.filterValue?.toUpperCase();
    for (let li of state.options) {
      if (!valueSet.has(li.value)) {
        // 过滤备选项目
        if (fv) {
          let text = li.text?.toUpperCase();
          let vals = `${li.value}`.toUpperCase();
          console.log(fv, text, vals);
          if (
            (text && text.indexOf(fv) >= 0) ||
            (vals && vals.indexOf(fv) >= 0)
          ) {
            list.push(_.cloneDeep(li));
          }
        }
        // 没有过滤
        else {
          list.push(_.cloneDeep(li));
        }
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
    getSelMenuItems,
    getListEmptyRoadblock,
    valueSet,
    reloadOptions,
    queryOptions,
    getCandidateList,
    loadSelectedList,
  };
}
