import { ref } from "vue";
import {
  BoxCompositionProps,
  BoxCompositionSetup,
} from "./types-box-composition";

export function useBoxComposition(
  props: BoxCompositionProps,
  options: BoxCompositionSetup
) {
  let { isReadonly, onChange, funcKeys } = options;
  const _compositing = ref(false);
  /**
   * 标记了有功能按键被按下，这样在 onKeyUp 的时候就不要触发 onChange 了
   * 通常 ArrowUp|ArrowDown|Escape|Enter|Tab... 这些键被按下，会做这个标记
   */
  const _will_gen_input_key = ref(false);

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
    //console.log("onKeyDown", event.key);
    __update_value(event.target as HTMLInputElement);
  }

  function onBeforeInput(event: InputEvent) {
    //console.error("onBeforeInput", event.data);
    _will_gen_input_key.value = event.data ? true : false;
  }

  async function onKeyDown(event: KeyboardEvent) {
    //console.log("onKeyDown", event.key);
    // 默认设置为 false，当有可打印字符的时候， onBeforeInput 会被调用
    _will_gen_input_key.value = false;
    let hdl = funcKeys[event.key];
    if (hdl) {
      await hdl();
    }
  }

  function __update_value($input: HTMLInputElement) {
    if (!props.canInput) {
      return;
    }
    // 只读防守
    if (isReadonly()) {
      return;
    }
    if (_compositing.value) {
      return;
    }
    if (!_will_gen_input_key.value) {
      return;
    }

    // 更新值
    let value = $input.value;
    onChange(value);
  }

  return {
    _compositing,
    onStart,
    onEnd,
    onBeforeInput,
    onKeyUp,
    onKeyDown,
  };
}
