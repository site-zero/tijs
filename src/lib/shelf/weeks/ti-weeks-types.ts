import { CommonProps } from "@site0/tijs";

export type TiWeeksEmitter = {
  (event: "change", payload: any): void;
};

export type TiWeeksProps = CommonProps & {
  // 这里放置控件支持的属性
};