<script lang="ts" setup>
  import { FieldPair } from '../../../';
  import { TiEvent, Vars } from '../../../../core/';
  import { FormItem } from '../ti-form-types';
  import { FormGridLayout } from '../use-form-layout';
  /*-------------------------------------------------------

                        State

-------------------------------------------------------*/
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

                    Methods

-------------------------------------------------------*/
  let emit =
    defineEmits<(event: 'field-change', payload: TiEvent<FieldPair>) => void>();
  // function OnFieldChange(evt: TiEvent<FieldPair>) {
  //   let payload = evt.payload;
  //   console.log("On Group Field Change", payload);
  //   emit("field-change", evt);
  // }
</script>
<template>
  <!-- 这里显示标签栏-->
  <main
    class="form-body"
    mode="tab">
    <!-- 之显示当前组 -->
    Form Mode Tab
  </main>
</template>
