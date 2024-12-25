import { computed } from 'vue';
import { Str, TiDict } from '../../../core';
import { useDisplayText } from '../../_features';
import { LabelEmitter, LabelProps, LabelState } from './ti-label-types';

export type LabelOptions = {
  _state: LabelState;
  _pipe?: (val: any) => any;
  _dict?: TiDict;
  getElement: () => HTMLElement;
  emit: LabelEmitter;
};

export function useLabel(props: LabelProps, options: LabelOptions) {
  let { _state, _pipe, _dict, getElement } = options;
  //--------------------------------------------------
  const RawValue = computed(() => Str.anyToStr(props.value));
  //--------------------------------------------------
  const getDisplay = useDisplayText(props);
  //--------------------------------------------------
  let lastAbort: AbortController | null = null;
  const ABORT_REASON = 'abort-labe-dict-item-reload';
  //--------------------------------------------------
  async function updateDisplay() {
    if (lastAbort) {
      lastAbort.abort({ abort: true, reason: ABORT_REASON });
      lastAbort = null;
    }

    let v0 = props.value;
    let v1 = _pipe ? _pipe(v0) : v0;

    if (_dict) {
      lastAbort = new AbortController();
      let item = await _dict.getStdItem(v1, lastAbort.signal);
      if (item) {
        _state.icon = item.icon;
        _state.text = getDisplay(item.toOptionItem());
        _state.tip = undefined;
      }
      // 采用裸值
      else {
        _state.icon = undefined;
        _state.text = Str.anyToStr(v1);
        _state.tip = undefined;
      }
    }
  }
  //--------------------------------------------------
  return {
    getElement,
    RawValue,
    DisplayValue: computed(() => _state.text ?? ''),
    updateDisplay,
  };
}
