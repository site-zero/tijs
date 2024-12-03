<script lang="ts" setup>
  import _ from 'lodash';
  import { computed } from 'vue';
  import { Alert, TiInput } from '../../';
  import { DateInput } from '../../../_type';
  import { DateTime, tiGetDefaultComPropValue } from '../../../core';
  import { COM_TYPES } from '../../lib-com-types';
  import { InputDatetimeProps } from './ti-input-datetime-types';
  //-----------------------------------------------------
  let emit = defineEmits<{
    (event: 'change', payload: string | number | null): void;
  }>();
  //-----------------------------------------------------
  const COM_TYPE = COM_TYPES.InputDatetime;
  //-----------------------------------------------------
  function _dft_prop(name: string, dftval: string): string {
    return tiGetDefaultComPropValue(COM_TYPE, name, dftval);
  }
  //-----------------------------------------------------
  const props = withDefaults(defineProps<InputDatetimeProps>(), {
    suffixIcon: 'fas-calendar-day',
    suffixIconClickable: true,
    prefixIconForClean: false,
    autoSelect: true,
  });
  //-----------------------------------------------------
  const InputValue = computed(() => {
    if (!props.value) {
      return;
    }
    let format =
      props.valueFormat ?? _dft_prop('valueFormat', 'yyyy-MM-dd HH:mm:ss');

    return DateTime.format(props.value, {
      fmt: format,
      trimZero: false,
    });
  });
  //-----------------------------------------------------
  const InputProps = computed(() => {
    let re = _.pickBy(props, (_v, k) => {
      return /^(readonly|placeholder|autoSelect|(prefix|suffix))/.test(k);
    });
    if (props.prefixIconForClean) {
      delete re.prefixIconForClean;
      re.prefixIconFor = 'clear';
    }
    return re;
  });
  //-----------------------------------------------------
  function formatValue(val: any): string {
    if (!val?.val) {
      return '';
    }
    let format = props.format ?? _dft_prop('format', 'yyyy-MM-dd HH:mm:ss');
    let d = DateTime.parse(val.val as DateInput);
    if (isNaN(d.getTime())) {
      throw 'Invalid Date: ' + val;
    }
    return DateTime.format(d, { fmt: format, trimZero: false });
  }
  //-----------------------------------------------------
  function onValueChange(val: string) {
    val = _.trim(val);
    if (!val) {
      emit('change', null);
    }
    let format =
      props.valueFormat ?? _dft_prop('valueFormat', 'yyyy-MM-dd HH:mm:ss');
    let quickMode = props.quickInputMode ?? _dft_prop('quickInputMode', '');
    console.log('quickInputMode', quickMode)

    let d: Date | undefined;
    if (DateTime.isDateTimeQuickParseMode(quickMode)) {
      d = DateTime.quickParse(val, { mode: quickMode });
    } else {
      d = DateTime.parse(val);
    }

    // 判断日期对象是否有效
    if (!d || isNaN(d.getTime())) {
      Alert('Invalid Date Format: ' + val, {
        type: 'warn',
        bodyIcon: 'fas-calendar-xmark',
      });
      return;
    }

    // 仅仅是时间戳
    if ('timestamp' == props.valueType) {
      emit('change', d.getTime());
    }
    // 默认采用时间字符串
    else {
      let str = DateTime.format(d, {
        fmt: format,
        trimZero: false,
      });
      emit('change', str);
    }
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
