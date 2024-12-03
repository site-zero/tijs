import _ from 'lodash';
import { Ref } from 'vue';
import { Vars } from '../../../_type';
import { Dicts } from '../../../core';
import { ValueInputTidyMode } from '../../_features';
import {
  InputBoxState,
  OptionPredicater,
  TipBoxShowTime,
} from './ti-input-types';

export type LoadTipListOptions = {
  box: InputBoxState;
  tipShowTime: TipBoxShowTime;
  dict?: Dicts.TiDict;
  tipUseHint: boolean;
  tipTidyBy: ValueInputTidyMode[];
  tidyValue: (val: any, mode?: ValueInputTidyMode[]) => Promise<any>;
  isVisible: OptionPredicater;
  tipItemKeepRaw?: boolean;
  cookValHint: (val: any) => string | undefined;
};

export function resetTipList(
  box: InputBoxState,
  tips: Ref<Vars[] | undefined>,
  _trace?: string
) {
  //console.log('========= resetTipList:', trace);
  box.lastUpdateAMS = 0;
  if (box.lastAbort) {
    try {
      box.lastAbort.abort('Reset TipList');
    } catch (_err) {}
    box.lastAbort = undefined;
  }
  tips.value = undefined;
}

export async function updateTipList(
  hint: string,
  tips: Ref<Vars[] | undefined>,
  options: LoadTipListOptions
) {
  let {
    dict,
    box,
    tipShowTime,
    tipUseHint,
    tipTidyBy,
    tidyValue,
    isVisible,
    tipItemKeepRaw,
    cookValHint,
  } = options;

  let { boxValue, boxInputing, boxFocused, keyboard, lastUpdateAMS } = box;

  // 解决重入问题
  let du = Date.now() - lastUpdateAMS;
  if (du < 10) {
    return;
  }
  //console.log('  // 是否满足显示时机:', tipShowTime);
  // 是否满足显示时机
  if (!boxFocused) {
    resetTipList(
      box,
      tips,
      `use-inputbox.ts#updateTipList[hint=${hint}]: 1.!boxFocused`
    );
    return;
  }
  if (tipShowTime == 'keyin') {
    if (!keyboard) {
      resetTipList(
        box,
        tips,
        `use-inputbox.ts#updateTipList[hint=${hint}]: tipShowTime == 'keyin'`
      );
      return;
    }
  }
  if (tipShowTime == 'input') {
    if (!boxInputing || boxValue == boxInputing) {
      resetTipList(
        box,
        tips,
        `use-inputbox.ts#updateTipList[hint=${hint}]: tipShowTime == 'input'`
      );
      return;
    }
  }
  // 是否满足隐藏时机

  // 取消上一次的请求
  if (box.lastAbort) {
    try {
      box.lastAbort.abort('Cancel Last Query');
    } catch (_err) {}
    box.lastAbort = undefined;
  }

  // 建立新的请求
  box.lastUpdateAMS = Date.now();
  box.lastAbort = new AbortController();

  //console.log(dumpBoxState(box));
  // 经过检查满足时机了，需要加载
  if (tipUseHint && dict) {
    let hintVal = hint;
    // 前置处理数据
    if (tipTidyBy) {
      hintVal = await tidyValue(hint, tipTidyBy);
    }
    // 再次整理 hint
    if (cookValHint) {
      hintVal = cookValHint(hintVal) ?? hintVal;
    }
    // console.log(`dict.queryStdData('${hintVal}')`);
    dict.queryData(hintVal, box.lastAbort.signal).then((list) => {
      __set_tip_list(tips, list, isVisible, dict!, tipItemKeepRaw);
    });
  }
  // 全量查询
  else if (dict) {
    let hintVal = hint;
    if (tipTidyBy) {
      hintVal = await tidyValue(hintVal, tipTidyBy);
    }
    //console.log(`dict.queryStdData('${hintVal}')`);
    dict.queryData(box.lastAbort.signal).then((list) => {
      __set_tip_list(tips, list, isVisible, dict!, tipItemKeepRaw);
    });
  }
}

function __set_tip_list(
  tips: Ref<Vars[] | undefined>,
  list: any[],
  isVisible: OptionPredicater,
  dict: Dicts.TiDict,
  tipItemKeepRaw?: boolean
) {
  let list2 = [] as Vars[];
  for (let li of list) {
    if (isVisible(li)) {
      // 维持原样
      if (tipItemKeepRaw) {
        list2.push(_.cloneDeep(li));
      }
      // 转换为标准对象
      else {
        let item = dict.toStdItem(li).toOptionItem();
        list2.push(item);
      }
    }
  }
  tips.value = list2;
}

export function dumpBoxState(box: InputBoxState): string {
  return ` boxValue: ${box.boxValue}
    boxIcon: ${box.boxIcon}
     boxTip: ${box.boxTip}
boxInputing: ${box.boxInputing},
 boxFocused: ${box.boxFocused},
   keyboard: ${box.keyboard},
---------<${box.altKey ? 'ALT' : ''}-${box.ctrlKey ? 'CTL' : ''}-${
    box.shiftKey ? 'SHIFT' : ''
  }-${box.metaKey ? 'META' : ''}>---------
   last_ams: ${
     box.lastUpdateAMS > 0 ? new Date(box.lastUpdateAMS).toISOString() : '---'
   }
 last_abort:${box.lastAbort ? '[ABORT]' : '---'}`;
}
