import {
  EditorContentConvertorMaker,
  EditorContentType,
} from "../ti-edit-rich-prose-types";
import { useHTMLContentConvertor } from "./html-content-convertor";
import { useJsonContentConvertor } from "./json-content-convertor";
import { useMarkdownContentConvertor } from "./markdown-content-covertor";

const _makers: Record<EditorContentType, EditorContentConvertorMaker> = {
  html: useHTMLContentConvertor,
  json: useJsonContentConvertor,
  markdown: useMarkdownContentConvertor,
};

export function getContentConvertorMaker(contentType: EditorContentType) {
  return _makers[contentType];
}
