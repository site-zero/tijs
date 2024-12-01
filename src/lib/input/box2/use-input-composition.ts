import { ref } from 'vue';

export type InputCompositionOptions = {
  onChange: (value: string) => void;
};

export function useInputComposition(options: InputCompositionOptions) {
  let { onChange } = options;
  const _compositing = ref(false);

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
    console.log('onUpdate', `'${$input.value}'`);
    if (_compositing.value) {
      return;
    }
    let value = $input.value;
    onChange(value);
  }

  return {
    _compositing,
    onStart,
    onEnd,
    onKeyUp,
  };
}
