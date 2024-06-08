import { Ref } from 'vue';
import { DictItem, Dicts, TiMatch, Vars } from '../../../core';
import { ValueInputTidyMode } from '../../_features';
import { InputBoxState, TipBoxShowTime } from './ti-input-types';

export type LoadTipListOptions = {
  box: InputBoxState;
  tipShowTime: TipBoxShowTime;
  dict?: Dicts.TiDict;
  tipUseHint: boolean;
  tipTidyBy: ValueInputTidyMode[];
  tidyValue: (val: any, mode?: ValueInputTidyMode[]) => Promise<any>;
  optionFiler?: TiMatch;
};

export function resetTipList(
  box: InputBoxState,
  tips: Ref<Vars[] | undefined>
) {
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
    optionFiler,
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
    if (!boxInputing || boxValue == boxInputing) {
      resetTipList(box, tips);
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
    if (tipTidyBy) {
      hintVal = await tidyValue(hint, tipTidyBy);
    }
    // console.log(`dict.queryStdData('${hintVal}')`);
    dict.queryData(hintVal, box.lastAbort.signal).then((list) => {
      let list2 = [] as DictItem<any>[];
      if (optionFiler) {
        for (let li of list) {
          if (optionFiler.test(li)) {
            list2.push(dict!.toStdItem(li));
          }
        }
      } else {
        for (let li of list) {
          list2.push(dict!.toStdItem(li));
        }
      }
      __set_tip_list(tips, list2);
    });
  }
  // 全量查询
  else if (dict) {
    let hintVal = hint;
    if (tipTidyBy) {
      hintVal = await tidyValue(hint, tipTidyBy);
    }
    //console.log(`dict.queryStdData('${hintVal}')`);
    dict.queryData(box.lastAbort.signal).then((list) => {
      let list2 = [] as DictItem<any>[];
      if (optionFiler) {
        for (let li of list) {
          if (optionFiler.test(li)) {
            list2.push(dict!.toStdItem(li));
          }
        }
      } else {
        for (let li of list) {
          list2.push(dict!.toStdItem(li));
        }
      }
      __set_tip_list(tips, list2);
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
