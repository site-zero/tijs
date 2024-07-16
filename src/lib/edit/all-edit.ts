import { TiComSet } from '../../_type';
import { TiCodeEditorInfo } from './code/ti-code-editor-index';
import { TiPairEditorInfo } from './pair/ti-pair-editor-index';

export default {
  TiCodeEditor: TiCodeEditorInfo,
  TiPairEditor: TiPairEditorInfo,
} as TiComSet;

export * from './code/ti-code-editor-index';
export * from './pair/ti-pair-editor-index';
