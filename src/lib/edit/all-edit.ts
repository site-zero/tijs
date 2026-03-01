import { TiComSet } from "../../_type";
import {
  BatchFormNameInfo,
  TiBatchFormInfo,
} from "./batch-form/ti-batch-form-index";
import { TiCodeEditorInfo } from "./code/ti-code-editor-index";
import { TiFilterBarInfo } from "./filter-bar/ti-filter-bar-index";
import { TiPairEditorInfo } from "./pair/ti-pair-editor-index";
import { TiEditRichProseInfo } from "./rich/prose/ti-edit-rich-prose-index";
import { TiSearchBarInfo } from "./search-bar/ti-search-bar-index";
import { TiSorterInfo } from "./sorter/ti-sorter-index";

export default {
  TiCodeEditor: TiCodeEditorInfo,
  TiPairEditor: TiPairEditorInfo,
  TiEditRichProse: TiEditRichProseInfo,
  TiFilterBar: TiFilterBarInfo,
  TiSearchBar: TiSearchBarInfo,
  TiSorter: TiSorterInfo,
  TiBatchForm: TiBatchFormInfo,
  BatchFormName: BatchFormNameInfo,
} as TiComSet;

export * from "./batch-form/ti-batch-form-index";
export * from "./code/ti-code-editor-index";
export * from "./filter-bar/ti-filter-bar-index";
export * from "./pair/ti-pair-editor-index";
export * from "./rich/prose/ti-edit-rich-prose-index";
export * from "./search-bar/ti-search-bar-index";
export * from "./sorter/ti-sorter-index";
