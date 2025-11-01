import { CommonProps } from "@site0/tijs";

export type CrumbEmitter = {
  (event: "change", payload: any): void;
};

export type CrumbProps = CommonProps & {
  // 这里放置控件支持的属性
};