import { nextTick, Ref } from 'vue';
import { InputBoxProps, InputBoxState } from './ti-input-types';

export function useInputAutoSelect(
  props: InputBoxProps,
  $input: Ref<HTMLInputElement | undefined>,
  _box_state: InputBoxState
) {
  if (!props.autoSelect) {
    return () => {};
  }
  return () => {
    if ($input.value) {
      // 下一个时间片，Vue 会自动更新 Input.value
      nextTick(() => {
        if ($input.value) {
          $input.value.select();
        }
      });
    }
  };
}
