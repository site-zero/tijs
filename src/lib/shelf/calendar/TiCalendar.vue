<script lang="ts" setup>
  import { computed } from "vue";
  import { CssUtils } from "../../../core";
  import { CalendarEmitter, CalendarProps } from "./ti-calendar-types";
  import { useTiCalendarApi } from "./use-ti-calendar-api";
  //-----------------------------------------------------
  const emit = defineEmits<CalendarEmitter>();
  const props = withDefaults(defineProps<CalendarProps>(), {});
  const _api = useTiCalendarApi(props, emit);
  //-----------------------------------------------------
  const TopClass = computed(() => CssUtils.mergeClassName(props.className));
  //-----------------------------------------------------
  const TopStyle = computed(() =>
    CssUtils.mergeStyles([
      {
        width: props.width,
        height: props.height,
      },
      props.style,
    ])
  );
  //-----------------------------------------------------
</script>
<template>
  <div class="ti-calendar" :class="TopClass" :style="TopStyle">
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
        }">
        <!--定制组件-->
        <component
          v-if="cell.comType"
          :is="cell.comType"
          v-bind="cell.comConf" />
        <!--原生展示-->
        <div class="cell-con" v-else>
          <span>{{ cell.dayInMonth }}</span>
        </div>
      </section>
    </main>
  </div>
</template>
<style lang="scss">
  @use "./ti-calendar.scss";
</style>
