import { TiComSet } from "../../_type";
import { TiCodeEditorInfo } from "./code/ti-code-editor-index";
import { DiffFormFldNameInfo } from "./diff-form/fld-name/diff-form-fld-name-index";
import { TiDiffFormInfo } from "./diff-form/ti-diff-form-index";
import { TiFilterBarInfo } from "./filter-bar/ti-filter-bar-index";
import { TiPairEditorInfo } from "./pair/ti-pair-editor-index";
import { TiEditRichProseInfo } from "./rich/prose/ti-edit-rich-prose-index";
import { TiSearchBarInfo } from "./search-bar/ti-search-bar-index";

export default {
  DiffFormFldName: DiffFormFldNameInfo,
  TiCodeEditor: TiCodeEditorInfo,
  TiDiffForm: TiDiffFormInfo,
  TiPairEditor: TiPairEditorInfo,
  TiEditRichProse: TiEditRichProseInfo,
  TiFilterBar: TiFilterBarInfo,
  TiSearchBar: TiSearchBarInfo,
} as TiComSet;

export * from "./code/ti-code-editor-index";
export * from "./diff-form/fld-name/diff-form-fld-name-index";
export * from "./diff-form/ti-diff-form-index";
export * from "./filter-bar/ti-filter-bar-index";
export * from "./pair/ti-pair-editor-index";
export * from "./rich/prose/ti-edit-rich-prose-index";
export * from "./search-bar/ti-search-bar-index";
