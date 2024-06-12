import { TiComSet } from '../../core';
import { TiInputInfo } from './box/ti-input-index';
import { TiCheckInfo } from './check/ti-check-index';
import { TiInputColorInfo } from './color/ti-input-color-index';
import { TiComboFilterInfo } from './combo-filter/ti-combo-filter-index';
import { TiInputCurrencyInfo } from './currency/ti-input-currency-index';
import { TiInputDateInfo } from './date/ti-input-date-index';
import { TiInputDatetimeInfo } from './datetime/ti-input-datetime-index';
import { TiDroplistInfo } from './droplist/ti-droplist-index';
import { TiFilterInfo } from './filter/ti-filter-index';
import { TiInputGroupInfo } from './group/ti-input-group-index';
import { TiInputIconInfo } from './icon/ti-input-icon-index';
import { TiInputNumInfo } from './num/ti-input-num-index';
import { TiScoreInfo } from './score/ti-score-index';
import { TiSorterInfo } from './sorter/ti-sorter-index';
import { TiSwitcherInfo } from './switcher/ti-switcher-index';
import { TiInputTextInfo } from './text/ti-input-text-index';
import { TiInputTimeInfo } from './time/ti-input-time-index';
import { TiToggleInfo } from './toggle/ti-toggle-index';
import { TiTransferInfo } from './transfer/ti-transfer-index';

export default {
  TiInput: TiInputInfo,
  TiComboFilter: TiComboFilterInfo,
  TiCheck: TiCheckInfo,
  TiFilter: TiFilterInfo,
  TiTransfer: TiTransferInfo,
  TiDroplist: TiDroplistInfo,
  TiToggle: TiToggleInfo,
  TiInputColor: TiInputColorInfo,
  TiInputCurrency: TiInputCurrencyInfo,
  TiInputNum: TiInputNumInfo,
  TiInputDate: TiInputDateInfo,
  TiInputDatetime: TiInputDatetimeInfo,
  TiInputTime: TiInputTimeInfo,
  TiInputText: TiInputTextInfo,
  TiScore: TiScoreInfo,
  TiSorter: TiSorterInfo,
  TiSwitcher: TiSwitcherInfo,
  TiInputIcon: TiInputIconInfo,
  TiInputGroup: TiInputGroupInfo,
} as TiComSet;

export * from './box/ti-input-index';
export * from './check/ti-check-index';
export * from './color/ti-input-color-index';
export * from './combo-filter/ti-combo-filter-index';
export * from './currency/ti-input-currency-index';
export * from './date/ti-input-date-index';
export * from './datetime/ti-input-datetime-index';
export * from './droplist/ti-droplist-index';
export * from './filter/ti-filter-index';
export * from './group/ti-input-group-index';
export * from './icon/ti-input-icon-index';
export * from './num/ti-input-num-index';
export * from './score/ti-score-index';
export * from './sorter/ti-sorter-index';
export * from './switcher/ti-switcher-index';
export * from './text/ti-input-text-index';
export * from './time/ti-input-time-index';
export * from './toggle/ti-toggle-index';
export * from './transfer/ti-transfer-index';
