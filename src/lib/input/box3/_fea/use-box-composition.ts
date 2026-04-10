import { ref } from "vue";
import {
  BoxCompositionProps,
  BoxCompositionSetup,
} from "./types-box-composition";

const debug = true;

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
  const _last_down_key = ref<string>("");

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
    if (debug) console.log("onKeyUp", event.key);
    __update_value(event.target as HTMLInputElement);
  }

  function onBeforeInput(event: InputEvent) {
    let $input = event.target as HTMLInputElement;
    // 回退或者删除，并不会导致查询
    if (!/^Backspace|Delete$/.test(_last_down_key.value)) {
      _will_gen_input_key.value = event.data ? true : false;
    }
    if (debug)
      console.log(
        `onBeforeInput: data=${event.data}, value=${$input.value}, __=${_will_gen_input_key.value}`
      );
  }

  async function onKeyDown(event: KeyboardEvent) {
    if (debug) console.log("onKeyDown", event.key);
    // 默认设置为 false，当有可打印字符的时候， onBeforeInput 会被调用
    _will_gen_input_key.value = false;
    _last_down_key.value = event.key;
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
    if (debug) console.log(`__update_value: onChange('${value}')`);
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
