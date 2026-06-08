import {
  CommonProps,
  ComRef,
  IconInput,
  LogicType,
  PopPosition,
  TranSpeed,
} from "../../_type";

export type ToastProps = CommonProps &
  ComRef & {
    icon?: IconInput;
    // 样式
    type?: LogicType;
    /**
     * 默认的，如果 type='primary'，那么颜色方案就是
     * color : var(--ti-color-primary)
     * bgColor : var(--ti-color-primary-r)
     *
     * 如果 reverseColor 为 true，那么颜色方案就是
     * color : var(--ti-color-primary-r)
     * bgColor : var(--ti-color-primary)
     */
    reverseColor?: boolean;

    // 内容
    content?: string;
    contentType?: "text" | "html";

    // 行为
    position?: PopPosition;
    tranSpeed?: TranSpeed;
    /**
     * 多少秒后，让消息消失。
     *
     * 默认 3 秒
     */
    duration?: number;
  };

  export type ToastBoxProps = ToastProps & {
    releaseDom: () => void;
  }
