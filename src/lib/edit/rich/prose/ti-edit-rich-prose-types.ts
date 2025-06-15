import { CommonProps } from "@site0/tijs";

export type TiEditRichProseEmitter = {
  (event: "change", payload: any): void;
};

export type TiEditRichProseProps = CommonProps & {
  // 这里放置控件支持的属性
};