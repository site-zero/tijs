import { I18n, usePlaceholder, useReadonly } from "@site0/tijs";
import _ from "lodash";
import { computed, ref } from "vue";
import { evalPasswdStrength } from "./support";
import {
  InputPasswordEmitter,
  InputPasswordProps,
} from "./ti-input-password-types";
import { COM_TYPES } from "../../lib-com-types";

export type TiInputPasswordApi = ReturnType<typeof useTiInputPasswordApi>;

type InputPasswordSetup = {
  emit: InputPasswordEmitter;
  getInputElement: () => HTMLInputElement | null;
};

export function useTiInputPasswordApi(
  props: InputPasswordProps,
  setup: InputPasswordSetup
) {
  const { emit, getInputElement } = setup;
  //-----------------------------------------------------
  // 数据模型
  //-----------------------------------------------------
  const _focused = ref<boolean>(false);
  /**
   * 是否以明文显示密码
   */
  const _revealed = ref(false);

  //-----------------------------------------------------
  // 计算属性
  //-----------------------------------------------------
  /**
   * 根据 `props.value` 作为输入，计算密码强度:
   * @return 密码强度值
   * - `0` : 空密码
   * - `1` : 密码很弱
   * - `2` : 密码比较弱
   * - `3` : 密码一般
   * - `4` : 密码比较强
   * - `5` : 密码很强
   */
  const PasswdLevel = computed((): number => {
    return evalPasswdStrength(props.value, props.weakSize);
  });
  //-----------------------------------------------------
  const isRevealed = computed(() => _revealed.value);
  const isFocused = computed(() => _focused.value);
  //-----------------------------------------------------
  const _readonly = computed(() => useReadonly(props));
  const isReadonly = computed(() => _readonly.value.isReadonly(props.value));
  //-----------------------------------------------------
  const Placeholder = computed(() => usePlaceholder(props));
  //-----------------------------------------------------
  const hasValue = computed(() => !_.isNil(props.value) && props.value !== "");
  //-----------------------------------------------------
  /**
   * 输入框类型：明文 / 密文
   */
  const InputType = computed(() => (_revealed.value ? "text" : "password"));
  //-----------------------------------------------------
  function getLevelText(lvl: number) {
    let com_name = _.kebabCase(COM_TYPES.InputPassword);
    return I18n.get(`${com_name}-lvl${lvl}`) || "";
  }
  //-----------------------------------------------------
  // 操作函数
  //-----------------------------------------------------
  /**
   * 切换密码显示/隐藏
   */
  function toggleVisible() {
    if (isReadonly.value) return;
    _revealed.value = !_revealed.value;
  }
  //-----------------------------------------------------
  function setFocused(focused: boolean) {
    if (isReadonly.value) {
      return;
    }
    if (focused && _focused.value) return;
    _focused.value = focused;
    if (!focused) {
      return;
    }
    // 自动聚焦
    let $input = getInputElement();
    if (!$input) {
      return;
    }
    $input.focus();
    if (props.autoSelect) {
      $input.select();
    }
  }
  //-----------------------------------------------------
  // 数据改动
  //-----------------------------------------------------
  function onInput(evt: Event) {
    let $t = evt.target as HTMLInputElement;
    tryNotifyChange($t.value);
  }
  //-----------------------------------------------------
  function tryNotifyChange(val: string) {
    let v2 = val;
    // 空字符串视为 null
    if (v2 === "") {
      v2 = null as any;
    }
    if (v2 !== props.value) {
      emit("change", v2 as string | null);
    }
  }

  //-----------------------------------------------------
  // 返回接口
  //-----------------------------------------------------
  return {
    // 计算属性
    PasswdLevel,
    isRevealed,
    isFocused,
    isReadonly,
    Placeholder,
    hasValue,
    InputType,
    getLevelText,
    // 操作函数
    toggleVisible,
    setFocused,
    // 数据改动
    onInput,
    tryNotifyChange,
  };
}
