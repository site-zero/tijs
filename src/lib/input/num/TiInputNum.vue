<script lang="ts" setup>
  import _ from 'lodash';
  import { computed } from 'vue';
  import { TiInput } from '../../';
  import { InputNumProps } from './ti-input-num-types';
  import { Num } from '../../../core';
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
    precise: 0,
  });
  //-----------------------------------------------------
  const InputValue = computed(() => {
    if (_.isNil(props.value)) {
      return '';
    }
    if (_.isBoolean(props.value)) {
      return props.value ? '1' : '0';
    }
    return `${props.value}`;
  });
  //-----------------------------------------------------
  function onChange(str: string) {
    let v = (str as any) * 1;
    let v2 = Num.round(v, props.precise ?? 1);
    emit('change', v2);
  }
  //-----------------------------------------------------
</script>
<template>
  <TiInput
    :readonly="props.readonly"
    :placeholder="props.placeholder"
    :autoI18n="props.autoI18n"
    :value="InputValue"
    :hideBorder="props.hideBorder"
    :boxFocused="props.boxFocused"
    @change="onChange" />
</template>
<style lang="scss" scoped>
  @use '../../../assets/style/_all.scss' as *;
  @import './ti-input-num.scss';
</style>
