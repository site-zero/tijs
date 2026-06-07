import { CommonProps, ComRef, IconInput, LogicType, PopPosition, TranSpeed } from "../../_type";

export type ToastProps = CommonProps & ComRef & {
    // 样式
    type?: LogicType;
    icon?: IconInput;


    // 内容
    content?: string;
    contentType?: "text" | "html";

    // 行为
    position?: PopPosition;
    tranSpeed?: TranSpeed;
    /**
     * 多少毫秒后，让消息消失。
     * 
     * 默认 3 秒:  `3000`
     */
    duration?: number
}