import { CommonProps } from "@site0/tijs";

export type TiTimeSlotsEmitter = {
  (event: "change", payload: any): void;
};

export type TiTimeSlotsProps = CommonProps & {
  // 这里放置控件支持的属性
};