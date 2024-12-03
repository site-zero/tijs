<script lang="ts" setup>
  import { computed } from 'vue';
  import { InputBoxProps, TiInput } from '../../';
  import { DroplistProps } from './ti-droplist-types';
  //-----------------------------------------------------
  defineOptions({
    inheritAttrs: false,
  });
  //-----------------------------------------------------
  let emit = defineEmits<{
    (event: 'click-prefix-text' | 'click-suffix-text'): void;
    (event: 'change', payload: string): void;
  }>();
  //-----------------------------------------------------
  let props = withDefaults(defineProps<DroplistProps>(), {
    autoI18n: true,
    tipShowTime: 'focus',
    tipUseHint: false,
    tipTidyBy: () => ['main'],
    suffixIconFor: 'load-options',
    autoPrefixIcon: true,
  });
  //-----------------------------------------------------
  type CleansSetup = Pick<InputBoxProps, 'prefixIconFor' | 'showCleanOption'>;
  const Cleans = computed((): CleansSetup => {
    let re = {
      prefixIconFor: props.prefixIconFor,
      showCleanOption: props.showCleanOption,
    } as CleansSetup;
    if ('clear' != re.prefixIconFor && !re.showCleanOption) {
      re.showCleanOption = true;
    }
    return re;
  });
  //-----------------------------------------------------
  function onInputChange(val: any) {
    console.log('onInputChange', val);
    emit('change', val);
  }
  //-----------------------------------------------------
</script>
<template>
  <TiInput
    v-bind="props"
    :canInput="false"
    :trimed="false"
    :mustInOptions="true"
    :prefixIconFor="Cleans.prefixIconFor"
    :showCleanOption="Cleans.showCleanOption"
    @change="onInputChange"
    @click-prefix-text="emit('click-prefix-text')"
    @click-suffix-text="emit('click-suffix-text')" />
</template>
<style lang="scss" scoped>
  @use './ti-droplist.scss';
</style>
