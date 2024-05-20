<script lang="ts" setup>
  import { computed, ref } from 'vue';
  import {
    FieldChangeEmitter,
    FormProps,
    GridFieldsFeature,
    GridFieldsStrictField,
    TiGridFields,
    useFieldChange,
  } from '../..';
  import { FieldValueChange } from '../../../core';
  //-------------------------------------------------
  defineOptions({
    inheritAttrs: false,
  });
  const emit = defineEmits<FieldChangeEmitter>();
  const _fields = ref<GridFieldsStrictField[]>([]);
  const props = withDefaults(defineProps<FormProps>(), {
    changeMode: 'diff',
  });
  //-------------------------------------------------
  const Change = computed(() =>
    useFieldChange<GridFieldsStrictField>({
      changeMode: props.changeMode,
      linkFields: props.linkFields,
      fields: _fields.value,
    })
  );

  /**
   * 处理值的修改
   *
   * @param change 修改的值
   */
  async function onValueChange(change: FieldValueChange) {
    Change.value.handleValueChange(change, {
      emit,
      data: props.data || {},
      checkEquals: props.checkEquals,
    });
  }

  function whenGrid(grid: GridFieldsFeature) {
    _fields.value = grid.fieldItems;
  }
</script>
<template>
  <TiGridFields
    v-bind="props"
    :when-grid="whenGrid"
    @value-change="onValueChange" />
</template>
<style lang="scss" scoped>
  @use '../../../assets/style/_all.scss' as *;
</style>
