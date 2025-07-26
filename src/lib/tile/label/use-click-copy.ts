import _ from "lodash";
import { computed } from "vue";
import { Be, Str } from "../../../core";

export type ClickCopyProps = {
  /**
   * 指定点击标签时触发复制操作所需的修饰键
   *
   * @type 可选的修饰键: 'alt' | 'ctrl' | 'shift' | 'meta'
   * @example clickForCopy: 'ctrl'
   * > `Ctrl+Click` 复制文本
   * @example clickForCopy: ['ctrl','ctrl+shift']
   * > `Ctrl+Click` 复制文本
   * > `Ctrl+Shift+Click` 复制值
   *
   */
  clickForCopy?: string | [string, string];
};

export type ClickCopyOptions = {
  getElement: () => HTMLElement | null | undefined;
  getText: () => string | undefined | null;
  getValue: () => string | undefined | null;
};

export function useClickCopy(props: ClickCopyProps, options: ClickCopyOptions) {
  let { getElement, getText, getValue } = options;

  const Mods = computed((): [string, string] => {
    if (!props.clickForCopy || _.isEmpty(props.clickForCopy)) {
      return ["", ""];
    }
    if (_.isArray(props.clickForCopy)) {
      return [
        tidyModifier(props.clickForCopy[0]),
        tidyModifier(props.clickForCopy[1]),
      ];
    }
    return [tidyModifier(props.clickForCopy), ""];
  });
  const TextMod = computed(() => Mods.value[0]);
  const ValueMod = computed(() => Mods.value[1]);

  function toModifier(event: MouseEvent) {
    return [
      event.altKey ? "alt" : "",
      event.ctrlKey ? "ctrl" : "",
      event.metaKey ? "meta" : "",
      event.shiftKey ? "shift" : "",
    ]
      .filter(Boolean)
      .join("+");
  }

  function tidyModifier(input: string) {
    if (!input) {
      return "-no-set-";
    }
    let ss = Str.splitIgnoreBlank(input.toLowerCase(), /\W+/g);
    return ss.sort().join("+");
  }

  function handleClick(event: MouseEvent) {
    let el = getElement();
    if (!el) {
      return;
    }
    let mod = toModifier(event);
    let str: string | undefined = undefined;
    if (TextMod.value == mod) {
      str = getText() || "";
    } else if (ValueMod.value == mod) {
      str = getValue() || "";
    }
    if (_.isNil(str)) {
      return;
    }

    event.stopPropagation();
    Be.Clipboard.write(str);
    Be.BlinkIt(el);
  }

  return handleClick;
}
