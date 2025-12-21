<script lang="ts" setup>
  import { computed, ref, useTemplateRef } from "vue";
  import {
    InputBoxExposeApi,
    InputDateTimeEmitter,
    InputDatetimeProps,
    TiCalendar,
    TiInput,
    useDocking,
  } from "../../";
  import { COM_TYPES } from "../../lib-com-types";
  import { useInputDateTimeApi } from "../datetime/use-input-datetime-api";
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
    dftFormat: "yyyy-MM-dd",
    COM_TYPE: COM_TYPES.InputDate,
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
  const InputProps = computed(() => api.getInputConfig());
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
    _show_calendar.value = false;
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
    v-bind="InputProps"
    :value="InputValue"
    suffix-icon-for="click"
    @change="api.onDateValueChange"
    @click:suffix-icon="onClickSuffixIcon">
    <template #tail>
      <template v-if="_show_calendar">
        <div
          class="ti-input-date-popmask"
          @click.left="_show_calendar = false"></div>
        <div class="ti-input-date-popup" :style="PopupStyle">
          <TiCalendar
            :time-zone="api.TimeZone.value"
            :value="api.ValueAsStr.value"
            value-type="str"
            width="240px"
            height="240px"
            @change="onClickCalendar" />
        </div>
      </template>
    </template>
  </TiInput>
</template>
<style lang="scss" scoped>
  @use "./ti-input-date.scss";
</style>
