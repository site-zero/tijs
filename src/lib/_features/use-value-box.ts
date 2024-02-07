import {
  CommonProps,
  FormatValueProps,
  PlaceholderFeature,
  PlaceholderFeatureProps,
  PrefixSuffixEvents,
  PrefixSuffixFeature,
  PrefixSuffixFeatureProps,
  PrefixSuffixState,
  ValueInputEvents,
  ValueInputProps,
  useFormatValue,
  usePlaceholder,
  usePrefixSuffix,
  useValueInput
} from "..";
import _ from "lodash";
import { TiEventTrigger } from "../";
import { Be, Callback, Callback1, FuncA0, Str } from "../../core";
/*-------------------------------------------------------

                     Events

-------------------------------------------------------*/
export type ValueBoxEvents = PrefixSuffixEvents | ValueInputEvents;
/*-------------------------------------------------------

                     State

-------------------------------------------------------*/
export type ValueBoxState<T extends any> = PrefixSuffixState & {
  boxVal?: T;
  boxText: string;
  boxFocused: boolean;
  boxErrMsg: string;
};
/*-------------------------------------------------------

                     Props

-------------------------------------------------------*/
export type ValueBoxProps<T extends any> = CommonProps &
  ValueInputProps &
  FormatValueProps &
  PlaceholderFeatureProps &
  PrefixSuffixFeatureProps & {
    value?: T;
    autoSelect?: boolean;
    prefixIconForClean?: boolean;
    suffixIconForCopy?: boolean;
  };
/*-------------------------------------------------------

                     Feature

-------------------------------------------------------*/
export type ValueBoxFeature = PlaceholderFeature &
  PrefixSuffixFeature & {
    //
    // 数值处理函数
    //
    /**
     * 当输入框初值改变时，需要主动调用这个函数,
     * 本函数会更新 `state.boxVal`
     */
    doUpdateValue: Callback1<any>;
    /**
     * 当用户通过界面输入了内容，需要通过这个函数更新输入框
     * 通常，本函数是做两件事:
     * 1. 修改自身的内部值（通过 doUpdateValue）
     * 2. 通知外部改动
     * 你可以通过 `ValueBoxOptions.valueChangeMode` 改变这个默认行为
     */
    doChangeValue: Callback1<string>;

    /**
     * 本函数会根据 `state.boxVal` 修改 `state.boxText`。
     * `doUpdateValue` 也会在内部调用这个函数
     */
    doUpdateText: Callback;

    //
    // 界面绑定函数
    //
    OnClickPrefixIcon: Callback;
    OnClickSuffixIcon: Callback;
    OnHoverPrefixIcon: Callback1<boolean>;
    OnHoverSuffixIcon: Callback1<boolean>;
  };
/*-------------------------------------------------------

                     Options

-------------------------------------------------------*/
export type ValueBoxOptions = {
  notify: TiEventTrigger<ValueBoxEvents, any>;
  /**
   * 当 doChangeValue 时的行为:
   * - `notify`: 通知外部改动
   * - `inner` : 修改自身的内部值（通过 doUpdateValue）
   * -`both` : 以上两者都做
   *
   * @default `both`
   */
  valueChangeMode?: "both" | "notify" | "inner";

  /**
   * 如果 suffixIconForCopy, 那么复制之后需要自动闪烁一下 box。
   * 通常这个函数返回的是顶层元素。
   *
   * 如果绘制提示框，也会用这个元素的盒子模型作为弹出提示框的参考位置
   */
  getBoxElement: FuncA0<HTMLElement>;
};
/*-----------------------------------------------------

                Use Feature
                
-----------------------------------------------------*/
export function useValueBox<T extends any>(
  state: ValueBoxState<T>,
  props: ValueBoxProps<T>,
  options: ValueBoxOptions
): ValueBoxFeature {
  let { notify, valueChangeMode = "both", getBoxElement } = options;
  let _value_change_notify = /^(both|notify)$/.test(valueChangeMode);
  let _value_change_inner = /^(both|inner)$/.test(valueChangeMode);
  //
  // 准备处理值的方法
  let { tidyValue, translateValue } = useValueInput(props);

  // 启用 format 特性
  let formatValue = useFormatValue(props);

  // 准备前后缀框
  let boxProps = _.cloneDeep(props);
  if (props.prefixIconForClean) {
    boxProps.prefixIcon = boxProps.prefixIcon || "zmdi-close";
    boxProps.prefixIconClickable = true;
  }
  if (props.suffixIconForCopy) {
    boxProps.suffixIcon = boxProps.suffixIcon || "zmdi-copy";
    boxProps.suffixIconClickable = true;
  }
  let _box = usePrefixSuffix(state, boxProps, notify);

  //
  // 方法: 更新内部值
  //
  async function doUpdateValue(input: any) {
    state.boxVal = input;
    await doUpdateText();
  }
  //
  // 方法: 更新显示文本
  //
  async function doUpdateText() {
    let val = state.boxVal;
    // 如果聚焦，则仅仅显示原始值，否则，看看是否需要格式化
    if (state.boxFocused) {
      state.boxText = Str.anyToStr(val);
    }
    // 看看是否需要格式化
    else {
      let text = await translateValue(val);
      state.boxText = formatValue(text);
    }
  }
  //
  // 方法: 值发生了改变
  //
  async function doChangeValue(val: string) {
    if (_value_change_inner) {
      await doUpdateValue(val);
    }
    if (_value_change_notify) {
      console.log("_value_change_notify");
      let v = await tidyValue(val);
      notify("change", v);
    }
  }
  //
  // 方法： 点击前缀按钮
  //
  async function OnClickPrefixIcon() {
    console.log("OnClickPrefixIcon");
    if (props.prefixIconForClean) {
      await doChangeValue("");
    }
    // 默认行为
    else {
      _box.Prefix.OnClickIcon();
    }
  }

  //
  // 方法： 点击后缀按钮
  //
  function OnClickSuffixIcon() {
    console.log("OnClickSuffixIcon");
    if (props.suffixIconForCopy) {
      Be.Clipboard.write(state.boxVal);
      Be.BlinkIt(getBoxElement());
    }
    // 默认行为
    else {
      _box.Suffix.OnClickIcon();
    }
  }

  //
  // 初始化值
  //
  state.boxVal = props.value;
  doUpdateText();
  //
  // 输出特性
  return {
    ..._box,
    ...usePlaceholder(props),
    doUpdateValue,
    doChangeValue,
    doUpdateText,
    OnClickPrefixIcon,
    OnClickSuffixIcon,
    OnHoverPrefixIcon(hovered: boolean) {
      state.prefixIconHovered = hovered;
    },
    OnHoverSuffixIcon(hovered: boolean) {
      state.suffixIconHovered = hovered;
    }
  };
}
