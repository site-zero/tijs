import _ from "lodash";
import { computed, ref } from "vue";
import { ComRef, DateParseOptionsZone } from "../../../_type";
import { DateTime, I18n, Util } from "../../../core";
import {
  CalendarEmitter,
  CalendarProps,
  CalendarValueType,
} from "./ti-calendar-types";

export type TiCalendarApi = ReturnType<typeof useTiCalendarApi>;

export type MonthLastDate = 28 | 29 | 30 | 31;

export type CaleMonthItem = {
  year: number;
  month: number;
  dayInMonth: number;
  dayInWeek: number; // 0-6 : Sun,Mon....Fri,Sat
  date: Date;
};

export type CaleMonthDayCell = CaleMonthItem &
  ComRef & {
    /**
     * 本区块是否为今日(props.today)
     */
    isToday: boolean;
    /**
     * 本区块是否为当前日期(props.value)
     */
    isCurrent: boolean;
    /**
     * 本区块是否在当前月份内
     */
    isInMonth: boolean;
  };

export function useTiCalendarApi(props: CalendarProps, emit: CalendarEmitter) {
  //-----------------------------------------------------
  // 数据模型
  //-----------------------------------------------------
  const _view_date = ref<Date>();
  //-----------------------------------------------------
  // 计算属性
  //-----------------------------------------------------
  const CurrentDate = computed(() => {
    if (props.value) {
      return DateTime.parse(props.value, { timezone: ValueTimeZone.value });
    }
  });
  //-----------------------------------------------------
  const AutoValueType = computed((): CalendarValueType => {
    let v = props.value;
    if (_.isNil(v)) return "str";
    if (_.isDate(v)) return "date";
    if (_.isNumber(v)) return "ms";
    return "str";
  });
  //-----------------------------------------------------
  const ValueType = computed(() => {
    if ("auto" == props.valueType || !props.valueType) {
      return AutoValueType.value;
    }
    return props.valueType;
  });
  //-----------------------------------------------------
  const ValueTimeZone = computed((): DateParseOptionsZone => {
    return props.timezone ?? DateTime.getDefaultTimezoneOffset(true);
  });
  //-----------------------------------------------------
  const Today = computed(() => {
    if (props.today) {
      return DateTime.parse(props.today, { timezone: ValueTimeZone.value })!;
    }

    return new Date();
  });
  //-----------------------------------------------------
  const ViewDate = computed(() => {
    if (_view_date.value) {
      return _view_date.value;
    }
    if (CurrentDate.value) {
      return CurrentDate.value;
    }
    return Today.value;
  });
  //-----------------------------------------------------
  const ViewYear = computed(() => ViewDate.value.getFullYear());
  const ViewMonth = computed(() => ViewDate.value.getMonth());
  //-----------------------------------------------------
  const MonthHeads = computed(() => {
    let prefix = props.i18nPrefix || "dt-w";
    let weekBegin = props.weekBegin || 0;
    let re: string[] = [];
    for (let i = weekBegin; i < 7; i++) {
      re.push(I18n.get(`${prefix}${i}`));
    }
    // 周一开始一星期
    if (props.weekBegin === 1) {
      re.push(I18n.get(`${prefix}0`));
    }
    return re;
  });
  //-----------------------------------------------------
  const MonthCells = computed(() => {
    return buildMonthCells(ViewDate.value);
  });
  //-----------------------------------------------------
  // 计算方法
  //-----------------------------------------------------
  function buildMonthCells(view_date: Date) {
    DateTime.setTime(view_date, 0, 0, 0, 0);
    let items = createMonthItems(view_date);
    let cells: CaleMonthDayCell[] = [];
    for (let item of items) {
      let isToday = DateTime.isSameDate(item.date, Today.value);
      let isCurrent = DateTime.isSameDate(item.date, CurrentDate.value);
      let isInMonth = DateTime.isInMonth(item.date, view_date);
      let comType = props.comType;
      let comConf = Util.explainObj(
        {
          ...item,
          isToday,
          isCurrent,
          isInMonth,
        },
        props.comConf || {}
      );
      cells.push({
        ...item,
        isToday,
        isCurrent,
        isInMonth,
        comType,
        comConf,
      });
    }
    return cells;
  }
  //-----------------------------------------------------
  function createMonthItems(today: Date) {
    const weekBegin = props.weekBegin || 0;

    // 得到本月第一天以及它是周几
    const first = new Date(today);
    first.setDate(1);
    const firstWeekDay = first.getDay(); // 0-6

    // 得到最后本月一天
    const last = new Date(today);
    DateTime.moveToLastDateOfMonth(last);
    const lastDate = last.getDate();

    // 之前要补几天？
    let dayOffsetHead = firstWeekDay - weekBegin;
    // first 为周日,  weekBegin 为周一时
    if (dayOffsetHead < 0) {
      dayOffsetHead = 6;
    }
    const head = new Date(first);
    DateTime.moveDate(head, -dayOffsetHead);

    // 要显示多少周
    let weekCount = Math.ceil(dayOffsetHead + lastDate) / 7;
    if (props.weekCount) {
      weekCount = Math.max(weekCount, props.weekCount);
    }

    // 准备返回值
    let items: CaleMonthItem[] = [];

    // 第一层循环周
    for (let w = 0; w < weekCount; w++) {
      // 第二层循环天
      for (let d = 0; d < 7; d++) {
        // 移动到今天
        let theDate = new Date(head);
        DateTime.moveDate(theDate, w * 7 + d);
        let ds = DateTime.format(theDate, {
          timezone: ValueTimeZone.value,
          fmt: "yyyy-MM-dd",
        });

        items.push({
          year: theDate.getFullYear(),
          month: theDate.getMonth() + 1,
          dayInMonth: theDate.getDate(),
          dayInWeek: theDate.getDay(),
          date: theDate,
        });
      }
    }

    // 搞定返回
    return items;
  }
  //-----------------------------------------------------
  // 操作方法
  //-----------------------------------------------------
  function gotoPrevYear() {
    gotoYear(ViewDate.value.getFullYear() - 1);
  }
  //-----------------------------------------------------
  function gotoNextYear() {
    gotoYear(ViewDate.value.getFullYear() + 1);
  }
  //-----------------------------------------------------
  function gotoYear(year: number) {
    let vd = new Date(ViewDate.value);
    vd.setFullYear(year);
    _view_date.value = vd;
  }
  //-----------------------------------------------------
  function gotoPrevMonth() {
    let vd = new Date(ViewDate.value);
    DateTime.moveMonth(vd, -1);
    _view_date.value = vd;
  }
  //-----------------------------------------------------
  function gotoNextMonth() {
    let vd = new Date(ViewDate.value);
    DateTime.moveMonth(vd, 1);
    _view_date.value = vd;
  }
  //-----------------------------------------------------
  /**
   * @param month 月份， `0-11` 表示 1-12 月
   */
  function gotoMonth(month: number) {
    let vd = new Date(ViewDate.value);
    let m = Math.max(Math.min(month, 11), 0);
    vd.setMonth(m);
    _view_date.value = vd;
  }
  //-----------------------------------------------------
  function gotoToday() {
    _view_date.value = Today.value;
  }
  //-----------------------------------------------------
  function toDateEmitValue(d: Date) {
    if ("date" == ValueType.value) {
      return new Date(d);
    }
    if ("ms" == ValueType.value) {
      return "ms";
    }
    let fmt = props.valueFormat ?? "yyyy-MM-dd";
    return DateTime.format(d, { fmt, timezone: ValueTimeZone.value });
  }
  //-----------------------------------------------------
  function changeDate(d: Date) {
    let val = toDateEmitValue(d);
    if (val != props.value) {
      emit("change", val);
    }
  }
  //-----------------------------------------------------
  // 返回接口
  //-----------------------------------------------------
  return {
    // 计算属性
    CurrentDate,
    AutoValueType,
    ValueType,
    Today,
    MonthHeads,
    MonthCells,
    ViewDate,
    ViewYear,
    ViewMonth,

    // 操作方法
    gotoPrevYear,
    gotoNextYear,
    gotoYear,
    gotoPrevMonth,
    gotoNextMonth,
    gotoMonth,
    gotoToday,
    changeDate,
  };
}
