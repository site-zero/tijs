import { CommonProps } from "@site0/tijs";

export type TiDiffFormEmitter = {
  (event: "change", payload: any): void;
};

export type TiDiffFormProps = CommonProps & {
  // 这里放置控件支持的属性
};