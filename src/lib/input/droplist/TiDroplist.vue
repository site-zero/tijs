<script lang="ts" setup>
  import { computed } from 'vue';
  import { TiInput } from '../../';
  import { DropListProps } from './ti-droplist-types';
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
  let props = withDefaults(defineProps<DropListProps>(), {
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
    if (props.prefixIconForClean && props.showCleanOption) {
      return { prefixIconForClean: true, showCleanOption: true };
    }
    if (!props.prefixIconForClean && props.showCleanOption) {
      return { prefixIconForClean: false, showCleanOption: true };
    }
    if (props.prefixIconForClean && !props.showCleanOption) {
      return { prefixIconForClean: true, showCleanOption: false };
    }
    return { prefixIconForClean: false, showCleanOption: true };
  });
  //-----------------------------------------------------
</script>
<template>
  <TiInput
    v-bind="props"
    :canInput="false"
    :trimed="false"
    :mustInOptions="true"
    :prefixIconForClean="Cleans.prefixIconForClean"
    :showCleanOption="Cleans.showCleanOption"
    @change="emit('change', $event)"
    @click-prefix-text="emit('click-prefix-text')"
    @click-suffix-text="emit('click-suffix-text')" />
</template>
<style lang="scss" scoped>
  @use '../../../assets/style/_all.scss' as *;
  @import './ti-droplist.scss';
</style>
