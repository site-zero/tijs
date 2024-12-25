import _ from 'lodash';
import { computed } from 'vue';
import { Str, TiDict, Tmpl } from '../../../core';
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
  const getDisplay = computed(() =>
    useDisplayText({
      getDisplayText: props.getDisplayText,
    })
  );
  //--------------------------------------------------
  const Href = computed(() => {
    if (!props.href || _.isNil(props.value)) {
      return;
    }
    let ctx = _.assign({}, props.vars, { value: props.value });
    if (_.isString(props.href)) {
      let tmpl = Tmpl.parse(props.href);
      return tmpl.render(ctx);
    }
    return props.href(ctx);
  });
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
        _state.text = getDisplay.value(item.toOptionItem());
        _state.tip = undefined;
      }
      // 采用裸值
      else {
        _state.icon = undefined;
        _state.text = Str.anyToStr(v1);
        _state.tip = undefined;
      }
    }
    // 采用裸值
    else {
      _state.icon = undefined;
      _state.text = Str.anyToStr(v1);
      _state.tip = undefined;
    }
  }
  //--------------------------------------------------
  return {
    getElement,
    RawValue,
    Href,
    DisplayValue: computed(() => _state.text ?? ''),
    updateDisplay,
  };
}
