import { CommonProps } from "@site0/tijs";

export type FilterBarEmitter = {
  (event: "change", payload: any): void;
  (event: "search"): void;
  (event: "reset"): void;
};

export type FilterBarProps = CommonProps & {
  // 这里放置控件支持的属性
};