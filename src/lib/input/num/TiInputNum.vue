<script lang="ts" setup>
  import _ from 'lodash';
  import { computed } from 'vue';
  import { TiInput } from '../../';
  import { Bank, Num } from '../../../core';
  import { InputNumProps } from './ti-input-num-types';
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
    partSep: ',',
    partWidth: 3,
    partTo: 'left',
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
    // 搞定
    return re;
  });
  //-----------------------------------------------------
  const formatInputText = computed(() => {
    let { partWidth, partSep, partTo } = props;
    if (_.isNumber(partWidth) && partWidth > 0 && partSep) {
      return (val: string) => {
        return Bank.toBankText(val, {
          width: partWidth,
          sep: partSep ?? ' ',
          to: partTo,
        });
      };
    }
  });
  //-----------------------------------------------------
  function onChange(str: string) {
    //console.log('num:change', str)
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
    :autoI18n="props.autoI18n"
    :value="InputValue"
    :format="formatInputText"
    :hideBorder="props.hideBorder"
    :boxFocused="props.boxFocused"
    :width="props.width"
    :prefixText="props.prefixText"
    :suffixText="props.suffixText"
    @change="onChange" />
</template>
<style lang="scss" scoped>
  @use '../../../assets/style/_all.scss' as *;
  @import './ti-input-num.scss';
</style>
