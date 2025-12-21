<script lang="ts" setup>
  import { computed, ref, useTemplateRef } from "vue";
  import {
    InputBoxExposeApi,
    TiCalendar,
    TiInput,
    TiInputTime,
    useDocking,
  } from "../../../lib";
  import { COM_TYPES } from "../../lib-com-types";
  import {
    InputDateTimeEmitter,
    InputDatetimeProps,
  } from "./ti-input-datetime-types";
  import { useInputDateTimeApi } from "./use-input-datetime-api";
  //-----------------------------------------------------
  let emit = defineEmits<InputDateTimeEmitter>();
  //-----------------------------------------------------
  const props = withDefaults(defineProps<InputDatetimeProps>(), {
    suffixIcon: "fas-calendar-days",
    autoSelect: true,
  });
  //-----------------------------------------------------
  const input = useTemplateRef<InputBoxExposeApi>("input");
  const api = useInputDateTimeApi(props, {
    dftFormat: "yyyy-MM-dd HH:mm:ss",
    COM_TYPE: COM_TYPES.InputDatetime,
    emit,
  });
  const dock = useDocking({
    getElement: () => input.value?.getElement(),
  });
  //-----------------------------------------------------
  const _show_calendar = ref(false);
  //-----------------------------------------------------
  const InputValue = computed(() => api.getInputValue());
  //-----------------------------------------------------
  const InputConfig = computed(() => api.getInputConfig());
  //-----------------------------------------------------
  const InputTimeConfig = computed(() => api.getInputTimeConfig());
  //-----------------------------------------------------
  const PopupStyle = computed(() => {
    if (_show_calendar.value) {
      return dock.genDockingStyle();
    }
  });
  //-----------------------------------------------------
  function onClickCalendar(val: any) {
    console.log(val);
    api.onDateValueChange(val);
  }
  //-----------------------------------------------------
  function onClickSuffixIcon() {
    console.log(input.value?.getElement());
    _show_calendar.value = true;
  }
  //-----------------------------------------------------
</script>
<template>
  <TiInput
    ref="input"
    v-bind="InputConfig"
    :value="InputValue"
    suffix-icon-for="click"
    @change="api.onDateValueChange"
    @click:suffix-icon="onClickSuffixIcon">
    <template #tail>
      <template v-if="_show_calendar">
        <div
          class="ti-input-datetime-popmask"
          @click.left="_show_calendar = false"></div>
        <div class="ti-input-datetime-popup" :style="PopupStyle">
          <TiCalendar
            :time-zone="api.TimeZone.value"
            :value="api.CalendarValue.value"
            value-type="str"
            width="240px"
            height="340px"
            @change="onClickCalendar">
            <template #tail>
              <div class="ti-input-datetime-part-timer">
                <TiInputTime
                  v-bind="InputTimeConfig"
                  :value="api.InputTimeValue.value"
                  @change="api.onTimeValueChange($event as string)" />
              </div>
            </template>
          </TiCalendar>
        </div>
      </template>
    </template>
  </TiInput>
</template>
<style lang="scss" scoped>
  @use "./ti-input-datetime.scss";
</style>
