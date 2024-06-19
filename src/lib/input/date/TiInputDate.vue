<script lang="ts" setup>
  import _ from 'lodash';
  import { computed } from 'vue';
  import { Alert, COM_TYPES, InputDatetimeProps, TiInput } from '../..';
  import { DateInput, DateTime, tiGetDefaultComPropValue } from '../../../core';
  //-----------------------------------------------------
  let emit = defineEmits<{
    (event: 'change', payload: string | number | null): void;
  }>();
  //-----------------------------------------------------
  const COM_TYPE = COM_TYPES.InputDate;
  //-----------------------------------------------------
  function _dft_prop(name: string, dftval: string): string {
    return tiGetDefaultComPropValue(COM_TYPE, name, dftval);
  }
  //-----------------------------------------------------
  const props = withDefaults(defineProps<InputDatetimeProps>(), {
    suffixIcon: 'fas-calendar-days',
    suffixIconClickable: true,
    prefixIconForClean: false,
  });
  //-----------------------------------------------------
  const InputValue = computed(() => {
    if (!props.value) {
      return;
    }
    let format = props.valueFormat ?? _dft_prop('valueFormat', 'yyyy-MM-dd');
    return DateTime.format(props.value, {
      fmt: format,
      trimZero: false,
    });
  });
  //-----------------------------------------------------
  const InputProps = computed(() => {
    return _.pickBy(props, (_v, k) => {
      return /^(readonly|placeholder|autoSelect|(prefix|suffix))/.test(k);
    });
  });
  //-----------------------------------------------------
  function formatValue(val: any): string {
    if (!val) {
      return '';
    }
    let format = props.format ?? _dft_prop('format', 'yyyy-MM-dd');
    //console.log('formatValue', format);
    let d = DateTime.parse(val as DateInput);
    return DateTime.format(d, { fmt: format, trimZero: false });
  }
  //-----------------------------------------------------
  function onValueChange(val: string) {
    val = _.trim(val);
    if (!val) {
      emit('change', null);
    }
    let format = props.valueFormat ?? _dft_prop('valueFormat', 'yyyy-MM-dd');
    let d = DateTime.parse(val);
    if (!d || isNaN(d.getTime())) {
      Alert('Invalid Date Format: ' + val, {
        type: 'warn',
        bodyIcon: 'fas-calendar-xmark',
      });
    }

    if ('timestamp' == props.valueType) {
      emit('change', d.getTime());
    }
    let str = DateTime.format(d, {
      fmt: format,
      trimZero: false,
    });
    emit('change', str);
  }
  //-----------------------------------------------------
  function onClickSuffixIcon() {
    Alert(`It will show a Calendar. 
    But I am not implement it yet.
    You can input the date at the input-box `);
  }
  //-----------------------------------------------------
</script>
<template>
  <TiInput
    v-bind="InputProps"
    :value="InputValue"
    :format="formatValue"
    @click-suffix-icon="onClickSuffixIcon"
    @change="onValueChange" />
</template>
