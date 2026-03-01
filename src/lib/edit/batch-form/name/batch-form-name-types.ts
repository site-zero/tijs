import { CommonProps } from "@site0/tijs";

export type BatchFormNameEmitter = {
  (event: "change", payload: any): void;
};

export type BatchFormNameProps = CommonProps & {
  // 这里放置控件支持的属性
};