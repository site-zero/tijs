import { CommonProps } from "@site0/tijs";

export type TiSearchBarEmitter = {
  (event: "change", payload: any): void;
};

export type TiSearchBarProps = CommonProps & {
  // 这里放置控件支持的属性
};