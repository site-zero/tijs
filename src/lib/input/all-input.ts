import { TiComSet } from '../../core';
import { TiInputInfo } from './box/ti-input-index';
import { TiCheckInfo } from './check/ti-check-index';
import { TiInputColorInfo } from './color/ti-input-color-index';
import { TiInputCurrencyInfo } from './currency/ti-input-currency-index';
import { TiInputDateInfo } from './date/ti-input-date-index';
import { TiInputDatetimeInfo } from './datetime/ti-input-datetime-index';
import { TiDroplistInfo } from './droplist/ti-droplist-index';
import { TiInputGroupInfo } from './group/ti-input-group-index';
import { TiInputIconInfo } from './icon/ti-input-icon-index';
import { TiInputTextInfo } from './text/ti-input-text-index';
import { TiInputTimeInfo } from './time/ti-input-time-index';
import { TiToggleInfo } from './toggle/ti-toggle-index';
import { TiTransferInfo } from './transfer/ti-transfer-index';

export default {
  TiInput: TiInputInfo,
  TiCheck: TiCheckInfo,
  TiTransfer: TiTransferInfo,
  TiDroplist: TiDroplistInfo,
  TiToggle: TiToggleInfo,
  TiInputColor: TiInputColorInfo,
  TiInputCurrency: TiInputCurrencyInfo,
  TiInputDate: TiInputDateInfo,
  TiInputDatetime: TiInputDatetimeInfo,
  TiInputTime: TiInputTimeInfo,
  TiInputText: TiInputTextInfo,
  TiInputIcon: TiInputIconInfo,
  TiInputGroup: TiInputGroupInfo,
} as TiComSet;

export * from './box/ti-input-index';
export * from './check/ti-check-index';
export * from './color/ti-input-color-index';
export * from './currency/ti-input-currency-index';
export * from './date/ti-input-date-index';
export * from './datetime/ti-input-datetime-index';
export * from './droplist/ti-droplist-index';
export * from './group/ti-input-group-index';
export * from './icon/ti-input-icon-index';
export * from './text/ti-input-text-index';
export * from './time/ti-input-time-index';
export * from './toggle/ti-toggle-index';
export * from './transfer/ti-transfer-index';
