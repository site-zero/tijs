import { ActionBarItem, CommonProps } from "@site0/tijs";
import OrderedMap from "orderedmap";
import { MarkSpec, Node, NodeSpec, Schema, Slice } from "prosemirror-model";
import { InjectionKey } from "vue";
import { EditorToolbarItemName } from "./toolbar/toolbar-item-builder";
import { TiEditRichProseApi } from "./use-editor-api";

export const TI_RICH_EDITOR_API_KEY: InjectionKey<TiEditRichProseApi> =
  Symbol("TI_RICH_EDITOR_API");

export type TiEditRichProseEmitter = {
  (event: "change", payload: string): void;
};

export type TiEditRichProseProps = CommonProps &
  EditorToolbarProps &
  EditorContentProps & {
    value?: string;
  };

export type EditorContentType = "html" | "json" | "markdown";

export type EditorToolbarProps = {
  toolbar?: EditorToolbarItem[] | undefined | null;
};

export type EditorContentProps = {
  /**
   * 编辑器对应的内容类型
   * - `json`: 对应的内容为 JSON 字符串(编辑器文档对象模型原始结构)
   * - `html`: 对应的内容为 HTML 字符串
   * - `markdown`: 对应的内容为 Markdown 字符串
   * 默认 `json`
   */
  contentType?: EditorContentType;
  /**
   * 当 `contentType` 为 `json` 时，用于格式化 JSON 字符串的函数或缩进级别
   * - 函数: 接收 JSON 数据作为参数，返回格式化后的字符串
   * - 数字: 表示 JSON 字符串的缩进级别，用于美化输出
   * 默认直接转换为 JSON 字符串
   */
  jsonFormator?: number | ((data: any) => string);
};

export type EditorContentConvertor = {
  /**
   * 将输入文档源文本内容转换为 ProseMirror Model Node 的 JSON 对象
   *
   * @param input 输入的文档源码
   * @returns ProseMirror Model Node 的 JSON 对象
   */
  parse: (input: string) => Node;

  /**
   * 将 ProseMirror Model Node 的 JSON 对象渲染为文档源文本内容
   *
   * @param doc ProseMirror Model Node 的 JSON 对象
   * @returns 文档源文本内容
   */
  render: (doc: Node) => string;
};

export type EditorContentConvertorMaker = (
  props: EditorContentProps,
  schema: EditorSchema
) => EditorContentConvertor;

export type EditorToolbarItem =
  | ActionBarItem
  | EditorToolbarItemName
  | EditorToolbarItemName[];

export type EditorSchema = Schema<
  keyof OrderedMap<NodeSpec>,
  keyof OrderedMap<MarkSpec>
>;

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
