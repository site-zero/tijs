import { CommonProps } from "@site0/tijs";

export type TiCalendarEmitter = {
  (event: "change", payload: any): void;
};

export type TiCalendarProps = CommonProps & {
  // 这里放置控件支持的属性
};