import { Ref } from 'vue';
import { Dicts, Vars } from '../../../core';
import { ValueInputTidyMode } from '../../_features';
import {
  InputBoxState,
  TipBoxHideTime,
  TipBoxShowTime,
} from './ti-input-types';

export type LoadTipListOptions = {
  box: InputBoxState;
  tipShowTime: TipBoxShowTime;
  tipHideTime: TipBoxHideTime;
  dict?: Dicts.TiDict;
  tipUseHint: boolean;
  tipTidyBy: ValueInputTidyMode[];
  tidyValue: (val: any, mode?: ValueInputTidyMode[]) => Promise<any>;
};

export function resetTipList(
  box: InputBoxState,
  tips: Ref<Vars[] | undefined>
) {
  box.lastUpdateAMS = 0;
  if (box.lastAbort) {
    box.lastAbort.abort();
    box.lastAbort = undefined;
  }
  tips.value = undefined;
}

export async function updateTipList(
  hint: string,
  tips: Ref<Vars[] | undefined>,
  options: LoadTipListOptions
) {
  let { dict, box, tipShowTime, tipUseHint, tipTidyBy, tidyValue } = options;
  // 未指定字典
  if (!dict) {
    return;
  }

  let { boxValue, boxInputing, boxFocused, keyboard, lastUpdateAMS } = box;

  // 解决重入问题
  let du = Date.now() - lastUpdateAMS;
  if (du < 10) {
    return;
  }

  // 是否满足显示时机
  if (!boxFocused) {
    resetTipList(box, tips);
    return;
  }
  if (tipShowTime == 'keyin') {
    if (!keyboard) {
      resetTipList(box, tips);
      return;
    }
  }
  if (tipShowTime == 'input') {
    if (boxValue == boxInputing) {
      resetTipList(box, tips);
      return;
    }
  }
  // 是否满足隐藏时机

  // 取消上一次的请求
  if (box.lastAbort) {
    box.lastAbort.abort();
    box.lastAbort = undefined;
  }

  // 建立新的请求
  box.lastUpdateAMS = Date.now();
  box.lastAbort = new AbortController();

  console.log(dumpBoxState(box));
  // 经过检查满足时机了，需要加载
  if (tipUseHint) {
    let hintVal = hint;
    if (tipTidyBy) {
      hintVal = await tidyValue(hint, tipTidyBy);
    }
    console.log(`dict.queryStdData('${hintVal}')`);
    dict.queryStdData(hintVal, box.lastAbort.signal).then((list) => {
      __set_tip_list(tips, list);
    });
  }
  // 全量查询
  else {
    let hintVal = hint;
    if (tipTidyBy) {
      hintVal = await tidyValue(hint, tipTidyBy);
    }
    console.log(`dict.queryStdData('${hintVal}')`);
    dict.queryData(box.lastAbort.signal).then((list) => {
      __set_tip_list(tips, list);
    });
  }
}

function __set_tip_list(
  tips: Ref<Vars[] | undefined>,
  list: Dicts.DictItem<any>[]
) {
  let re = [] as Vars[];
  for (let li of list) {
    re.push({
      icon: li.icon,
      text: li.text,
      tip: li.tip,
      value: li.value,
    });
  }
  tips.value = re;
}

export function dumpBoxState(box: InputBoxState): string {
  return `
boxValue   : ${box.boxValue}
boxInputing: ${box.boxInputing},
boxFocused : ${box.boxFocused},
keyboard   : ${box.keyboard},
---------<${box.altKey ? 'ALT' : ''}-${box.ctrlKey ? 'CTL' : ''}-${
    box.shiftKey ? 'SHIFT' : ''
  }-${box.metaKey ? 'META' : ''}>---------
   last_ams: ${
     box.lastUpdateAMS > 0 ? new Date(box.lastUpdateAMS).toISOString() : '---'
   }
last_abort :${box.lastAbort ? '[ABORT]' : '---'}
  `;
}
