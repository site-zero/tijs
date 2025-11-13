<script lang="ts" setup>
import { ActionBarEvent, TiLayoutGrid } from "@site0/tijs";
import { computed, watch } from "vue";
import { TiCalendarProps, TiCalendarEmitter } from "./ti-calendar-types";
import { useTiCalendarApi } from "./use-ti-calendar-api";
//-----------------------------------------------------
const emit = defineEmits<TiCalendarEmitter>();
const props = withDefaults(defineProps<TiCalendarProps>(), {});
const _api = useTiCalendarApi(props, emit);
//-----------------------------------------------------
</script>
<template>
  <div class="ti-calendar">This is TiCalendar</div>
</template>
<style lang="scss">
@use "./ti-calendar.scss";
</style>
