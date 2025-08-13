<script lang="ts" setup>
  import { FormProps, GridFieldsEmitter, TiGridFields } from '../..';
  //-------------------------------------------------
  defineOptions({
    inheritAttrs: true,
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
    @change-validate="emit('change-validate', $event)"
    @name-change="emit('name-change', $event)"
    @dom-ready="emit('dom-ready', $event)">
    <template v-slot:head>
      <slot name="head"></slot>
    </template>
  </TiGridFields>
</template>
<style lang="scss" scoped>
  @use '../../../assets/style/_all.scss' as *;
</style>
