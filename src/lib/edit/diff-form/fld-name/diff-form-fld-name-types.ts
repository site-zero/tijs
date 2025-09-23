import { CommonProps } from "@site0/tijs";

export type DiffFormFldNameEmitter = {
  (event: "change", payload: any): void;
};

export type DiffFormFldNameProps = CommonProps & {
  // 这里放置控件支持的属性
};