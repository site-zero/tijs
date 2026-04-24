import {
  AnyOptionItem,
  Convertor,
  PickDisplayText,
  Str,
  Vars,
} from "@site0/tijs";
import _ from "lodash";

export type BoxDisplayTextSetup = {
  lastHint: string | undefined | null;
  toOptionItem?: Convertor<Vars | null | undefined, AnyOptionItem | null>;
  boxItem: Vars | undefined | null;
  isOptionsDataShow: boolean;
  pickDisplayText: PickDisplayText;
  InputStrValue: string | undefined | null;
  useTextWhenFocus: boolean;
};

export function getBoxDisplayText(props: BoxDisplayTextSetup) {
  const {
    lastHint,
    toOptionItem,
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
  if (toOptionItem && boxItem) {
    // 如果聚焦了输入框，指明显示裸值，就显示裸值
    if (isOptionsDataShow && !useTextWhenFocus) {
      let std = toOptionItem(boxItem);
      if (std) {
        return Str.anyToStr(std.value);
      }
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
