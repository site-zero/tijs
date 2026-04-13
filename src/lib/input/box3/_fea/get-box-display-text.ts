import { PickDisplayText, Str, Vars } from "@site0/tijs";
import _ from "lodash";
import { BoxOptionsDataApi } from "./use-box-options-data";

export type BoxDisplayTextSetup = {
  lastHint: string | undefined | null;
  boxOptions: BoxOptionsDataApi | undefined;
  boxItem: Vars | undefined | null;
  isOptionsDataShow: boolean;
  useTextWhenFocus: boolean;
  pickDisplayText: PickDisplayText;
  InputStrValue: string | undefined | null;
};

export function getBoxDisplayText(props: BoxDisplayTextSetup) {
  const {
    lastHint,
    boxOptions,
    boxItem,
    isOptionsDataShow,
    useTextWhenFocus,
    pickDisplayText,
    InputStrValue,
  } = props;
  // 明确的记录了 lastHint
  if (!_.isNil(lastHint)) {
    return lastHint;
  }

  // 尝试采用选择的 Item
  if (boxOptions && boxItem) {
    // 如果聚焦了输入框，指明显示裸值，就显示裸值
    if (isOptionsDataShow && !useTextWhenFocus) {
      let std = boxOptions.toOptionItem(boxItem);
      return Str.anyToStr(std.value);
    }
    // 否则翻译显示值
    return pickDisplayText(boxItem);
  }

  // 空值，一定归一化为空串
  if (_.isNil(InputStrValue)) {
    return "";
  }

  // 直接显示值
  return InputStrValue;
}
