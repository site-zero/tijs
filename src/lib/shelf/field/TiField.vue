<script lang="ts" setup>
  import { computed } from 'vue';
  import { FieldPair } from '../../';
  import { COM_TYPES } from '../../lib-com-types';
  import { FieldProps, useField } from './use-field';

  //-------------------------------------------------
  defineOptions({
    name: COM_TYPES.Field,
    inheritAttrs: false,
    nameWidth: 0,
  });
  //-------------------------------------------------
  let props = withDefaults(defineProps<FieldProps>(), {
    autoValue: 'value',
    checkEquals: true,
  });
  //-------------------------------------------------
  let emit = defineEmits<{
    (event: 'change', payload: FieldPair): void;
  }>();
  //-------------------------------------------------
  const Fld = computed(() => useField(props, { emit }));
  const hasTitle = computed(() => (Fld.value.FieldTitle ? true : false));
  //-------------------------------------------------
</script>

<template>
  <div
    class="ti-field-name"
    :style="Fld.FieldNameStyle"
    v-if="hasTitle">
    <div class="field-name-con">
      <span>{{ Fld.FieldTitle }}</span>
    </div>
  </div>
  <div class="ti-field-value">
    <component
      :is="Fld.FieldComType"
      v-bind="Fld.FieldComConf"
      @change="Fld.OnFieldChange" />
  </div>
  <div
    class="ti-field-tip"
    v-if="Fld.hasTip">
    {{ tip }}
  </div>
</template>

<style lang="scss" scoped>
  @import './ti-field.scss';
</style>
