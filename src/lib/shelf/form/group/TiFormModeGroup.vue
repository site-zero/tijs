<script lang="ts" setup>
  import { Vars } from '../../../../core/ti.ts';
  import { FieldPair, TiEvent } from '../../../';
  import TiFormItem from '../item/TiFormItem.vue';
  import { FormItem } from '../use-form-field';
  import { FormGridLayout } from '../use-form-layout';
  /*-------------------------------------------------------

                        Props

-------------------------------------------------------*/
  defineProps<{
    fields: FormItem[];
    layout: FormGridLayout;
    data: Vars;
    maxFieldNameWidth?: number;
  }>();
  /*-------------------------------------------------------

                  Bus & Notify & Emit

-------------------------------------------------------*/
  let emit = defineEmits<{
    (event: 'field-change', payload: TiEvent<FieldPair>): void;
  }>();
  /*-------------------------------------------------------

                    Methods

-------------------------------------------------------*/

  /*-------------------------------------------------------

                  Event Handler

        直接将字段修改的事件传递到表单控件处来处理

-------------------------------------------------------*/
  function OnFieldChange(evt: TiEvent<FieldPair>) {
    // console.log("On Group Field Change", payload);
    emit('field-change', evt);
  }
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
