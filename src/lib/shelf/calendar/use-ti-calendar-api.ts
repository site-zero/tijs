import { computed } from "vue";
import { ComRef } from "../../../_type";
import { DateTime, Util } from "../../../core";
import { TiCalendarEmitter, TiCalendarProps } from "./ti-calendar-types";

export type TiCalendarApi = ReturnType<typeof useTiCalendarApi>;

export type MonthLastDate = 28 | 29 | 30 | 31

export type CaleMonthItem = {
  year: number;
  month: number;
  dayInMonth: number,
  dayInWeek: number; // 0-6 : Sun,Mon....Fri,Sat
  date: Date
}

export type CaleMonthDayCell = CaleMonthItem & ComRef & {
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
}

export function useTiCalendarApi(props: TiCalendarProps, _emit: TiCalendarEmitter) {
  //-----------------------------------------------------
  // 数据模型
  //-----------------------------------------------------
  //-----------------------------------------------------
  // 计算属性
  //-----------------------------------------------------
  const CurrentDate = computed(() => {
    if (props.value) {
      return DateTime.parse(props.value, { timezone: props.timezone });
    }
  })
  //-----------------------------------------------------
  const Today = computed(() => {
    if (props.today) {
      return DateTime.parse(props.today, { timezone: props.timezone })!;
    }
    return new Date();
  })
  //-----------------------------------------------------
  const MonthCells = computed(() => {
    return buildMonthCells(Today.value);
  })
  //-----------------------------------------------------
  // 计算方法
  //-----------------------------------------------------
  function buildMonthCells(today: Date) {
    DateTime.setTime(today, 0, 0, 0, 0);
    let items = createMonthItems(today);
    let cells: CaleMonthDayCell[] = []
    for (let item of items) {
      let cell: CaleMonthDayCell;
      let comType = props.comType
      let comConf = Util.explainObj(item, props.comConf || {});
      cells.push({
        ...item,
        comType,
        comConf,
        isToday: DateTime.isSameDate(item.date, Today.value),
        isCurrent: DateTime.isSameDate(item.date, CurrentDate.value),
        isInMonth: DateTime.isInMonth(item.date, today)
      })
    }
    return cells;
  }
  //-----------------------------------------------------
  function createMonthItems(today: Date) {
    const todayWeekDay = today.getDay(); // 0-6
    const last = new Date(today);
    DateTime.moveToLastDateOfMonth(last);
    const lastDate = last.getDate();
    const weekBegin = props.weekBegin || 0;

    // 之前要补几天？
    let dayOffsetHead = todayWeekDay - weekBegin;
    // today 为周日，  weekBegin 为周一时
    if (dayOffsetHead < 0) {
      dayOffsetHead = 6;
    }
    const head = new Date(today)
    DateTime.moveDate(head, -dayOffsetHead);

    // 要显示多少周
    let weekCount = Math.ceil(dayOffsetHead + lastDate) / 7;

    // 准备返回值
    let items: CaleMonthItem[] = [];

    // 第一层循环周
    for (let w = 0; w < weekCount; w++) {
      // 第二层循环天
      for (let d = 0; d < 7; d++) {
        let day = new Date(head);
        DateTime.moveDate(day, w * 7 + d);
        items.push({
          year: day.getFullYear(),
          month: day.getMonth() + 1,
          dayInMonth: day.getDate(),
          dayInWeek: day.getDay(),
          date: day
        })
      }

    }

    // 搞定返回
    return items;
  }
  //-----------------------------------------------------
  // 返回接口
  //-----------------------------------------------------
  return {
    // 计算属性
    CurrentDate,
    Today,
    MonthCells
  };
}