import { ActionBarItem, CommonProps } from "@site0/tijs";
import { InjectionKey } from "vue";
import { EditorToolbarItemName } from "./toolbar/toolbar-item-builder";
import { TiEditRichProseApi } from "./use-ti-edit-rich-prose-api";

export const TI_RICH_EDITOR_API_KEY: InjectionKey<TiEditRichProseApi> =
  Symbol("TI_RICH_EDITOR_API");

export type TiEditRichProseEmitter = {
  (event: "change", payload: any): void;
};

export type TiEditRichProseProps = CommonProps & EditorToolbarProps & {};

export type EditorToolbarProps = {
  toolbar?: EditorToolbarItem[] | undefined | null;
};

export type EditorToolbarItem =
  | ActionBarItem
  | EditorToolbarItemName
  | EditorToolbarItemName[];

export type RichEditorGUIState = {
  /**
   * 导航窗格的显示
   * - false : 不显示导航窗格
   * - "tree": 显示为文档结构树
   * - "outline": 显示为大纲层级
   */
  nav: false | "tree" | "outline";

  /**
   * 是否显示属性窗格
   */
  props: boolean;

  /**
   * 是否显示脚注区
   */
  footer: boolean;

  /**
   * 是否显示工具条
   */
  toolbar: boolean;
};
