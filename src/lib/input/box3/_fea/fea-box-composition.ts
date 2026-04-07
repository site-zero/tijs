import { ref } from "vue";
import {
  BoxCompositionProps,
  BoxCompositionSetup,
} from "./types-box-composition";

export function useBoxComposition(
  props: BoxCompositionProps,
  options: BoxCompositionSetup
) {
  let { onChange } = options;
  const _compositing = ref(false);
  const _keypress = {
    key: "", // 按键的值 ArrowUp|ArrowDown|Escape|Enter...
    pressAt: 0, // 按键的时间戳
  };

  function onKeyPress(event: KeyboardEvent) {
    _keypress.key = event.key;
    _keypress.pressAt = Date.now();
  }

  function onStart() {
    _compositing.value = true;
  }

  function onEnd(payload: CompositionEvent) {
    _compositing.value = false;
    __update_value(payload.target as HTMLInputElement);
  }

  function onKeyUp(event: KeyboardEvent) {
    // 防守
    if (_compositing.value) {
      return;
    }
    __update_value(event.target as HTMLInputElement);
  }

  function __update_value($input: HTMLInputElement) {
    if (!props.canInput) {
      return;
    }
    // 只读防守
    if (options.isReadonly()) {
      return;
    }
    if (_compositing.value) {
      return;
    }

    // 更新值
    let value = $input.value;
    onChange(value);
  }

  return {
    _compositing,
    onKeyPress,
    onStart,
    onEnd,
    onKeyUp,
  };
}
