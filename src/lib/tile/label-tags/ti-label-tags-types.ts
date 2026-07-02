import { DictProps, TagItem, TagsProps } from "@site0/tijs";

export type LabelTagsEmitter = {
  (event: "click"): void;
  // 对于 TagItem[] 型的 value
  (event: "click-tag", payload: TagItem): void;
};

/**
 * 这是一个 TiTags 的包裹组件，它接受任何值，将其根据 options 的设置
 * 转换为 TagItems 交给 TiTags 来进行显示
 */
export type LabelTagsProps = Omit<TagsProps, "value"> &
  DictProps & {
    value?: any;
  };
