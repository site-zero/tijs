import { TiComSet } from '../../core';
import { TiInputInfo } from './box/ti-input-index';
import { TiCheckInfo } from './check/ti-check-index';
import { TiTransferInfo } from './transfer/ti-transfer-index';

export default {
  TiInput: TiInputInfo,
  TiCheck: TiCheckInfo,
  TiTransfer: TiTransferInfo,
} as TiComSet;

export * from './box/ti-input-index';
export * from './check/ti-check-index';
export * from './transfer/ti-transfer-index';

