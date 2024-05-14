<script lang="ts" setup>
  import { FieldPair } from '../../../';
  import { Vars } from '../../../../core/ti.ts';
  import TiFormItem from '../item/TiFormItem.vue';
  import { FormItem } from '../ti-form-types';
  import { FormGridLayout } from '../use-form-layout';
  //-------------------------------------------------
  defineProps<{
    fields: FormItem[];
    layout: FormGridLayout;
    data: Vars;
    maxFieldNameWidth?: number;
  }>();
  //-------------------------------------------------
  let emit = defineEmits<{
    (event: 'field-change', payload: FieldPair): void;
  }>();
  //-------------------------------------------------
  function OnFieldChange(payload: FieldPair) {
    //console.log('On Group Field Change', payload);
    emit('field-change', payload);
  }
  //-------------------------------------------------
</script>
<template>
  <TiFormItem
    uniqKey="ROOT"
    race="group"
    :maxFieldNameWidth="maxFieldNameWidth"
    :data="data"
    :layout="layout"
    :fields="fields"
    :style="{}"
    @change="OnFieldChange" />
</template>
