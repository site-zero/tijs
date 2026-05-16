import { computed, ref } from "vue";
import {
  BoxCompositionProps,
  BoxCompositionSetup,
} from "./types-box-composition";

const debug = false;

export type BoxCompositionApi = ReturnType<typeof useBoxComposition>;

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
  const _will_change_input = ref(false);
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
    // 回退或者删除，要导致查询
    if (/^Backspace|Delete$/.test(_last_down_key.value)) {
      _will_change_input.value = true;
    }
    // Tab 会失焦，不要查询
    else if (/^Tab$/.test(_last_down_key.value)) {
      _will_change_input.value = false;
    }
    // 有实质内容才会导致查询，因此 Enter 等按钮将会被无视
    else {
      _will_change_input.value = event.data ? true : false;
    }
    if (debug)
      console.log(
        `onBeforeInput:`,
        `data=${event.data}`,
        `value=${$input.value}`,
        `_will_change_input=${_will_change_input.value}`,
        `_last_down_key=${_last_down_key.value}`
      );
  }

  async function onKeyDown(event: KeyboardEvent) {
    if (debug) console.log("onKeyDown", event.key);
    // 默认设置为 false，当有可打印字符的时候， onBeforeInput 会被调用
    _will_change_input.value = false;
    _last_down_key.value = event.key;
    if (funcKeys) {
      let hdl = funcKeys[event.key];
      if (hdl) {
        await hdl();
      }
    }
  }

  function __update_value($input: HTMLInputElement) {
    if (debug)
      console.log(
        `__update_value:`,
        `canInput=${props.canInput}`,
        `isReadonly=${isReadonly()}`,
        `_compositing=${_compositing.value}`,
        `_will_change_input=${_will_change_input.value}`
      );
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
    if (!_will_change_input.value) {
      return;
    }

    // 更新值
    let value = $input.value;
    if (debug) console.log(`__update_value: onChange('${value}')`);
    onChange(value);
  }

  return {
    isCompositing: computed(() => _compositing.value),
    willChangeInput: computed(() => _will_change_input.value),
    LastDownKey: computed(() => _last_down_key.value),
    onStart,
    onEnd,
    onBeforeInput,
    onKeyUp,
    onKeyDown,
  };
}
