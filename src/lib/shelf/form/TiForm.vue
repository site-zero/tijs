<script lang="ts" setup>
  import { FormProps, GridFieldsEmitter, TiGridFields } from '../..';
  //-------------------------------------------------
  defineOptions({
    inheritAttrs: false,
  });
  const emit = defineEmits<GridFieldsEmitter>();
  const props = withDefaults(defineProps<FormProps>(), {
    changeMode: 'diff',
    allowUndefinedFields: true,
    makeVirtualField: true,
  });
</script>
<template>
  <TiGridFields
    v-bind="props"
    @change="emit('change', $event)"
    @change-fields="emit('change-fields', $event)"
    @name-change="emit('name-change', $event)"
    @dom-ready="emit('dom-ready', $event)" />
</template>
<style lang="scss" scoped>
  @use '../../../assets/style/_all.scss' as *;
</style>
