import { ComputedRef, ref } from 'vue';
import { Callback, Rect } from '../../../_type';
import { Rects } from '../../../core';
//--------------------------------------------------
//--------------------------------------------------
export type ValueTipBoxProps = {
  getElement: () => HTMLElement | undefined;
  _tip_box_display: ComputedRef<boolean>;
  onMounted?:Callback;
  onUnmounted?:Callback;
};
//--------------------------------------------------
//--------------------------------------------------
export function useValueTipBox(props: ValueTipBoxProps) {
  const _box_rect = ref<Rect>();
  //------------------------------------------------
  function updateBoxRect() {
    let $el = props.getElement();
    if (!$el) {
      return;
    }
    _box_rect.value = Rects.createBy($el);
  }
  //------------------------------------------------
  
  //------------------------------------------------
}
