<script lang="ts" setup>
  import { TiTags } from '../../';
  import { MultiMultiDroplistProps } from './ti-multi-droplist-types';
  //-----------------------------------------------------
  let emit = defineEmits<{
    (event: 'change', payload: string): void;
  }>();
  //-----------------------------------------------------
  let props = withDefaults(defineProps<MultiMultiDroplistProps>(), {
    placeholder: 'i18n:no-selected',
  });
  //-----------------------------------------------------
  function onChange(val: any) {
    //console.log('onInputChange', val);
    emit('change', val);
  }
  //-----------------------------------------------------
</script>
<template>
  <div
    tabindex="0"
    href="javascript:void(0)"
    class="ti-multi-droplist"
    :style="props.style">
    <TiTags
      :style="props.tagsStyle"
      :placeholder="props.placeholder"
      :value="[]" />
  </div>
</template>
<style lang="scss" scoped>
  @use './ti-multi-droplist.scss';
</style>
