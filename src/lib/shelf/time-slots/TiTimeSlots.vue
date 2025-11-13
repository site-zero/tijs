<script lang="ts" setup>
import { ActionBarEvent, TiLayoutGrid } from "@site0/tijs";
import { computed, watch } from "vue";
import { TiTimeSlotsProps, TiTimeSlotsEmitter } from "./ti-time-slots-types";
import { useTiTimeSlotsApi } from "./use-ti-time-slots-api";
//-----------------------------------------------------
const emit = defineEmits<TiTimeSlotsEmitter>();
const props = withDefaults(defineProps<TiTimeSlotsProps>(), {});
const _api = useTiTimeSlotsApi(props, emit);
//-----------------------------------------------------
</script>
<template>
  <div class="ti-time-slots">This is TiTimeSlots</div>
</template>
<style lang="scss">
@use "./ti-time-slots.scss";
</style>
