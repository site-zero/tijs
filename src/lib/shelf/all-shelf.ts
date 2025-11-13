import { TiComSet } from "../../_type";
import { TiBlockInfo } from "./block/ti-block-index";
import { TiCalendarInfo } from "./calendar/ti-calendar-index";
import { TiFormInfo } from "./form/ti-form-index";
import { TiTabsFormInfo } from "./form/ti-tabs-form-index";
import { TiGridFieldsInfo } from "./grid-fields/ti-grid-fields-index";
import { TiLayoutGridInfo } from "./layout/grid/ti-layout-grid-index";
import { TiLayoutTabsInfo } from "./layout/tabs/ti-layout-tabs-index";
import { TiTimeSlotsInfo } from "./time-slots/ti-time-slots-index";
import { TiWeeksInfo } from "./weeks/ti-weeks-index";
//import { TiMainFrameInfo } from './main-frame/ti-main-frame-index';

export default {
  TiForm: TiFormInfo,
  TiTabsForm: TiTabsFormInfo,
  TiGridFields: TiGridFieldsInfo,
  TiBlock: TiBlockInfo,
  TiLayoutGrid: TiLayoutGridInfo,
  TiLayoutTabs: TiLayoutTabsInfo,
  TiCalendar: TiCalendarInfo,
  TiWeeks: TiWeeksInfo,
  TiTimeSlots: TiTimeSlotsInfo,
} as TiComSet;

export * from "./block/ti-block-index";
export * from "./calendar/ti-calendar-index";
export * from "./form/ti-form-index";
export * from "./form/ti-tabs-form-index";
export * from "./grid-fields/ti-grid-fields-index";
export * from "./layout/grid/ti-layout-grid-index";
export * from "./layout/layout-support";
export * from "./layout/layout-types";
export * from "./layout/tabs/ti-layout-tabs-index";
export * from "./time-slots/ti-time-slots-index";
export * from "./weeks/ti-weeks-index";
