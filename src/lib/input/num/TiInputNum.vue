<script lang="ts" setup>
  import _ from 'lodash';
  import { computed } from 'vue';
  import { Bank, Num } from '../../../core';
  import { InputNumProps } from './ti-input-num-types';
  import { TiInput } from '../../';
  //-----------------------------------------------------
  defineOptions({
    inheritAttrs: false,
  });
  //-----------------------------------------------------
  const emit = defineEmits<{
    (event: 'change', payload: number): void;
  }>();
  //-----------------------------------------------------
  const props = withDefaults(defineProps<InputNumProps>(), {
    value: null,
    precision: 0,
    decimalPlaces: 0,
    partSep: ',',
    partWidth: 3,
    partTo: 'left',
    align: 'right',
  });
  //-----------------------------------------------------
  const InputValue = computed(() => {
    if (_.isNil(props.value)) {
      return '';
    }
    if (_.isBoolean(props.value)) {
      return props.value ? '1' : '0';
    }
    let re = `${props.value}`;
    // 移除分隔符号
    if (props.partSep) {
      re = re.replaceAll(props.partSep, '');
    }
    // 格式化
    let { partWidth, partSep, partTo } = props;
    if (_.isNumber(partWidth) && partWidth > 0 && partSep) {
      return Bank.toBankText(re, {
        width: partWidth,
        sep: partSep ?? ' ',
        to: partTo,
        decimalPlaces: props.decimalPlaces,
      });
    }
    // 搞定
    return re;
  });
  //-----------------------------------------------------
  function onChange(str: string) {
    console.log('num:change', str);
    let v = (str as any) * 1;
    let v2 = Num.round(v, props.precision ?? 1);
    if (!_.isNil(props.maxValue) && v2 > props.maxValue) {
      v2 = props.maxValue;
    }
    if (!_.isNil(props.minValue) && v2 < props.minValue) {
      v2 = props.minValue;
    }
    emit('change', v2);
  }
  //-----------------------------------------------------
</script>
<template>
  <TiInput
    :style="props.style"
    :readonly="props.readonly"
    :placeholder="props.placeholder"
    :auto-select="props.autoSelect"
    :autoI18n="props.autoI18n"
    :value="InputValue"
    :hideBorder="props.hideBorder"
    :inputStyle="props.inputStyle"
    :align="align"
    :boxFontSize="boxFontSize"
    :boxPadding="boxPadding"
    :boxRadius="boxRadius"
    :type="type"
    :width="props.width"
    @change="onChange" />
</template>
