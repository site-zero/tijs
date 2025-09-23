import { TiComSet } from "../../_type";
import { TiCodeEditorInfo } from "./code/ti-code-editor-index";
import { DiffFormFldNameInfo } from "./diff-form/fld-name/diff-form-fld-name-index";
import { TiDiffFormInfo } from "./diff-form/ti-diff-form-index";
import { TiPairEditorInfo } from "./pair/ti-pair-editor-index";
import { TiEditRichProseInfo } from "./rich/prose/ti-edit-rich-prose-index";
//import { TiRichTinyMCEditorInfo } from "./rich/tinymce/ti-tiny-mc-editor-index";

export default {
  DiffFormFldName: DiffFormFldNameInfo,
  TiCodeEditor: TiCodeEditorInfo,
  TiDiffForm: TiDiffFormInfo,
  TiPairEditor: TiPairEditorInfo,
  TiEditRichProse: TiEditRichProseInfo,
} as TiComSet;

export * from "./code/ti-code-editor-index";
export * from "./diff-form/fld-name/diff-form-fld-name-index";
export * from "./diff-form/ti-diff-form-index";
export * from "./pair/ti-pair-editor-index";
export * from "./rich/prose/ti-edit-rich-prose-index";
//export * from "./rich/tinymce/ti-tiny-mc-editor-index";
