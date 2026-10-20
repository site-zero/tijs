import {
  BoxAspectProps,
  CommonProps,
  PlaceholderProps,
  ReadonlyProps,
  Vars,
} from "@site0/tijs";

export type InputPasswordEmitter = {
  (event: "change", passwd: string | null): void;
};

export type InputPasswordProps = CommonProps &
  PlaceholderProps &
  ReadonlyProps &
  BoxAspectProps & {
    /**
     * 密码值
     */
    value?: string | null;

    /**
     * 输入框宽度
     */
    width?: number | string;

    /**
     * 输入框内部样式
     */
    inputStyle?: Vars;

    /**
     * 是否显示密码强度指示器，默认 `true`
     */
    showIndicator?: boolean;

    /**
     * 是否允许显示/隐藏密码的切换按钮，默认 `true`
     */
    allowToggleVisible?: boolean;

    /**
     * 聚焦后是否自动选择内容
     */
    autoSelect?:boolean;
  };
