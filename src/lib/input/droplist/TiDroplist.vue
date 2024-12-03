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
  // type CleansSetup = Pick<InputBoxProps, 'prefixIconFor' | 'showCleanOption'>;
  // const Cleans = computed((): CleansSetup => {
  //   let re = {
  //     prefixIconFor: props.prefixIconFor,
  //     showCleanOption: props.showCleanOption,
  //   } as CleansSetup;
  //   if ('clear' != re.prefixIconFor && !re.showCleanOption) {
  //     re.showCleanOption = true;
  //   }
  //   return re;
  // });
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
    @change="onInputChange" />
</template>
<style lang="scss" scoped>
  @use './ti-droplist.scss';
</style>
