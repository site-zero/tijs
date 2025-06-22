import _ from "lodash";
import { computed, ref } from "vue";
import { Str } from "../../../core";

export type CoolingKeyMatcher = (key: string) => boolean;

export type InputCompositionCooling = {
  key: string[] | string | CoolingKeyMatcher;
  cooling: number;
};

type InnerCooling = {
  matchKey: CoolingKeyMatcher;
  cooling: number;
};

export type InputCompositionOptions = {
  isReadonly: () => boolean;
  onChange: (value: string) => void;
  /**
   * 声明了这个选项，相当说，在某个键按下后一段时间不响应 __update_value
   * 默认的是
   * ```
   * [{keys: 'Escape|Enter', cooling: 300}]
   * ```
   * 表示按下 Escape 或者 Enter 键后，300ms 内不响应 __update_value
   */
  waitCooling?: InputCompositionCooling[];
};

export function useInputComposition(options: InputCompositionOptions) {
  let { onChange } = options;
  const _compositing = ref(false);
  const _keypress = {
    key: "", // 按键的值 ArrowUp|ArrowDown|Escape|Enter...
    pressAt: 0, // 按键的时间戳
  };

  /**
   * 计算冷却配置的计算属性。
   *
   * 该计算属性根据 `options.waitCooling` 配置生成一个 `InnerCooling` 数组。
   * 每个 `InnerCooling` 对象包含一个 `matchKey` 函数和一个 `cooling` 时间。
   *
   * `options.waitCooling` 可以包含以下两种形式的 `key`：
   * 1. 自定义匹配方法：如果 `key` 是一个函数，则直接使用该函数作为 `matchKey`。
   * 2. 指定的键：如果 `key` 是一个字符串或字符串数组，则生成一个匹配函数，该函数会检查给定的键是否在指定的键列表中。
   *
   * @returns {InnerCooling[]} 返回包含冷却配置的数组。
   */
  const _cooling = computed(() => {
    let re: InnerCooling[] = [];
    let _input = options.waitCooling || [
      { key: "Escape|Enter|Escape", cooling: 300 },
      { key: (k) => /^Arrow/.test(k), cooling: 300 },
    ];
    for (let _in of _input) {
      // 定制了匹配方法
      if (_.isFunction(_in.key)) {
        re.push({
          matchKey: _in.key,
          cooling: _in.cooling,
        });
      }
      // 指定了 key
      else {
        let ks: string[];
        if (_.isString(_in.key)) {
          ks = Str.splitIgnoreBlank(_in.key, /[|,; ]/g);
        } else {
          ks = _in.key;
        }
        re.push({
          matchKey: (key: string) => {
            return ks.indexOf(key) >= 0;
          },
          cooling: _in.cooling,
        });
      }
    }
    return re;
  });

  function _find_cooling(key: string) {
    for (let _c of _cooling.value) {
      if (_c.matchKey(key)) {
        return _c.cooling;
      }
    }
    return 0;
  }

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
    // 只读防守
    if (options.isReadonly()) {
      return;
    }
    if (_compositing.value) {
      return;
    }
    // 看看是否是需要冷却的按键
    let cooling = _find_cooling(_keypress.key);
    if (cooling > 0) {
      let passed = Date.now() - _keypress.pressAt;
      if (passed < cooling) {
        return;
      }
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
