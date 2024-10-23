<script lang="ts" setup>
  import _ from 'lodash';
  import { computed } from 'vue';
  import { TiInput } from '../../';
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
    prefixIconForClean: false,
    prefixHoverIcon: 'zmdi-close',
    suffixIcon: 'zmdi-caret-down',
    suffixIconClickable: false,
    mustInOptions: true,
    autoPrefixIcon: true,
  });
  //-----------------------------------------------------
  type CleansSetup = {
    prefixIconForClean: boolean;
    showCleanOption: boolean;
  };
  const Cleans = computed((): CleansSetup => {
    let re = {
      prefixIconForClean: false,
      showCleanOption: false,
    } as CleansSetup;
    if (_.isBoolean(props.prefixIconForClean)) {
      re.prefixIconForClean = props.prefixIconForClean;
    }
    if (_.isBoolean(props.showCleanOption)) {
      re.showCleanOption = props.showCleanOption;
    }
    if (_.isNil(props.prefixIconForClean) && _.isNil(props.showCleanOption)) {
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
    :checkValueWhenClose="false"
    :prefixIconForClean="Cleans.prefixIconForClean"
    :showCleanOption="Cleans.showCleanOption"
    @change="onInputChange"
    @click-prefix-text="emit('click-prefix-text')"
    @click-suffix-text="emit('click-suffix-text')" />
</template>
<style lang="scss" scoped>
  @use './ti-droplist.scss';
</style>
