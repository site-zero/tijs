<script lang="ts" setup>
  import _ from 'lodash';
  import { computed } from 'vue';
  import { DateInput } from '../../../_type';
  import { DateTime, tiGetDefaultComPropValue } from '../../../core';
  import { Alert, InputDatetimeProps, TiInput } from '../../../lib';
  import { COM_TYPES } from '../../lib-com-types';
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
    autoSelect: true,
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
    if (!val?.val) {
      return '';
    }
    let format = props.format ?? _dft_prop('format', 'yyyy-MM-dd');
    let d = DateTime.parse(val.val as DateInput);
    // console.log('formatValue', format, d);
    return DateTime.format(d, { fmt: format, trimZero: false });
  }
  //-----------------------------------------------------
  function onValueChange(val: string) {
    val = _.trim(val);
    if (!val) {
      emit('change', null);
      return;
    }
    let format = props.valueFormat ?? _dft_prop('valueFormat', 'yyyy-MM-dd');
    let quickMode = props.quickInputMode ?? _dft_prop('quickInputMode', '');
    console.log('quickInputMode', quickMode);

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
