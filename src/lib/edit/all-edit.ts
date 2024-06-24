import { TiComSet } from '../../_type';
import { TiEditCodeInfo } from './code/ti-edit-code-index';
import { TiEditPairInfo } from './pair/ti-edit-pair-index';

export default {
  TiEditCode: TiEditCodeInfo,
  TiEditPair: TiEditPairInfo,
} as TiComSet;

export * from './code/ti-edit-code-index';
export * from './pair/ti-edit-pair-index';
