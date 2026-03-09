<script lang="ts" setup>
  import _ from "lodash";
  import { computed } from "vue";
  import {
    InputNumProps,
    InputTimeEmitter,
    InputTimeProps,
    TiInputNum,
  } from "../../";
  import { useInputTimeApi } from "./use-input-time-api";
  //-----------------------------------------------------
  const emit = defineEmits<InputTimeEmitter>();
  //-----------------------------------------------------
  const props = withDefaults(defineProps<InputTimeProps>(), {
    valueType: "str",
  });
  //-----------------------------------------------------
  const api = useInputTimeApi(props, emit);
  //-----------------------------------------------------
  function _NUM(n?: string | number | null | undefined) {
    if (_.isNil(n)) {
      return undefined;
    }
    if (_.isString(n)) {
      n = Number(n);
    }
    return n;
  }
  //-----------------------------------------------------
  const InputNumConfig = computed(() => {
    return _.assign(
      {
        readonly: props.readonly,
        placeholder: "00",
        partWidth: 0,
        padStart: 2,
        width: "2em",
        align: "center",
        boxFontSize: "s",
        boxPadding: "s",
      } as InputNumProps,
      props.input
    );
  });
  //-----------------------------------------------------
</script>
<template>
  <div class="ti-input-time">
    <TiInputNum
      v-bind="InputNumConfig"
      :value="api.Time.value.HH"
      :max-value="23"
      @change="api.updateTime({ hours: _NUM($event) })" />
    <div class="time-sep">:</div>
    <TiInputNum
      v-bind="InputNumConfig"
      :value="api.Time.value.mm"
      :max-value="59"
      @change="api.updateTime({ minutes: _NUM($event) })" />
    <template v-if="api.TimeMode.value == 'sec'">
      <div class="time-sep">:</div>
      <TiInputNum
        v-bind="InputNumConfig"
        :value="api.Time.value.ss"
        :max-value="59"
        @change="api.updateTime({ seconds: _NUM($event) })" />
    </template>
  </div>
</template>
<style lang="scss" scoped>
  @use "./ti-input-time.scss";
</style>
