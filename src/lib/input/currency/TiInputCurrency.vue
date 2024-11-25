<script lang="ts" setup>
  import _ from 'lodash';
  import { computed } from 'vue';
  import { InputNumUnitProps, TiInputNumUnit } from '../../';
  import { Vars } from '../../../_type';
  import { InputCurrencyProps } from './ti-input-currency-types';
  //-----------------------------------------------------
  const emit = defineEmits<{
    (event: 'change', val: Vars): void;
  }>();
  //-----------------------------------------------------
  const props = withDefaults(defineProps<InputCurrencyProps>(), {
    precision: 100,
    decimalPlaces: 2,
    defaultCurrency: 'CNY',
    numAsStr: true,
    currencyWidth: '4em',
    autoSelect: true,
  });
  //-----------------------------------------------------
  const InputNumUnitConfig = computed(() => {
    return {
      autoSelect: props.autoSelect,
      readonly: props.readonly,
      defaultNumber: 0,
      defaultUnit: props.defaultCurrency,
      precision: props.precision,
      decimalPlaces: props.decimalPlaces,
      numAsStr: props.numAsStr,
      unitSelectOnly: false,
      unitWidth: props.currencyWidth,
      valueInputAlign: 'right',
      getNumber: _.first(props.valueKeys),
      getUnit: _.last(props.valueKeys),
      units: {
        readonly: props.readonly,
        ...props.currencies,
        valueCase: 'upperAll',
        tipFormat: 'VT',
        tipUseHint: true,
        useRawValue: true,
        tipListMinWidth: props.tipListMinWidth,
      },
    } as InputNumUnitProps;
  });
  //-----------------------------------------------------
</script>
<template>
  <TiInputNumUnit
    v-bind="InputNumUnitConfig"
    :value="props.value"
    :readonly="props.readonly"
    @change="emit('change', $event)" />
</template>
