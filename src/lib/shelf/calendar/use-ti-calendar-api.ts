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

export type CalendarDate = {
  year: number; // yyyy
  month: number; // 1-12
  date: number; // 1-31
  dayInWeek: number; // 0-6 : Sun,Mon....Fri,Sat
};

export type CalendarCell = CalendarDate &
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

function calendarDateToDate(cd: CalendarDate): Date {
  return new Date(cd.year, cd.month - 1, cd.date, 0, 0, 0, 0);
}

function isSame(d1: CalendarDate, d2?: CalendarDate | null) {
  if (!d2) return false;
  return d1.year == d2.year && d1.month == d2.month && d1.date == d2.date;
}

export function useTiCalendarApi(props: CalendarProps, emit: CalendarEmitter) {
  //-----------------------------------------------------
  // 数据模型
  //-----------------------------------------------------
  const _view_date = ref<CalendarDate>();
  //-----------------------------------------------------
  // 计算属性
  //-----------------------------------------------------
  const CurrentDate = computed(() => {
    if (props.value) {
      let d = DateTime.parse(props.value, { timezone: "Z" });
      return {
        year: d!.getUTCFullYear(),
        month: d!.getUTCMonth() + 1,
        date: d!.getUTCDate(),
        dayInWeek: d!.getUTCDay(),
      };
    }
  });
  //-----------------------------------------------------
  const Today = computed(() => {
    let today: Date;
    if (props.today) {
      today = DateTime.parse(props.today, { timezone: "Z" })!;
      return {
        year: today!.getUTCFullYear(),
        month: today!.getUTCMonth() + 1,
        date: today!.getUTCDate(),
        dayInWeek: today!.getUTCDay(),
      };
    }
    // 默认用当下日期
    today = new Date();
    return {
      year: today.getFullYear(),
      month: today.getMonth() + 1,
      date: today.getDate(),
      dayInWeek: today.getDay(),
    };
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
    return props.timezone ?? DateTime.getDefaultTimezoneOffset(true) ?? "Z";
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
  const ViewYear = computed(() => ViewDate.value.year);
  const ViewMonth = computed(() => ViewDate.value.month);
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
  function buildMonthCells(view_date: CalendarDate) {
    let items = createMonthItems(view_date);
    let cells: CalendarCell[] = [];
    for (let item of items) {
      let isToday = isSame(item, Today.value);
      let isCurrent = isSame(item, CurrentDate.value);
      let isInMonth =
        item.year == view_date.year && item.month == view_date.month;
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
  function createMonthItems(today: CalendarDate) {
    const weekBegin = props.weekBegin || 0;
    const todayd = calendarDateToDate(today);

    // 得到本月第一天以及它是周几
    const first = new Date(todayd);
    first.setDate(1);
    const firstWeekDay = first.getDay(); // 0-6

    // 得到最后本月一天
    const last = new Date(todayd);
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
    let items: CalendarDate[] = [];

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
          date: theDate.getDate(),
          dayInWeek: theDate.getDay(),
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
    gotoYear(ViewDate.value.year - 1);
  }
  //-----------------------------------------------------
  function gotoNextYear() {
    gotoYear(ViewDate.value.year + 1);
  }
  //-----------------------------------------------------
  function gotoYear(year: number) {
    _view_date.value = {
      ...ViewDate.value,
      year: year,
    };
  }
  //-----------------------------------------------------
  function gotoPrevMonth() {
    let vd = calendarDateToDate(ViewDate.value);
    DateTime.moveMonth(vd, -1);
    _view_date.value = {
      ...ViewDate.value,
      year: vd.getFullYear(),
      month: vd.getMonth() + 1,
    };
  }
  //-----------------------------------------------------
  function gotoNextMonth() {
    let vd = calendarDateToDate(ViewDate.value);
    DateTime.moveMonth(vd, 1);
    _view_date.value = {
      ...ViewDate.value,
      year: vd.getFullYear(),
      month: vd.getMonth() + 1,
    };
  }
  //-----------------------------------------------------
  /**
   * @param month 月份， `0-11` 表示 1-12 月
   */
  function gotoMonth(month: number) {
    let m = Math.max(Math.min(month, 11), 0);
    _view_date.value = {
      ...ViewDate.value,
      month: m,
    };
  }
  //-----------------------------------------------------
  function gotoToday() {
    _view_date.value = Today.value;
  }
  //-----------------------------------------------------
  function toDateEmitValue(cd: CalendarDate) {
    let fmt = props.valueFormat ?? "yyyy-MM-dd";
    let str = [cd.year, cd.month, cd.date].join("-");
    if ("yyyy-MM-dd" == fmt) {
      return str;
    }
    let d = DateTime.parse(str, { timezone: ValueTimeZone.value });
    if ("date" == ValueType.value) {
      return d;
    }
    if ("ms" == ValueType.value) {
      return d?.getTime() || 0;
    }

    return DateTime.format(d!, { fmt, timezone: ValueTimeZone.value });
  }
  //-----------------------------------------------------
  function changeDate(d: CalendarDate) {
    let val = toDateEmitValue(d);
    if (val != props.value) {
      emit("change", val);
      _view_date.value = { ...d, date: 1 };
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
