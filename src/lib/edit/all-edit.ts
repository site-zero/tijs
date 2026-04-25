import { TiComSet } from "../../_type";
import {
  BatchFormNameInfo,
  TiBatchFormInfo,
} from "./batch-form/ti-batch-form-index";
import { TiCodeEditorInfo } from "./code/ti-code-editor-index";
import { TiFilterBarInfo } from "./filter-bar/ti-filter-bar-index";
import { TiEditPairsInfo } from "./pair/ti-edit-pairs-index";
import { TiEditRichProseInfo } from "./rich/prose/ti-edit-rich-prose-index";
import { TiSorterInfo } from "./sorter/ti-sorter-index";

export default {
  TiCodeEditor: TiCodeEditorInfo,
  TiEditPairs: TiEditPairsInfo,
  TiEditRichProse: TiEditRichProseInfo,
  TiFilterBar: TiFilterBarInfo,
  TiSorter: TiSorterInfo,
  TiBatchForm: TiBatchFormInfo,
  BatchFormName: BatchFormNameInfo,
} as TiComSet;

export * from "./batch-form/ti-batch-form-index";
export * from "./code/ti-code-editor-index";
export * from "./filter-bar/ti-filter-bar-index";
export * from "./pair/ti-edit-pairs-index";
export * from "./rich/prose/ti-edit-rich-prose-index";
export * from "./sorter/ti-sorter-index";
