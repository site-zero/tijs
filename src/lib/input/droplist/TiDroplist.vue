<script lang="ts" setup>
  import { TiInput, ValueBoxEmits } from '../../';
  import { DropListProps } from './ti-droplist-types';
  //-----------------------------------------------------
  defineOptions({
    inheritAttrs: false,
  });
  //-----------------------------------------------------
  let emit = defineEmits<ValueBoxEmits>();
  //-----------------------------------------------------
  let props = withDefaults(defineProps<DropListProps>(), {
    autoI18n: true,
    tipShowTime: 'focus',
    tipUseHint: false,
    tipTidyBy: () => ['main'],
    prefixIconForClean: false,
    prefixHoverIcon: 'zmdi-close',
    suffixIcon: 'zmdi-caret-down',
    suffixIconClickable: true,
    mustInOptions: true,
    autoPrefixIcon: true,
  });
</script>
<template>
  <TiInput
    v-bind="props"
    :canInput="false"
    :trimed="false"
    :mustInOptions="true"
    @change="emit('change', $event)"
    @click-prefix-icon="emit('click-prefix-icon')"
    @click-prefix-text="emit('click-prefix-text')"
    @click-suffix-icon="emit('click-suffix-icon')"
    @click-suffix-text="emit('click-suffix-text')" />
</template>
<style lang="scss" scoped>
  @use '../../../assets/style/_all.scss' as *;
  @import './ti-droplist.scss';
</style>
