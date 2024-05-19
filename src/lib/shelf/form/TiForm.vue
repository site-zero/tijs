<script lang="ts" setup>
  import { computed, ref } from 'vue';
  import {
    FieldChangeEmitter,
    FormProps,
    GridFieldsDomReadyInfo,
    GridFieldsStrictField,
    TiGridFields,
    useFieldChange,
  } from '../..';
  import { FieldValueChange } from '../../../core';

  const emit = defineEmits<FieldChangeEmitter>();
  const _fields = ref<GridFieldsStrictField[]>([]);
  const props = withDefaults(defineProps<FormProps>(), {
    changeMode: 'all',
  });
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

  function onDomReady(info: GridFieldsDomReadyInfo) {
    _fields.value = info.fields;
  }
</script>
<template>
  <TiGridFields
    v-bind="props"
    @value-change="onValueChange"
    @dom-ready="onDomReady" />
</template>
<style lang="scss" scoped>
  @use '../../../assets/style/_all.scss' as *;
</style>
