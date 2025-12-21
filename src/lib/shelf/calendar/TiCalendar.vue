<script lang="ts" setup>
  import { computed } from "vue";
  import { TiInput, TiTextSnippet } from "../../";
  import {
    isAspectSize,
    toAspectBoxPad,
    toAspectFontSize,
    toAspectGap,
    toAspectRadius,
    toLogicColor,
  } from "../../../";
  import { CssUtils, I18n } from "../../../core";
  import { CalendarEmitter, CalendarProps } from "./ti-calendar-types";
  import { useMonthDropConfig, useYearDropConfig } from "./use-drop-config";
  import { useTiCalendarApi } from "./use-ti-calendar-api";
  //-----------------------------------------------------
  const emit = defineEmits<CalendarEmitter>();
  const props = withDefaults(defineProps<CalendarProps>(), {
    valueType: "auto",
    weekBegin: 0,
    weekCount: 6,
  });
  const _api = useTiCalendarApi(props, emit);
  //-----------------------------------------------------
  const TopClass = computed(() => CssUtils.mergeClassName(props.className));
  //-----------------------------------------------------
  const TopStyle = computed(() => {
    let re = CssUtils.mergeStyles([
      {
        "width": props.width,
        "height": props.height,
        "--main-pad": toAspectBoxPad(props.mainPadding),
        "--head-bg": toLogicColor(props.headBg),
        "--head-color": toLogicColor(props.headColor),
        "--head-fontsz": toAspectFontSize(props.headFontSize),
        "--cell-bg": toLogicColor(props.cellBg),
        "--cell-fontsz": toAspectFontSize(props.cellFontSize),
        "--cell-gap": toAspectGap(props.cellGap),
        "--cell-today-bg": toLogicColor(props.cellTodayBg),
        "--cell-today-color": toLogicColor(props.cellTodayColor),
        "--cell-current-bg": toLogicColor(props.cellCurrentBg),
        "--cell-current-color": toLogicColor(props.cellCurrentColor),
      },
      props.style,
    ]);
    if (props.cellRadius) {
      if (isAspectSize(props.cellRadius)) {
        re["--cell-radius"] = toAspectRadius(props.cellRadius);
      } else {
        re["--cell-radius"] = props.cellRadius;
      }
    }
    return re;
  });
  //-----------------------------------------------------
  const YearDropConfig = computed(() => useYearDropConfig(props));
  const MonthDropConfig = computed(() => useMonthDropConfig(props));
  //-----------------------------------------------------
</script>
<template>
  <div class="ti-calendar" :class="TopClass" :style="TopStyle">
    <header>
      <slot name="head">
        <TiTextSnippet
          v-if="props.head"
          className="tablepart as-head"
          :class="props.head.className"
          :style="props.head.style"
          :prefixIcon="props.head.icon"
          :text="props.head.text ?? ''"
          :textType="props.head.textType"
          :comType="props.head.comType"
          :comConf="props.head.comConf" />
        <template v-else>
          <div class="switcher">
            <!--年份-->
            <TiInput
              v-bind="YearDropConfig"
              :value="_api.ViewYear.value"
              @click:prefix-icon="_api.gotoPrevYear()"
              @click:suffix-icon="_api.gotoNextYear()"
              @change="_api.gotoYear($event)" />
            <!--月份-->
            <TiInput
              v-bind="MonthDropConfig"
              :value="_api.ViewMonth.value"
              @click:prefix-icon="_api.gotoPrevMonth()"
              @click:suffix-icon="_api.gotoNextMonth()"
              @change="_api.gotoMonth($event)" />
          </div>
          <!--跳转今日-->
          <a class="today" @click.left="_api.gotoToday()">{{
            I18n.get("today")
          }}</a>
        </template>
      </slot>
    </header>
    <main>
      <!--星期头-->
      <section v-for="head in _api.MonthHeads.value" class="cale-cell as-head">
        <span>{{ head }}</span>
      </section>
      <!--日期格-->
      <section
        v-for="cell in _api.MonthCells.value"
        class="cale-cell as-date"
        :class="{
          'is-current': cell.isCurrent,
          'is-today': cell.isToday,
          'is-in-month': cell.isInMonth,
          'is-out-of-month': !cell.isInMonth,
        }"
        :title="[cell.year, cell.month, cell.date].join('-')">
        <!--定制组件-->
        <component
          v-if="cell.comType"
          :is="cell.comType"
          v-bind="cell.comConf" />
        <!--原生展示-->
        <div class="cell-con" v-else @click.left="_api.changeDate(cell)">
          <span>{{ cell.date }}</span>
        </div>
      </section>
    </main>
    <footer>
      <slot name="tail">
        <TiTextSnippet
          v-if="props.tail"
          className="tablepart as-tail"
          :class="props.tail.className"
          :style="props.tail.style"
          :prefixIcon="props.tail.icon"
          :text="props.tail.text ?? ''"
          :textType="props.tail.textType"
          :comType="props.tail.comType"
          :comConf="props.tail.comConf" />
      </slot>
    </footer>
  </div>
</template>
<style lang="scss">
  @use "./ti-calendar.scss";
</style>
