import {
  BoxAspectProps,
  BoxDropListProps,
  BoxOptionsDataProps,
  BoxValueType,
  Callback1,
  DictProps,
  DisplayTextProps,
  PlaceholderProps,
} from "@site0/tijs";
import { CommonProps } from "../../../_type";

export type DropTagEmitter = {
  (event: "change", value: any): void;
};

export type DropTagProps = CommonProps &
  DictProps &
  DisplayTextProps &
  BoxAspectProps &
  PlaceholderProps &
  BoxOptionsDataProps &
  BoxDropListProps & {
    /**
     * 输入值
     */
    value?: any;
    /**
     * 输入框的值类型
     *
     * - `raw-item`: 选项的原生对象
     * - `std-item`: 选项的标准对象
     * - `val` : 「默认」值
     */
    valueType?: BoxValueType;
    onValueChange?: Callback1<any>;
    autoI18n?: boolean;
  };
